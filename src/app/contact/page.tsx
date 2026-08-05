import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about themed Kei car rentals, availability and delivery.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-paper-2 bg-dots py-14">
        <div className="container-page">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-extrabold sm:text-6xl">
            Say hello
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            Questions about a car, a date, a custom theme or a big event? We'd
            love to hear about it.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-xl font-extrabold">Call or email</h2>
            <div className="mt-4 space-y-2">
              <a
                href={site.phoneHref}
                className="block font-display text-2xl font-extrabold transition-colors hover:text-brand"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="block font-semibold text-ink-2 transition-colors hover:text-brand"
              >
                {site.email}
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-extrabold">Hours</h2>
            <dl className="mt-4 space-y-2">
              {site.hours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-6 text-sm">
                  <dt className="text-muted">{entry.days}</dt>
                  <dd className="font-semibold">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-xl font-extrabold">Service area</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {site.serviceArea}. Pick up from us, or add delivery at checkout
              and we'll bring the car to you.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-extrabold">Follow along</h2>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-2 rounded-full border-[1.5px] border-line bg-white px-4 py-2.5 text-sm font-bold transition-colors hover:border-ink"
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
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
