import { NextResponse } from "next/server";

import {
  customerRequestReceived,
  ownerNewRequest,
} from "@/emails/templates";
import {
  checkAvailability,
  newBookingId,
  newReference,
  saveBooking,
} from "@/lib/bookings";
import { ownerRecipients, sendEmail, type SendResult } from "@/lib/email";
import { carDisplayName, getCarById } from "@/lib/fleet";
import { rentalDays, todayISO } from "@/lib/dates";
import { buildQuote } from "@/lib/pricing";
import type { Booking, EmailDelivery, EmailOutcome } from "@/lib/types";
import { bookingRequestSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function outcomeOf(result: SendResult): EmailOutcome {
  if (result.ok) return "sent";
  // `skipped` means no API key — a configuration gap, not a delivery failure,
  // and worth distinguishing because the fix is completely different.
  return result.skipped ? "not-configured" : "failed";
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Malformed request." },
      { status: 400 },
    );
  }

  const parsed = bookingRequestSchema.safeParse(payload);
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

  // Honeypot: a filled hidden field means a bot. Return a plausible success so
  // it doesn't learn to work around the check — but store nothing and send
  // nothing.
  if (input.website) {
    return NextResponse.json({ reference: newReference() }, { status: 201 });
  }

  if (input.startDate < todayISO()) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields.",
        errors: { startDate: "Pick-up can't be in the past." },
      },
      { status: 422 },
    );
  }

  const car = await getCarById(input.carId);
  if (!car || !car.active) {
    return NextResponse.json(
      {
        message: "That car isn't available.",
        errors: { carId: "Please choose a car from the list." },
      },
      { status: 422 },
    );
  }

  if (rentalDays(input.startDate, input.endDate) < car.minDays) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields.",
        errors: {
          endDate: `The ${car.name} has a ${car.minDays}-day minimum rental.`,
        },
      },
      { status: 422 },
    );
  }

  // Authoritative availability check. The browser checks too, but only this one
  // counts — the dates could have been taken while the form was open.
  const availability = await checkAvailability(
    car.id,
    input.startDate,
    input.endDate,
  );
  if (!availability.available) {
    return NextResponse.json(
      {
        message: availability.reason ?? "Those dates are no longer available.",
        errors: {
          startDate: availability.reason ?? "No longer available.",
        },
      },
      { status: 409 },
    );
  }

  const now = new Date().toISOString();
  const booking: Booking = {
    id: newBookingId(),
    reference: newReference(),
    carId: car.id,
    carName: carDisplayName(car),
    customer: {
      name: input.name,
      email: input.email,
      phone: input.phone,
    },
    startDate: input.startDate,
    endDate: input.endDate,
    pickupTime: input.pickupTime,
    dropoffTime: input.dropoffTime,
    occasion: input.occasion,
    deliveryRequested: input.deliveryRequested,
    deliveryAddress: input.deliveryRequested ? input.deliveryAddress : "",
    notes: input.notes,
    status: "pending",
    quote: buildQuote({
      car,
      startDate: input.startDate,
      endDate: input.endDate,
      deliveryRequested: input.deliveryRequested,
    }),
    ownerNote: "",
    createdAt: now,
    updatedAt: now,
  };

  // Persist first. If email delivery fails the booking still exists in the
  // dashboard, which is far better than losing it because a mail API blipped.
  await saveBooking(booking);

  const [customerResult, ownerResult] = await Promise.all([
    sendEmail(booking.customer.email, customerRequestReceived(booking)),
    sendEmail(ownerRecipients(), ownerNewRequest(booking), {
      replyTo: booking.customer.email,
    }),
  ]);

  if (!customerResult.ok) {
    console.error(
      `[bookings] ${booking.reference} saved but the customer email failed:`,
      customerResult.error,
    );
  }
  if (!ownerResult.ok) {
    console.error(
      `[bookings] ${booking.reference} saved but the owner email failed:`,
      ownerResult.error,
    );
  }

  // Record the outcome on the booking. Previously this only went to the
  // console and the HTTP response, so once the request was over there was no
  // way to tell from the dashboard whether a booking had actually been
  // emailed — the exact question the owner needs answered.
  const emailDelivery: EmailDelivery = {
    customer: outcomeOf(customerResult),
    owner: outcomeOf(ownerResult),
    error: customerResult.error ?? ownerResult.error,
    attemptedAt: new Date().toISOString(),
  };
  await saveBooking({ ...booking, emailDelivery });

  return NextResponse.json(
    {
      reference: booking.reference,
      status: booking.status,
      emailed: {
        customer: customerResult.ok,
        owner: ownerResult.ok,
      },
    },
    { status: 201 },
  );
}
