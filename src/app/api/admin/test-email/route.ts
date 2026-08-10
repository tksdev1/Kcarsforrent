import { NextResponse } from "next/server";

import { testEmail } from "@/emails/templates";
import { ownerRecipients, sendEmail } from "@/lib/email";
import { checkEmailHealth } from "@/lib/email-health";
import { requireAdmin } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sends a test email to the owner's notification address.
 *
 * Exists so email setup can be verified in one click rather than by submitting
 * a fake booking and then deleting it. Admin-only, and it only ever sends to
 * the configured owner address — never to an address supplied by the caller,
 * so this can't be turned into an open relay.
 */
export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const health = checkEmailHealth();
  const recipients = ownerRecipients();

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "RESEND_API_KEY isn't set, so nothing was sent. Add it in Netlify (use the button above), then redeploy.",
        problems: health.problems,
      },
      { status: 400 },
    );
  }

  if (recipients.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "OWNER_NOTIFICATION_EMAIL isn't set, so there's nowhere to send the test.",
        problems: health.problems,
      },
      { status: 400 },
    );
  }

  const result = await sendEmail(recipients, testEmail());

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: `Resend rejected it: ${result.error ?? "unknown error"}`,
        problems: health.problems,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Sent to ${recipients.join(", ")}. If it doesn't arrive within a minute, check spam.`,
    problems: health.problems,
  });
}
