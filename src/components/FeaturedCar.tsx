import Link from "next/link";

import { CarPhoto } from "@/components/CarCard";
import { formatMoney, site } from "@/lib/site";
import type { Car } from "@/lib/types";

/**
 * Wide, two-column presentation of a single car.
 *
 * A one-car fleet dropped into a three-column grid reads as a page that failed
 * to load. This gives the car the whole width and treats it as the hero of the
 * business, which is what it is when you only run one.
 */
export function FeaturedCar({ car }: { car: Car }) {
  return (
    <article className="card overflow-hidden lg:grid lg:grid-cols-2">
      <Link
        href={`/fleet/${car.slug}`}
        className="relative block aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[26rem]"
        style={{ backgroundColor: `${car.accent}1a` }}
      >
        <CarPhoto car={car} priority />
        <span
          className="absolute left-5 top-5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm"
          style={{ backgroundColor: car.accent }}
        >
          {car.theme}
        </span>
      </Link>

      <div className="flex flex-col p-8 lg:p-10">
        <h3 className="font-display text-4xl font-extrabold sm:text-5xl">
          <Link href={`/fleet/${car.slug}`} className="hover:text-brand">
            {car.name}
          </Link>
        </h3>
        <p className="mt-3 text-lg leading-snug text-ink-2">{car.tagline}</p>

        {car.description && (
          <p className="mt-5 leading-relaxed text-muted">{car.description}</p>
        )}

        <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-line py-5">
          {[
            { label: "Seats", value: String(car.seats) },
            { label: "Gearbox", value: car.transmission },
            { label: "Base car", value: car.model },
          ].map((spec) => (
            <div key={spec.label}>
              <dt className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-muted">
                {spec.label}
              </dt>
              <dd className="mt-1 text-sm font-bold leading-snug">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-7">
          <p className="leading-none">
            <span className="font-display text-4xl font-extrabold">
              {formatMoney(car.dailyRate)}
            </span>
            <span className="ml-1.5 text-base font-semibold text-muted">
              / day
            </span>
            {car.weekendRate && car.weekendRate !== car.dailyRate && (
              <span className="mt-2 block text-sm font-semibold text-muted">
                {formatMoney(car.weekendRate)} / day Fri – Sun
              </span>
            )}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href={`/fleet/${car.slug}`} className="btn btn-ghost">
              Full details
            </Link>
            <Link href={`/book?car=${car.slug}`} className="btn btn-primary">
              Check my dates
            </Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted">
          Free to request · Nothing charged until pick-up · Refundable{" "}
          {formatMoney(site.securityDeposit)} hold
        </p>
      </div>
    </article>
  );
}
