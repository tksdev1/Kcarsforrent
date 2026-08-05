import type { Metadata } from "next";

import { formatMoney, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rental policies",
  description: `Rental terms for ${site.name} — eligibility, deposits, delivery, damage and cancellations.`,
};

/**
 * ⚠️ OWNER: THIS IS A STARTING POINT, NOT LEGAL ADVICE.
 *
 * These clauses are written to be reasonable and readable, but rental terms are
 * jurisdiction-specific and they form part of your contract with the customer.
 * Have someone qualified review this before you rely on it, and make sure it
 * matches your actual insurance policy.
 */
const SECTIONS = [
  {
    title: "Who can rent",
    items: [
      `Drivers must be at least ${site.minimumAge} years old.`,
      "A valid, unexpired driver's licence held for at least 12 months is required, and must be presented in person at pick-up.",
      "Additional drivers must be named on the booking and meet the same requirements.",
      "We may decline a rental at our discretion, including where a licence cannot be verified.",
    ],
  },
  {
    title: "Bookings and confirmation",
    items: [
      "Submitting the booking form creates a request, not a confirmed rental. Your dates are held while we review it.",
      "We aim to confirm or decline every request within 24 hours by email.",
      "No payment is taken at the point of request. The rental balance is due at pick-up.",
      "Prices shown on the site are estimates based on the dates and options you select, and are confirmed in writing when we accept the booking.",
    ],
  },
  {
    title: "Deposits and payment",
    items: [
      `A refundable security hold of ${formatMoney(site.securityDeposit)} is placed on a valid payment card at pick-up.`,
      "The hold is released after the vehicle is returned and inspected, typically within a few business days depending on your bank.",
      "The rental balance, including any delivery and cleaning fees, is payable before the keys are handed over.",
    ],
  },
  {
    title: "Using the vehicle",
    items: [
      "The vehicle may only be driven by the named driver(s) on the rental agreement.",
      "No smoking, vaping or open flames inside the vehicle. A cleaning charge applies if this is breached.",
      "The vehicle must not be used for racing, towing, off-road driving, driving instruction, or any commercial passenger service.",
      "Do not operate the vehicle under the influence of alcohol, drugs or any substance that impairs driving.",
      "Return the vehicle with the same fuel level it left with, or a refuelling charge applies.",
    ],
  },
  {
    title: "Themes, wraps and decoration",
    items: [
      "Our vehicles carry custom wraps, paint and props. Please treat them as part of the vehicle.",
      "Removable decorations you bring yourself — ribbon, magnets, non-adhesive signage — are welcome.",
      "Adhesive tape, glue, staples and anything that marks the wrap are not permitted without prior written agreement.",
      "Damage to a wrap or themed element is charged at the cost of repair or replacement.",
    ],
  },
  {
    title: "Delivery and collection",
    items: [
      "Delivery is optional and priced per vehicle, shown on each listing.",
      "Someone aged 21 or over with the booking's driver licence must be present to receive the vehicle.",
      "If nobody is available at the agreed time and place, a re-delivery fee may apply.",
    ],
  },
  {
    title: "Damage, breakdown and accidents",
    items: [
      "The renter is responsible for the vehicle for the duration of the rental, including damage, theft and traffic or parking penalties incurred during that period.",
      "Report any accident, breakdown or damage to us immediately, and to the police where the law requires it.",
      "Do not authorise repairs without our written agreement.",
    ],
  },
  {
    title: "Cancellations and changes",
    items: [
      "Cancelling an unconfirmed request costs nothing.",
      "For confirmed bookings, please give us at least 48 hours' notice of a cancellation or change so we can re-let the dates.",
      "We will always try to move your booking rather than cancel it. If we have to cancel on you, you pay nothing.",
    ],
  },
  {
    title: "Privacy",
    items: [
      "We collect only what we need to handle your booking: your name, email, phone number, dates and any notes you send us.",
      "We use it to confirm and service your rental, and we don't sell it or share it with third parties for marketing.",
      "Email us at " + site.email + " to ask what we hold about you, or to have it deleted.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <>
      <section className="border-b border-line bg-paper-2 bg-dots py-14">
        <div className="container-page">
          <p className="eyebrow">The fine print</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-extrabold sm:text-6xl">
            Rental policies
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            Written to be read, not to be skipped. If anything here is unclear,
            ask us before you book.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-2xl font-extrabold">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 leading-relaxed text-ink-2"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="border-t border-line pt-8 text-sm text-muted">
            Questions about any of this? Call {site.phone} or email{" "}
            <a href={`mailto:${site.email}`} className="font-bold text-brand underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
