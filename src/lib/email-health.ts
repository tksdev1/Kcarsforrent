import { ownerRecipients } from "./email";
import { site } from "./site";

/**
 * Consumer mailbox providers. You can never legitimately send "from" one of
 * these through a third-party provider — they publish DMARC policies that
 * reject it.
 */
const FREE_MAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

/** Pulls the domain out of "Name <a@b.com>", "a@b.com" or "https://b.com". */
function domainOf(value: string): string | null {
  const angled = value.match(/<([^>]+)>/);
  const candidate = (angled ? angled[1] : value).trim();

  const afterAt = candidate.includes("@")
    ? candidate.slice(candidate.lastIndexOf("@") + 1)
    : candidate.replace(/^https?:\/\//, "").split("/")[0];

  const domain = afterAt.toLowerCase().replace(/^www\./, "").trim();
  return domain.includes(".") ? domain : null;
}

/** Treats mail.example.com as belonging to example.com. */
function isSameOrSubdomain(candidate: string, root: string): boolean {
  return candidate === root || candidate.endsWith(`.${root}`);
}

export interface EmailHealth {
  configured: boolean;
  /** Human-readable problems, safe to show in the dashboard. */
  problems: string[];
  fromAddress: string | null;
  ownerRecipients: string[];
  /** Deep link straight to this project's environment variables in Netlify. */
  settingsUrl: string;
}

/**
 * Netlify's own env-var page for this project.
 *
 * Built from SITE_NAME, which Netlify injects, rather than describing a menu
 * path — Netlify renamed "Sites" to "Projects" and the old "Site configuration"
 * wording sent people hunting for a menu item that no longer exists.
 */
function netlifySettingsUrl(): string {
  const siteName = process.env.SITE_NAME;
  return siteName
    ? `https://app.netlify.com/projects/${siteName}/configuration/env`
    : "https://app.netlify.com";
}

/**
 * Checks that email is actually set up.
 *
 * Without this the failure mode is silent: bookings are still recorded, the
 * customer is still told "we've emailed you", and nothing anywhere says the
 * mail never left. Surfaced at the top of the dashboard so a missing key is
 * obvious rather than something you find out about from an angry customer.
 */
export function checkEmailHealth(): EmailHealth {
  const problems: string[] = [];
  const siteDomain = domainOf(site.url);

  const hasKey = Boolean(process.env.RESEND_API_KEY);
  if (!hasKey) {
    problems.push(
      "RESEND_API_KEY isn't set, so no email is being sent at all. Bookings are still being recorded, but nobody is being notified.",
    );
  }

  const recipients = ownerRecipients();
  if (recipients.length === 0) {
    problems.push(
      "OWNER_NOTIFICATION_EMAIL isn't set, so new booking requests aren't being emailed to you.",
    );
  }

  const from = process.env.BOOKING_FROM_EMAIL ?? null;
  if (!from) {
    problems.push(
      "BOOKING_FROM_EMAIL isn't set, so mail goes out from the Resend test address and only reaches your own Resend account.",
    );
  } else if (from.includes("onboarding@resend.dev")) {
    problems.push(
      "BOOKING_FROM_EMAIL is still Resend's test address. Mail will only reach your own Resend account — customers won't get anything. Verify your domain and switch it over before launch.",
    );
  } else {
    const fromDomain = domainOf(from);

    if (fromDomain && FREE_MAIL_DOMAINS.has(fromDomain)) {
      // The worst deliverability mistake available, and an easy one to make
      // when your own address is a Gmail one. Gmail and Yahoo publish strict
      // DMARC policies, so mail claiming to come from them but sent through
      // Resend fails authentication outright — junked or bounced, not
      // "slightly less likely to be seen".
      problems.push(
        `BOOKING_FROM_EMAIL sends from ${fromDomain}, which you don't control. ${fromDomain} publishes a strict DMARC policy, so mail sent through Resend claiming to be from it will be rejected or junked. Send from your own verified domain instead and use ${fromDomain} as the reply-to.`,
      );
    } else if (fromDomain && siteDomain && !isSameOrSubdomain(fromDomain, siteDomain)) {
      problems.push(
        `BOOKING_FROM_EMAIL sends from ${fromDomain}, but the site is ${siteDomain}. That mismatch looks like spoofing to spam filters, and the domain has to be verified in Resend to send at all.`,
      );
    }
  }

  return {
    configured: problems.length === 0,
    problems,
    fromAddress: from,
    ownerRecipients: recipients,
    settingsUrl: netlifySettingsUrl(),
  };
}
