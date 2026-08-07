import Image from "next/image";
import Link from "next/link";

import { KeiVan } from "@/components/KeiVan";
import { formatMoney } from "@/lib/site";
import type { Car } from "@/lib/types";

export function CarPhoto({
  car,
  priority = false,
  className = "",
}: {
  car: Car;
  priority?: boolean;
  className?: string;
}) {
  if (car.image) {
    return (
      <Image
        src={car.image}
        alt={`${car.name} — ${car.theme} themed Kei van`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <KeiVan
      accent={car.accent}
      title={`${car.name} — ${car.theme} themed Kei van`}
      className={`h-full w-full p-6 ${className}`}
    />
  );
}

export function CarCard({ car, priority = false }: { car: Car; priority?: boolean }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      <Link
        href={`/fleet/${car.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-paper-2"
        style={{ backgroundColor: `${car.accent}1a` }}
      >
        <CarPhoto car={car} priority={priority} />
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm"
          style={{ backgroundColor: car.accent }}
        >
          {car.theme}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-extrabold">
          <Link href={`/fleet/${car.slug}`} className="hover:text-brand">
            {car.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{car.tagline}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p className="leading-none">
            <span className="font-display text-2xl font-extrabold">
              {formatMoney(car.dailyRate)}
            </span>
            <span className="ml-1 text-sm font-semibold text-muted">/ day</span>
          </p>
          <Link
            href={`/book?car=${car.slug}`}
            className="btn btn-primary px-5 py-2.5 text-sm"
          >
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
