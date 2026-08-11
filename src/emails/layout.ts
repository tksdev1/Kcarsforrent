import { site } from "@/lib/site";

export interface EmailButton {
  label: string;
  url: string;
}

export interface EmailRow {
  label: string;
  value: string;
}

/* Mirrors the site palette in src/app/globals.css. Kept as plain hex constants
   because email clients strip CSS custom properties. */
const BRAND = "#d6206a";
const INK = "#2a1a21";
const MUTED = "#7c6069";
const LINE = "#f5d9e6";
const PAPER = "#fff7fa";

/**
 * Email HTML is deliberately old-fashioned — tables, inline styles, no flexbox.
 * Gmail, Outlook and Apple Mail all render this consistently; a modern CSS
 * layout would not survive Outlook.
 */
export function emailLayout(options: {
  preheader: string;
  heading: string;
  intro: string;
  body: string;
  footerNote?: string;
}): string {
  const { preheader, heading, intro, body, footerNote } = options;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:16px;overflow:hidden;">

          <tr>
            <td style="background:${BRAND};padding:28px 32px;">
              <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">${escapeHtml(site.name)}</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:4px;">${escapeHtml(site.tagline)}</div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:800;color:${INK};letter-spacing:-0.02em;">${escapeHtml(heading)}</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${MUTED};">${intro}</p>
              ${body}
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px;background:${PAPER};border-top:1px solid ${LINE};">
              ${
                footerNote
                  ? `<p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:${MUTED};">${footerNote}</p>`
                  : ""
              }
              <p style="margin:0;font-size:13px;line-height:1.7;color:${MUTED};">
                <strong style="color:${INK};">${escapeHtml(site.name)}</strong><br>
                <a href="${site.phoneHref}" style="color:${MUTED};text-decoration:none;">${escapeHtml(site.phone)}</a><br>
                <a href="${site.url}" style="color:${BRAND};text-decoration:none;">${escapeHtml(site.url.replace(/^https?:\/\//, ""))}</a><br>
                <span style="color:${MUTED};">${escapeHtml(`${site.city}, ${site.region}`)}</span>
              </p>
              <!-- A real postal location is a legitimacy signal filters look
                   for, and CAN-SPAM expects it on commercial mail. -->
              <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:${MUTED};">
                You're receiving this because you requested a booking with
                ${escapeHtml(site.name)}. This is a transactional message about
                that booking, not marketing.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function detailTable(rows: EmailRow[]): string {
  const cells = rows
    .map(
      (row, i) => `
      <tr>
        <td style="padding:12px 0;${i > 0 ? `border-top:1px solid ${LINE};` : ""}font-size:14px;color:${MUTED};width:40%;vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:12px 0;${i > 0 ? `border-top:1px solid ${LINE};` : ""}font-size:14px;color:${INK};font-weight:600;vertical-align:top;">${row.value}</td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;padding:4px 16px;margin:0 0 24px;">${cells}</table>`;
}

export function quoteTable(
  lines: { label: string; amount: string }[],
  total: string,
): string {
  const rows = lines
    .map(
      (line) => `
      <tr>
        <td style="padding:8px 0;font-size:14px;color:${MUTED};">${escapeHtml(line.label)}</td>
        <td align="right" style="padding:8px 0;font-size:14px;color:${INK};">${escapeHtml(line.amount)}</td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;padding:8px 16px;margin:0 0 24px;">
    ${rows}
    <tr>
      <td style="padding:12px 0;border-top:2px solid ${INK};font-size:15px;font-weight:800;color:${INK};">Estimated total</td>
      <td align="right" style="padding:12px 0;border-top:2px solid ${INK};font-size:15px;font-weight:800;color:${INK};">${escapeHtml(total)}</td>
    </tr>
  </table>`;
}

export function button({ label, url }: EmailButton): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
    <tr>
      <td style="background:${BRAND};border-radius:999px;">
        <a href="${url}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

export function callout(text: string, tone: "info" | "good" | "warn" = "info"): string {
  const colors = {
    info: { bg: "#f5f3ff", border: "#ddd6fe", text: "#5b21b6" },
    good: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
    warn: { bg: "#fffbeb", border: "#fde68a", text: "#92400e" },
  }[tone];

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.bg};border:1px solid ${colors.border};border-radius:12px;margin:0 0 24px;">
    <tr><td style="padding:14px 16px;font-size:14px;line-height:1.6;color:${colors.text};">${text}</td></tr>
  </table>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
