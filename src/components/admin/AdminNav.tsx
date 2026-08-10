"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { site } from "@/lib/site";

const LINKS = [
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/fleet", label: "Fleet" },
  { href: "/admin/calendar", label: "Blocked dates" },
  { href: "/admin/emails", label: "Email previews" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <Link href="/admin/bookings" className="flex items-center gap-2.5">
          <span className="font-display text-base font-extrabold">
            {site.name}
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Dashboard">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-ink text-white"
                    : "text-ink-2 hover:bg-paper-2"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-sm font-semibold text-muted transition-colors hover:text-brand"
          >
            View site ↗
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border-[1.5px] border-line px-4 py-2 text-sm font-bold transition-colors hover:border-ink"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
