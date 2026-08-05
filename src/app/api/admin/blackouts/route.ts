import { NextResponse } from "next/server";

import { addBlackout, deleteBlackout, getBlackouts } from "@/lib/bookings";
import { requireAdmin } from "@/lib/guard";
import { blackoutSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  return NextResponse.json({ blackouts: await getBlackouts() });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = blackoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields.",
        errors: fieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const { carId, startDate, endDate, reason } = parsed.data;

  const blackout = await addBlackout({
    // The form submits "" for "every car".
    carId: carId === "" ? null : carId,
    startDate,
    endDate,
    reason,
  });

  return NextResponse.json({ blackout }, { status: 201 });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Missing id." }, { status: 400 });
  }

  await deleteBlackout(id);
  return NextResponse.json({ ok: true });
}
