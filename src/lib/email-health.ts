import { ownerRecipients } from "./email";

export interface EmailHealth {
  configured: boolean;
  /** Human-readable problems, safe to show in the dashboard. */
  problems: string[];
  fromAddress: string | null;
  ownerRecipients: string[];
}

/**
 * Checks that email is actually set up.
 *
 * Without this the failure mode is silent: bookings are still recorded, the
 * customer is still told "we've emailed you", and nothing anywhere says the
 * mail never left. Surfaced at the top of the dashboard so a missing key is
 * obvious rather than something you find out about from an angry customer.
 */
export function checkEmailHealth(): EmailHealth {
  const problems: string[] = [];

  const hasKey = Boolean(process.env.RESEND_API_KEY);
  if (!hasKey) {
    problems.push(
      "RESEND_API_KEY isn't set, so no email is being sent at all. Bookings are still being recorded, but nobody is being notified.",
    );
  }

  const recipients = ownerRecipients();
  if (recipients.length === 0) {
    problems.push(
      "OWNER_NOTIFICATION_EMAIL isn't set, so new booking requests aren't being emailed to you.",
    );
  }

  const from = process.env.BOOKING_FROM_EMAIL ?? null;
  if (!from) {
    problems.push(
      "BOOKING_FROM_EMAIL isn't set, so mail goes out from the Resend test address and only reaches your own Resend account.",
    );
  } else if (from.includes("onboarding@resend.dev")) {
    problems.push(
      "BOOKING_FROM_EMAIL is still Resend's test address. Mail will only reach your own Resend account — customers won't get anything. Verify your domain and switch it over before launch.",
    );
  }

  return {
    configured: problems.length === 0,
    problems,
    fromAddress: from,
    ownerRecipients: recipients,
  };
}
