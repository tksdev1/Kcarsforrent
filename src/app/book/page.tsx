import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingForm } from "@/components/BookingForm";
import { getActiveCars } from "@/lib/fleet";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a car",
  description: `Request a themed Kei car from ${site.name}. Free to request — nothing is charged until pick-up.`,
  robots: { index: true, follow: true },
};

export default async function BookPage() {
  const cars = await getActiveCars();

  return (
    <>
      <section className="border-b border-line bg-paper-2 bg-dots py-14">
        <div className="container-page">
          <p className="eyebrow">Booking</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-extrabold sm:text-6xl">
            Let's get you booked
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            Tell us which car and when. We'll check it's free, prep it for your
            occasion, and email your confirmation within 24 hours.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <Suspense
          fallback={
            <div className="card p-10 text-center text-muted">
              Loading the booking form…
            </div>
          }
        >
          <BookingForm cars={cars} />
        </Suspense>
      </section>
    </>
  );
}
