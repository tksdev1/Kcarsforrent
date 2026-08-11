"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LOGO_HEIGHT, LOGO_SRC, LOGO_WIDTH } from "@/lib/logo";
import { site } from "@/lib/site";

const NAV = [
  { href: "/fleet", label: "The Fleet" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation, otherwise it stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Don't let the page scroll behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="container-page flex min-h-18 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC}
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            alt={site.name}
            className="h-[4.5rem] w-auto sm:h-24"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-paper-2 text-ink"
                    : "text-ink-2 hover:bg-paper-2 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phoneHref}
            className="hidden text-sm font-bold text-ink-2 transition-colors hover:text-brand lg:block"
          >
            {site.phone}
          </a>
          <Link href="/book" className="btn btn-primary hidden sm:inline-flex">
            Book a car
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-xl border-[1.5px] border-line md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              {open ? (
                <path
                  d="M4 4l12 12M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-paper md:hidden">
          <nav className="container-page flex flex-col py-3" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line py-3.5 font-display text-lg font-bold"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/book" className="btn btn-primary mt-4">
              Book a car
            </Link>
            <a
              href={site.phoneHref}
              className="mt-3 py-2 text-center text-sm font-bold text-muted"
            >
              or call {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
