import { NextResponse } from "next/server";

import { checkAvailability } from "@/lib/bookings";
import { isValidDate } from "@/lib/dates";
import { getCarById } from "@/lib/fleet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Live availability check for the booking form. Read-only, no side effects. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const carId = searchParams.get("carId") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  if (!carId || !isValidDate(startDate) || !isValidDate(endDate)) {
    return NextResponse.json(
      { available: false, reason: "Choose a car and valid dates." },
      { status: 400 },
    );
  }

  if (endDate < startDate) {
    return NextResponse.json({
      available: false,
      reason: "The drop-off date can't be before the pick-up date.",
    });
  }

  const car = await getCarById(carId);
  if (!car || !car.active) {
    return NextResponse.json({
      available: false,
      reason: "That car isn't available to book.",
    });
  }

  const result = await checkAvailability(carId, startDate, endDate);
  return NextResponse.json(result);
}
