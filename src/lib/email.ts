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

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress(),
      to: recipients,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: options.replyTo ?? process.env.BOOKING_REPLY_TO,
    });

    if (error) {
      console.error("[email] Resend rejected the message:", error);
      return { ok: false, error: error.message ?? "Resend rejected the message." };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send:", message);
    return { ok: false, error: message };
  }
}
