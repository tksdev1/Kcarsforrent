import type { Metadata } from "next";
import Link from "next/link";

import { CarCard } from "@/components/CarCard";
import { FeaturedCar } from "@/components/FeaturedCar";
import { getActiveCars } from "@/lib/fleet";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Fleet",
  description: `Every themed Kei car and micro van available from ${site.name} — daily rates, seating and features.`,
};

export default async function FleetPage() {
  const cars = await getActiveCars();
  const soloCar = cars.length === 1 ? cars[0] : null;

  return (
    <>
      <section className="border-b border-line bg-paper-2 bg-dots py-16">
        <div className="container-page">
          <p className="eyebrow">{soloCar ? "The car" : "The fleet"}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold sm:text-6xl">
            {soloCar ? "One car. All character." : "Every car has a personality"}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            {soloCar
              ? "A genuine Japanese Kei van, transformed into something that photographs beautifully and turns heads on the way there."
              : "Each one is a genuine Japanese Kei van, transformed into something that photographs beautifully and turns heads on the way there. Tap any car for the full details."}
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        {cars.length === 0 ? (
          <div className="card p-12 text-center">
            <h2 className="font-display text-2xl font-extrabold">
              The fleet is being updated
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              We're between listings right now. Get in touch and we'll tell you
              exactly what's available for your dates.
            </p>
            <Link href="/contact" className="btn btn-primary mt-7">
              Contact us
            </Link>
          </div>
        ) : soloCar ? (
          <FeaturedCar car={soloCar} />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, i) => (
              <CarCard key={car.id} car={car} priority={i < 3} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
