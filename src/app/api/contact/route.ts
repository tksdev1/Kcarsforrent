import { NextResponse } from "next/server";

import { contactMessage } from "@/emails/templates";
import { ownerRecipients, sendEmail } from "@/lib/email";
import { contactSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields.",
        errors: fieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const input = parsed.data;

  // Honeypot — pretend it worked, do nothing.
  if (input.website) return NextResponse.json({ ok: true });

  const result = await sendEmail(ownerRecipients(), contactMessage(input), {
    replyTo: input.email,
  });

  if (!result.ok && !result.skipped) {
    return NextResponse.json(
      {
        message:
          "We couldn't send that just now. Please call us instead — sorry about this.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
