import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Themed Kei Car Rentals`,
    template: `%s · ${site.name}`,
  },
  description: site.shortDescription,
  keywords: [
    `kei car rental ${site.city}`,
    `themed car rental ${site.city} ${site.region}`,
    "micro van rental",
    "party car rental",
    "quinceañera car rental",
    "photo shoot car rental",
    // People search by their own town, not by "Central Valley".
    ...site.serviceTowns.map((town) => `car rental ${town} ${site.region}`),
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.shortDescription,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.shortDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#d6206a",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  name: site.name,
  description: site.shortDescription,
  url: site.url,
  telephone: site.phone,
  // Named City entities rather than one prose string — this is what lets a
  // search engine match the business to a specific town's results.
  areaServed: site.serviceTowns.map((town) => ({
    "@type": "City",
    name: town,
    addressRegion: site.region,
    addressCountry: "US",
  })),
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: "US",
  },
  // Omit sameAs entirely rather than emitting an empty array — search engines
  // treat a present-but-empty property as a signal that there are no profiles.
  ...(site.social.instagram ? { sameAs: [site.social.instagram] } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white focus:font-bold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  );
}
