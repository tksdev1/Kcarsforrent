export interface OpeningHours {
  days: string;
  time: string;
}

export interface SocialLinks {
  /** Full profile URL, or null if there isn't one yet. */
  instagram: string | null;
  /** Display handle, e.g. "@kcarsforrent". */
  instagramHandle: string | null;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  shortDescription: string;
  url: string;
  phone: string;
  phoneHref: string;
  email: string;
  city: string;
  region: string;
  /** Short label for tight spots — the hero eyebrow and the footer bar. */
  serviceArea: string;
  /**
   * The towns you actually cover, named individually.
   *
   * Naming them is what gets you found for "kei car rental Tulare" and the
   * like — a vague "Central Valley" matches nothing people actually type.
   * These are listed on the contact page and emitted as schema.org areaServed.
   */
  serviceTowns: string[];
  hours: OpeningHours[];
  social: SocialLinks;
  currency: string;
  minimumAge: number;
  securityDeposit: number;
}

/**
 * Business details used across the site, emails and structured data.
 *
 * >>> EDIT ME <<<
 * Anything still marked TODO is a placeholder. Everything else is real.
 */
export const site: SiteConfig = {
  name: "K Cars for Rent",
  legalName: "K Cars for Rent",
  tagline: "Rent the vibe. Drive the adventure.",
  shortDescription:
    "Themed Japanese Kei cars and micro vans for birthdays, quinceañeras, photo shoots and any occasion worth showing up for.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kcarsforrent.com",

  phone: "(480) 658-5391",
  phoneHref: "tel:+14806585391",
  email: "yuvalm@gmail.com",

  city: "Visalia",
  region: "CA",
  serviceArea: "Visalia & nearby towns — delivery available",

  // Trim any of these you don't actually travel to. Claiming a town you won't
  // drive to costs you a wasted enquiry and a disappointed customer.
  serviceTowns: [
    "Visalia",
    "Tulare",
    "Exeter",
    "Farmersville",
    "Goshen",
    "Woodlake",
    "Lindsay",
    "Dinuba",
    "Hanford",
    "Porterville",
  ],

  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 8:00 PM" },
    { days: "Sunday", time: "By appointment" },
  ],

  // No Instagram yet. Fill both fields in and the links reappear in the footer
  // and on the contact page automatically — nothing else needs changing.
  social: {
    instagram: null,
    instagramHandle: null,
  },

  currency: "USD",

  /** Minimum age to rent. Shown on the policies page and the booking form. */
  minimumAge: 21,

  /** Refundable security hold taken at pickup. */
  securityDeposit: 250,
};

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: site.currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
