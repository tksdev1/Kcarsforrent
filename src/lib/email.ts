import { Resend } from "resend";

import type { RenderedEmail } from "@/emails/templates";

export interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
  /** True when no API key is configured — dev mode, not a real failure. */
  skipped?: boolean;
}

let client: Resend | null = null;

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

function fromAddress(): string {
  return (
    process.env.BOOKING_FROM_EMAIL ?? "K Cars for Rent <onboarding@resend.dev>"
  );
}

export function ownerRecipients(): string[] {
  return (process.env.OWNER_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

/**
 * How long to wait for the mail provider before giving up on a send.
 *
 * Netlify functions are killed at 10 seconds. Without a bound here, a slow or
 * unreachable Resend would hold the booking request open until the whole
 * function timed out — and because the booking is saved *before* the email is
 * attempted, that turns a request we successfully recorded into a hard error
 * in the customer's browser. Better to abandon the send, record it as failed,
 * and still hand back the reference.
 */
const SEND_TIMEOUT_MS = 6000;

/** Sentinel for the timeout arm of the race below. */
const TIMED_OUT = Symbol("email-send-timeout");

/**
 * Sends one email. Never throws — a booking must still be recorded even if the
 * mail provider is having a bad day, so callers get a result object instead of
 * an exception and the failure is surfaced in the response and the logs.
 */
export async function sendEmail(
  to: string | string[],
  email: RenderedEmail,
  options: { replyTo?: string } = {},
): Promise<SendResult> {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (recipients.length === 0) {
    return { ok: false, error: "No recipient address configured." };
  }

  const resend = getClient();
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — would have sent "${email.subject}" to ${recipients.join(", ")}`,
    );
    return { ok: false, skipped: true, error: "RESEND_API_KEY is not set." };
  }

  // Resend's SDK takes no abort signal, so the send is raced against a timer
  // instead. The request itself may still be in flight afterwards — that's
  // fine, and often it still arrives; what matters is that we stop waiting.
  const send = resend.emails.send({
    from: fromAddress(),
    to: recipients,
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: options.replyTo ?? process.env.BOOKING_REPLY_TO,
  });
  // Nothing awaits the loser of the race, so swallow a late rejection here to
  // keep it from surfacing as an unhandled rejection and killing the function.
  send.catch(() => {});

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<typeof TIMED_OUT>((resolve) => {
    timer = setTimeout(() => resolve(TIMED_OUT), SEND_TIMEOUT_MS);
  });

  try {
    const outcome = await Promise.race([send, timeout]);

    if (outcome === TIMED_OUT) {
      const message = `The mail provider didn't respond within ${SEND_TIMEOUT_MS / 1000}s.`;
      console.error("[email] Failed to send:", message);
      return { ok: false, error: message };
    }

    const { data, error } = outcome;

    if (error) {
      console.error("[email] Resend rejected the message:", error);
      return { ok: false, error: error.message ?? "Resend rejected the message." };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send:", message);
    return { ok: false, error: message };
  } finally {
    clearTimeout(timer);
  }
}
