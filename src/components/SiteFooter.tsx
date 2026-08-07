import Link from "next/link";

import { site } from "@/lib/site";

const FLEET_LINKS = [
  { href: "/fleet", label: "Browse the fleet" },
  { href: "/book", label: "Request a booking" },
];

const INFO_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/policies", label: "Rental policies" },
  { href: "/contact", label: "Contact us" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-2">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white font-display text-lg font-extrabold"
            >
              K
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              {site.name}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {site.shortDescription}
          </p>
          {site.social.instagram && (
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold transition-colors hover:border-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect
                  x="2.5"
                  y="2.5"
                  width="19"
                  height="19"
                  rx="5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.4" fill="currentColor" />
              </svg>
              {site.social.instagramHandle}
            </a>
          )}
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
            Rentals
          </h3>
          <ul className="mt-4 space-y-2.5">
            {FLEET_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-semibold text-ink-2 transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
            Good to know
          </h3>
          <ul className="mt-4 space-y-2.5">
            {INFO_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-semibold text-ink-2 transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
            Get in touch
          </h3>
          <div className="mt-4 space-y-1 text-sm text-muted">
            <a
              href={site.phoneHref}
              className="block font-bold text-ink-2 transition-colors hover:text-brand"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="block transition-colors hover:text-brand"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>
            {site.serviceArea} · Must be {site.minimumAge}+ with a valid licence
            to rent.
          </p>
        </div>
      </div>
    </footer>
  );
}
