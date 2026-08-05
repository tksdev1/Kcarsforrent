import { formatDateLong, formatTime } from "@/lib/dates";
import { formatMoney, site } from "@/lib/site";
import type { Booking } from "@/lib/types";

import {
  button,
  callout,
  detailTable,
  emailLayout,
  escapeHtml,
  quoteTable,
} from "./layout";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

function bookingRows(booking: Booking) {
  const rows = [
    { label: "Reference", value: `<code>${escapeHtml(booking.reference)}</code>` },
    { label: "Vehicle", value: escapeHtml(booking.carName) },
    {
      label: "Pick-up",
      value: `${escapeHtml(formatDateLong(booking.startDate))} at ${escapeHtml(formatTime(booking.pickupTime))}`,
    },
    {
      label: "Drop-off",
      value: `${escapeHtml(formatDateLong(booking.endDate))} at ${escapeHtml(formatTime(booking.dropoffTime))}`,
    },
    {
      label: "Duration",
      value: `${booking.quote.days} ${booking.quote.days === 1 ? "day" : "days"}`,
    },
  ];

  if (booking.occasion) {
    rows.push({ label: "Occasion", value: escapeHtml(booking.occasion) });
  }

  rows.push({
    label: "Delivery",
    value: booking.deliveryRequested
      ? `Yes — ${escapeHtml(booking.deliveryAddress || "address to confirm")}`
      : "No — pick up in person",
  });

  return rows;
}

function quoteBlock(booking: Booking) {
  return quoteTable(
    booking.quote.lines.map((line) => ({
      label: line.label,
      amount: formatMoney(line.amount),
    })),
    formatMoney(booking.quote.total),
  );
}

function plainSummary(booking: Booking): string {
  return [
    `Reference: ${booking.reference}`,
    `Vehicle: ${booking.carName}`,
    `Pick-up: ${formatDateLong(booking.startDate)} at ${formatTime(booking.pickupTime)}`,
    `Drop-off: ${formatDateLong(booking.endDate)} at ${formatTime(booking.dropoffTime)}`,
    `Duration: ${booking.quote.days} day(s)`,
    booking.occasion ? `Occasion: ${booking.occasion}` : null,
    booking.deliveryRequested
      ? `Delivery: Yes — ${booking.deliveryAddress || "address to confirm"}`
      : "Delivery: No — pick up in person",
    `Estimated total: ${formatMoney(booking.quote.total)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Sent to the customer the moment they submit. Sets the "pending" expectation. */
export function customerRequestReceived(booking: Booking): RenderedEmail {
  const html = emailLayout({
    preheader: `We've got your request for the ${booking.carName} — reference ${booking.reference}.`,
    heading: `Thanks, ${booking.customer.name.split(" ")[0]} — we've got your request`,
    intro: `Your request for the <strong>${escapeHtml(booking.carName)}</strong> is in. We review every booking by hand so the car is properly prepped for your occasion — you'll hear back from us within <strong>24 hours</strong> with a confirmation.`,
    body: `
      ${callout("<strong>This is not a confirmed booking yet.</strong> Nothing has been charged. We'll email you as soon as we've confirmed availability.", "warn")}
      <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">Your request</h2>
      ${detailTable(bookingRows(booking))}
      <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">Estimated cost</h2>
      ${quoteBlock(booking)}
      <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#78716c;">
        This estimate covers the rental, prep and any delivery. A refundable
        ${escapeHtml(formatMoney(site.securityDeposit))} security hold is taken at pick-up and released on return.
      </p>
      ${button({ label: "See the full fleet", url: `${site.url}/fleet` })}
    `,
    footerNote: `Need to change something? Reply to this email or call us and quote <strong>${escapeHtml(booking.reference)}</strong>.`,
  });

  const text = `Thanks, ${booking.customer.name.split(" ")[0]} — we've got your request.

Your request for the ${booking.carName} is in. We review every booking by hand, and you'll hear back within 24 hours.

THIS IS NOT A CONFIRMED BOOKING YET. Nothing has been charged.

${plainSummary(booking)}

A refundable ${formatMoney(site.securityDeposit)} security hold is taken at pick-up and released on return.

Need to change something? Reply to this email or call ${site.phone} and quote ${booking.reference}.

${site.name} — ${site.url}`;

  return {
    subject: `We got your request — ${booking.carName} (${booking.reference})`,
    html,
    text,
  };
}

/** Sent to the owner. Front-loads everything needed to make a decision. */
export function ownerNewRequest(booking: Booking): RenderedEmail {
  const html = emailLayout({
    preheader: `${booking.customer.name} wants the ${booking.carName} on ${formatDateLong(booking.startDate)}.`,
    heading: "New booking request",
    intro: `<strong>${escapeHtml(booking.customer.name)}</strong> has requested the <strong>${escapeHtml(booking.carName)}</strong>. The dates are held as pending until you confirm or decline.`,
    body: `
      ${button({ label: "Open the dashboard", url: `${site.url}/admin/bookings` })}
      <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">Customer</h2>
      ${detailTable([
        { label: "Name", value: escapeHtml(booking.customer.name) },
        {
          label: "Email",
          value: `<a href="mailto:${escapeHtml(booking.customer.email)}" style="color:#d94436;">${escapeHtml(booking.customer.email)}</a>`,
        },
        {
          label: "Phone",
          value: `<a href="tel:${escapeHtml(booking.customer.phone.replace(/[^\d+]/g, ""))}" style="color:#d94436;">${escapeHtml(booking.customer.phone)}</a>`,
        },
      ])}
      <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">Booking</h2>
      ${detailTable(bookingRows(booking))}
      ${
        booking.notes
          ? `<h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">Their notes</h2>
             <p style="margin:0 0 24px;padding:14px 16px;background:#faf9f7;border:1px solid #e7e5e4;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(booking.notes)}</p>`
          : ""
      }
      <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">Quoted</h2>
      ${quoteBlock(booking)}
    `,
  });

  const text = `NEW BOOKING REQUEST

${booking.customer.name} has requested the ${booking.carName}.

Customer
  Name:  ${booking.customer.name}
  Email: ${booking.customer.email}
  Phone: ${booking.customer.phone}

${plainSummary(booking)}
${booking.notes ? `\nTheir notes:\n${booking.notes}\n` : ""}
Confirm or decline: ${site.url}/admin/bookings`;

  return {
    subject: `New request: ${booking.carName}, ${formatDateLong(booking.startDate)} — ${booking.customer.name}`,
    html,
    text,
  };
}

/** Sent when the owner confirms. */
export function customerConfirmed(booking: Booking): RenderedEmail {
  const html = emailLayout({
    preheader: `Confirmed — the ${booking.carName} is yours on ${formatDateLong(booking.startDate)}.`,
    heading: "You're confirmed. The car is yours.",
    intro: `Good news, ${escapeHtml(booking.customer.name.split(" ")[0])} — your booking for the <strong>${escapeHtml(booking.carName)}</strong> is confirmed and the dates are locked in.`,
    body: `
      ${callout("<strong>Confirmed.</strong> Keep this email — you'll need your reference at pick-up.", "good")}
      ${detailTable(bookingRows(booking))}
      <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">Cost</h2>
      ${quoteBlock(booking)}
      <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">What to bring</h2>
      <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.8;color:#57534e;">
        <li>A valid driver's licence (minimum age ${site.minimumAge})</li>
        <li>A payment card for the balance and the refundable ${escapeHtml(formatMoney(site.securityDeposit))} hold</li>
        <li>Proof of insurance, if you're using your own</li>
      </ul>
      ${
        booking.ownerNote
          ? `<h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">A note from us</h2>
             <p style="margin:0 0 24px;padding:14px 16px;background:#faf9f7;border:1px solid #e7e5e4;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(booking.ownerNote)}</p>`
          : ""
      }
    `,
    footerNote: `Plans changed? Let us know at least 48 hours ahead and quote <strong>${escapeHtml(booking.reference)}</strong>.`,
  });

  const text = `YOU'RE CONFIRMED

Your booking for the ${booking.carName} is confirmed.

${plainSummary(booking)}

What to bring:
  - A valid driver's licence (minimum age ${site.minimumAge})
  - A payment card for the balance and the refundable ${formatMoney(site.securityDeposit)} hold
  - Proof of insurance, if you're using your own
${booking.ownerNote ? `\nA note from us:\n${booking.ownerNote}\n` : ""}
Plans changed? Let us know at least 48 hours ahead and quote ${booking.reference}.

${site.name} — ${site.phone} — ${site.url}`;

  return {
    subject: `Confirmed: ${booking.carName} on ${formatDateLong(booking.startDate)} (${booking.reference})`,
    html,
    text,
  };
}

/** Sent when the owner declines or cancels. */
export function customerStatusChanged(booking: Booking): RenderedEmail {
  const declined = booking.status === "declined";
  const heading = declined
    ? "We couldn't take this booking"
    : "Your booking has been cancelled";

  const intro = declined
    ? `Sorry, ${escapeHtml(booking.customer.name.split(" ")[0])} — we aren't able to take your request for the <strong>${escapeHtml(booking.carName)}</strong> on those dates. Nothing has been charged.`
    : `Your booking for the <strong>${escapeHtml(booking.carName)}</strong> has been cancelled. Nothing has been charged.`;

  const html = emailLayout({
    preheader: `${heading} — ${booking.reference}`,
    heading,
    intro,
    body: `
      ${detailTable(bookingRows(booking))}
      ${
        booking.ownerNote
          ? `<h2 style="margin:0 0 12px;font-size:16px;font-weight:700;">A note from us</h2>
             <p style="margin:0 0 24px;padding:14px 16px;background:#faf9f7;border:1px solid #e7e5e4;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(booking.ownerNote)}</p>`
          : ""
      }
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#57534e;">
        We'd still love to get you out in one of ours — other cars and other dates may well be open.
      </p>
      ${button({ label: "Check other dates", url: `${site.url}/fleet` })}
    `,
  });

  const text = `${heading.toUpperCase()}

${declined ? `We aren't able to take your request for the ${booking.carName} on those dates.` : `Your booking for the ${booking.carName} has been cancelled.`} Nothing has been charged.

${plainSummary(booking)}
${booking.ownerNote ? `\nA note from us:\n${booking.ownerNote}\n` : ""}
Other cars and other dates may well be open: ${site.url}/fleet

${site.name} — ${site.phone} — ${site.url}`;

  return { subject: `${heading} — ${booking.reference}`, html, text };
}

/** Contact form relay to the owner. */
export function contactMessage(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): RenderedEmail {
  const html = emailLayout({
    preheader: `${input.name} sent a message from the website.`,
    heading: "New website enquiry",
    intro: `<strong>${escapeHtml(input.name)}</strong> sent a message through the contact form.`,
    body: `
      ${detailTable([
        { label: "Name", value: escapeHtml(input.name) },
        {
          label: "Email",
          value: `<a href="mailto:${escapeHtml(input.email)}" style="color:#d94436;">${escapeHtml(input.email)}</a>`,
        },
        { label: "Phone", value: escapeHtml(input.phone || "—") },
      ])}
      <p style="margin:0;padding:14px 16px;background:#faf9f7;border:1px solid #e7e5e4;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(input.message)}</p>
    `,
  });

  const text = `NEW WEBSITE ENQUIRY

Name:  ${input.name}
Email: ${input.email}
Phone: ${input.phone || "—"}

${input.message}`;

  return { subject: `Website enquiry from ${input.name}`, html, text };
}
