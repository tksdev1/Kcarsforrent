import {
  customerConfirmed,
  customerRequestReceived,
  customerStatusChanged,
  ownerNewRequest,
} from "@/emails/templates";
import { addDays, todayISO } from "@/lib/dates";
import { getActiveCars } from "@/lib/fleet";
import type { Booking, Car } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Preview of every automated email, rendered from a sample booking.
 *
 * This exists so the owner can see exactly what customers receive — and check
 * their branding and contact details look right — without having to make a
 * test booking first.
 */
function sampleBooking(car: Car | null): Booking {
  const start = addDays(todayISO(), 12);
  const end = addDays(start, 2);

  const dailyRate = car?.dailyRate ?? 189;
  const weekendRate = car?.weekendRate ?? dailyRate;
  const cleaningFee = car?.cleaningFee ?? 45;
  const deliveryFee = car?.deliveryFee ?? 60;

  return {
    id: "bk_sample",
    reference: "KC-SAMPLE",
    carId: car?.id ?? "car_sample",
    // Uses your real car and rates so the preview matches what customers get,
    // rather than drifting every time the fleet is edited.
    carName: car ? `${car.name} — ${car.theme}` : "Your car — Your theme",
    customer: {
      name: "Rosa Martinez",
      email: "rosa@example.com",
      phone: "(555) 014-2277",
    },
    startDate: start,
    endDate: end,
    pickupTime: "10:00",
    dropoffTime: "17:00",
    occasion: "Quinceañera",
    deliveryRequested: true,
    deliveryAddress: "1420 W Main St, Visalia, CA",
    notes: "Arriving at the venue for 2pm — please leave the roof sign lit.",
    status: "pending",
    quote: {
      days: 3,
      lines: [
        { label: `Weekday rate — 1 day × $${dailyRate}`, amount: dailyRate },
        {
          label: `Weekend rate — 2 days × $${weekendRate}`,
          amount: weekendRate * 2,
        },
        { label: "Cleaning & prep", amount: cleaningFee },
        { label: "Delivery & pickup", amount: deliveryFee },
      ],
      total: dailyRate + weekendRate * 2 + cleaningFee + deliveryFee,
    },
    ownerNote: "See you Friday! Parking is round the back.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default async function EmailPreviewPage() {
  const cars = await getActiveCars();
  const base = sampleBooking(cars[0] ?? null);

  const previews = [
    {
      title: "Customer — request received",
      when: "Sent the moment someone submits the booking form.",
      email: customerRequestReceived(base),
    },
    {
      title: "You — new booking request",
      when: "Sent to your notification address at the same time.",
      email: ownerNewRequest(base),
    },
    {
      title: "Customer — confirmed",
      when: "Sent when you hit “Confirm & email” on the Bookings page.",
      email: customerConfirmed({ ...base, status: "confirmed" }),
    },
    {
      title: "Customer — declined or cancelled",
      when: "Sent when you decline a request or cancel a confirmed booking.",
      email: customerStatusChanged({ ...base, status: "declined" }),
    },
  ];

  return (
    <>
      <h1 className="font-display text-4xl font-extrabold">Email previews</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Exactly what gets sent, rendered from a sample booking. Check your phone
        number and email address read correctly — they come from{" "}
        <code className="font-mono">src/lib/site.ts</code>.
      </p>

      <div className="mt-8 space-y-10">
        {previews.map((preview) => (
          <section key={preview.title}>
            <h2 className="font-display text-xl font-extrabold">
              {preview.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{preview.when}</p>
            <p className="mt-3 text-sm">
              <span className="font-bold">Subject:</span> {preview.email.subject}
            </p>
            <iframe
              title={preview.title}
              srcDoc={preview.email.html}
              className="mt-3 h-[38rem] w-full rounded-2xl border-[1.5px] border-line bg-white"
              sandbox=""
            />
          </section>
        ))}
      </div>
    </>
  );
}
