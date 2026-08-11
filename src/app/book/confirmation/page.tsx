import type { Metadata } from "next";
import Link from "next/link";

import { formatDateLong, formatTime } from "@/lib/dates";
import { getBookingByReference } from "@/lib/bookings";
import { formatMoney } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking requested",
  // A confirmation page has no business in search results.
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { ref } = await searchParams;
  const booking = ref ? await getBookingByReference(ref) : null;

  // Older bookings have no delivery record; assume the email went out rather
  // than alarming someone about a send that probably succeeded.
  const emailReachedCustomer =
    booking !== null &&
    (booking.emailDelivery === undefined ||
      booking.emailDelivery.customer === "sent");

  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span
          aria-hidden
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mint/15 text-4xl"
        >
          🎉
        </span>

        <h1 className="mt-7 font-display text-5xl font-extrabold sm:text-6xl">
          Request received
        </h1>

        {/* Only claim the email was sent if it actually was. Saying "we've
            emailed you" after a failed send sends people hunting through spam
            for something that was never delivered. */}
        <p className="mt-5 text-lg leading-relaxed text-ink-2">
          {emailReachedCustomer ? (
            <>
              We’ve emailed you a copy at {booking.customer.email}. We review
              every booking by hand — expect your confirmation within{" "}
              <strong>24 hours</strong>.
            </>
          ) : (
            <>
              We’ve got your request and we review every booking by hand —
              expect to hear from us within <strong>24 hours</strong>.
            </>
          )}
        </p>

        {booking && !emailReachedCustomer && (
          <p className="mx-auto mt-5 max-w-lg rounded-xl border-[1.5px] border-sun bg-sun/10 px-4 py-3 text-sm leading-relaxed text-ink-2">
            We couldn’t send your confirmation email just now, so please save
            your reference below. Your request did reach us — nothing is lost.
          </p>
        )}

        {ref && (
          <p className="mt-8 inline-block rounded-full border-[1.5px] border-line bg-white px-6 py-3">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Your reference
            </span>
            <span className="ml-3 font-display text-xl font-extrabold tracking-wider">
              {ref}
            </span>
          </p>
        )}
      </div>

      {booking && (
        <div className="card mx-auto mt-12 max-w-2xl overflow-hidden">
          <div className="border-b border-line bg-paper-2 px-7 py-4">
            <h2 className="font-display text-lg font-extrabold">
              What you asked for
            </h2>
          </div>

          <dl className="divide-y divide-line px-7">
            {[
              { label: "Car", value: booking.carName },
              {
                label: "Pick-up",
                value: `${formatDateLong(booking.startDate)} at ${formatTime(booking.pickupTime)}`,
              },
              {
                label: "Drop-off",
                value: `${formatDateLong(booking.endDate)} at ${formatTime(booking.dropoffTime)}`,
              },
              {
                label: "Duration",
                value: `${booking.quote.days} ${booking.quote.days === 1 ? "day" : "days"}`,
              },
              ...(booking.occasion
                ? [{ label: "Occasion", value: booking.occasion }]
                : []),
              {
                label: "Estimated total",
                value: formatMoney(booking.quote.total),
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap justify-between gap-3 py-4"
              >
                <dt className="text-sm text-muted">{row.label}</dt>
                <dd className="text-sm font-bold">{row.value}</dd>
              </div>
            ))}
          </dl>

          <p className="border-t border-line bg-paper-2 px-7 py-4 text-xs leading-relaxed text-muted">
            This is a request, not a confirmed booking, and nothing has been
            charged. There’s no deposit — you pay the total at pick-up.
          </p>
        </div>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link href="/fleet" className="btn btn-ghost">
          Back to the fleet
        </Link>
        <Link href="/contact" className="btn btn-primary">
          Get in touch
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Didn’t get an email? Check your spam folder, or{" "}
        <Link href="/contact" className="font-bold text-brand underline">
          get in touch
        </Link>
        {ref && <> quoting {ref}</>}.
      </p>
    </section>
  );
}
