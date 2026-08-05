import type { Metadata } from "next";
import Link from "next/link";

import { getActiveCars } from "@/lib/fleet";
import { formatMoney, site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "How it works",
  description: `How renting a themed Kei car from ${site.name} works, from request to return.`,
};

/** `solo*` variants are used when the fleet is a single car. */
interface Step {
  n: string;
  title: string;
  copy: string;
  soloTitle?: string;
  soloCopy?: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    title: "Find your car",
    copy: "Browse the fleet and pick the theme that fits the occasion. Every listing shows the real daily rate, the weekend rate, seating and what's included — nothing is hidden until checkout.",
    soloTitle: "Take a look at the car",
    soloCopy: "The listing shows the real daily rate, the weekend rate, seating and exactly what's included — nothing is hidden until checkout.",
  },
  {
    n: "02",
    title: "Request your dates",
    copy: "Choose your pick-up and drop-off, tell us what you're celebrating, and add delivery if you'd like the car brought to you. The form shows your estimated total as you go.",
    soloCopy: "Choose your pick-up and drop-off, tell us what you're celebrating, and add delivery if you'd like the car brought to you. The form checks the dates are free and shows your estimated total as you go.",
  },
  {
    n: "03",
    title: "We confirm within 24 hours",
    copy: "We check the car is genuinely free, prep it for your occasion, and email you a confirmation. If we can't take the booking we'll tell you quickly, so you can make other plans.",
  },
  {
    n: "04",
    title: "Pick up or get it delivered",
    copy: "Bring your driver's licence and a payment card. We'll walk you round the car, take the refundable security hold, and hand you the keys.",
  },
  {
    n: "05",
    title: "Have a brilliant time",
    copy: "Take the photos. Make the entrance. Enjoy the double-takes at every set of traffic lights.",
  },
  {
    n: "06",
    title: "Bring it back",
    copy: "Return it at the agreed time with the same fuel level. We release the security hold once we've checked the car over.",
  },
];

export default async function HowItWorksPage() {
  const cars = await getActiveCars();
  const solo = cars.length === 1;

  return (
    <>
      <section className="border-b border-line bg-paper-2 bg-dots py-14">
        <div className="container-page">
          <p className="eyebrow">How it works</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-extrabold sm:text-6xl">
            From request to keys in hand
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            No account to create, no card charged up front, no surprise fees at
            the counter. Here's exactly what happens.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <ol className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="card p-7">
              <span className="font-display text-5xl font-extrabold text-brand/25">
                {step.n}
              </span>
              <h2 className="mt-3 font-display text-xl font-extrabold">
                {solo ? (step.soloTitle ?? step.title) : step.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {solo ? (step.soloCopy ?? step.copy) : step.copy}
              </p>
            </li>
          ))}
        </ol>

        <div className="card mt-12 p-8">
          <h2 className="font-display text-2xl font-extrabold">
            What you'll pay
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">
            The estimate on your booking covers the daily rate for each day of
            the rental, a cleaning and prep fee, and delivery if you've asked for
            it. Weekend days (Friday to Sunday) may be priced differently — the
            booking form always shows the real breakdown before you submit.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-2">
            On top of that, a refundable{" "}
            <strong>{formatMoney(site.securityDeposit)}</strong> security hold is
            taken at pick-up and released once the car is back with us in the
            same condition.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">
              Start a booking
            </Link>
            <Link href="/policies" className="btn btn-ghost">
              Read the full policies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
