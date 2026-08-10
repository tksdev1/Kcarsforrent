import Link from "next/link";

import { KeiVan } from "@/components/KeiVan";

export default function NotFound() {
  return (
    <section className="container-page py-24 text-center">
      <KeiVan
        accent="#f2a0be"
        className="mx-auto w-full max-w-sm opacity-40"
        title=""
      />
      <h1 className="mt-8 font-display text-5xl font-extrabold sm:text-6xl">
        Wrong turn
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-2">
        We couldn’t find that page. It may have moved, or the link might have a
        typo in it.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/fleet" className="btn btn-primary">
          Browse the fleet
        </Link>
        <Link href="/" className="btn btn-ghost">
          Back home
        </Link>
      </div>
    </section>
  );
}
