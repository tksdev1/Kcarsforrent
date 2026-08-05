/**
 * Business details used across the site, emails and structured data.
 *
 * >>> EDIT ME <<<
 * Everything marked TODO is a placeholder because it isn't published on the
 * current kcarsforrent.com. Replace them and the whole site updates.
 */
export const site = {
  name: "K Cars for Rent",
  legalName: "K Cars for Rent",
  tagline: "Rent the vibe. Drive the adventure.",
  shortDescription:
    "Themed Japanese Kei cars and micro vans for birthdays, quinceañeras, photo shoots and any occasion worth showing up for.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kcarsforrent.com",

  // TODO: replace with your real contact details.
  phone: "(555) 123-4567",
  phoneHref: "tel:+15551234567",
  email: "hello@kcarsforrent.com",

  // TODO: replace with your real service area / pickup location.
  city: "Your City",
  region: "ST",
  serviceArea: "Greater metro area — delivery available",

  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 8:00 PM" },
    { days: "Sunday", time: "By appointment" },
  ],

  social: {
    // TODO: replace with your real Instagram handle.
    instagram: "https://instagram.com/kcarsforrent",
    instagramHandle: "@kcarsforrent",
  },

  currency: "USD",
  currencySymbol: "$",

  /** Minimum age to rent. Shown on the policies page and the booking form. */
  minimumAge: 21,

  /** Refundable security hold taken at pickup. */
  securityDeposit: 250,
} as const;

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: site.currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
