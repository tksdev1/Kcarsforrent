import type { Metadata } from "next";
import Link from "next/link";

import { formatMoney, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Common questions about renting a themed Kei car from ${site.name} — age limits, insurance, delivery, mileage and deposits.`,
};

/**
 * NOTE FOR THE OWNER: several of these answers describe policy (insurance,
 * mileage, cancellations). Read them through and adjust the wording to match
 * how you actually operate before you launch.
 */
const FAQS = [
  {
    q: "What exactly is a Kei car?",
    a: "Kei cars are a class of compact Japanese vehicle built to a strict size and engine limit — tiny footprint, huge personality. Ours are genuine imports, then transformed into themed rides you won't see anywhere else on the road.",
  },
  {
    q: "How old do I have to be?",
    a: `You must be at least ${site.minimumAge} with a valid, unexpired driver's licence held for at least a year. We check the licence at pick-up, so bring the physical card.`,
  },
  {
    q: "Am I paying when I submit the booking form?",
    a: "No. Submitting the form sends us a request — nothing is charged. We confirm by email within 24 hours, and you pay at pick-up.",
  },
  {
    q: "What's the security deposit?",
    a: `A refundable ${formatMoney(site.securityDeposit)} hold is placed on your card at pick-up. It's released when the car comes back in the same condition it left in.`,
  },
  {
    q: "Do you deliver?",
    a: "Yes. Add delivery when you book and we'll drop the car wherever your event is happening, then collect it afterwards. The fee is shown per car on its listing.",
  },
  {
    q: "Is insurance included?",
    a: "Bring proof of your own coverage, or ask us about a short-term policy when we confirm your booking. We'll walk you through the options before you pick the car up.",
  },
  {
    q: "Is there a mileage limit?",
    a: "Local trips around town are included. If you're planning a longer journey, mention it in your booking notes and we'll agree the details up front — no surprises on return.",
  },
  {
    q: "Can I decorate the car myself?",
    a: "Absolutely, as long as nothing damages the wrap or paint. Removable decorations, magnets and ribbon are all fine. Chat to us first if you're planning anything adhesive.",
  },
  {
    q: "What if I need to cancel or change my dates?",
    a: "Let us know as early as you can and we'll do our best to move you. Since nothing is charged until pick-up, cancelling a request costs you nothing.",
  },
  {
    q: "Can you build a custom theme for my event?",
    a: "Sometimes, for larger events and with enough notice. Get in touch with what you have in mind and we'll tell you honestly whether it's possible.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <section className="border-b border-line bg-paper-2 bg-dots py-14">
        <div className="container-page">
          <p className="eyebrow">FAQ</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-extrabold sm:text-6xl">
            Questions, answered
          </h1>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl divide-y divide-line">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <h2 className="font-display text-lg font-extrabold">{item.q}</h2>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-xl font-bold text-brand transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-[1.5rem] bg-ink px-8 py-10 text-center text-white">
          <h2 className="font-display text-3xl font-extrabold">
            Still wondering something?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Ask us directly — we answer every message ourselves.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">
              Get in touch
            </Link>
            <a
              href={site.phoneHref}
              className="btn border-[1.5px] border-white/25 text-white hover:border-white"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
