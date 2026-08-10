import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Filenames checked for the brand logo, in order. Drop the file into
 * `public/` under any of these names and the header and footer pick it up on
 * the next build — no code change.
 */
const LOGO_CANDIDATES = [
  "logo.png",
  "logo.svg",
  "logo.webp",
  "logo.jpg",
  "logo.jpeg",
];

/**
 * Public path of the logo, or null when there isn't one yet.
 *
 * Checked on disk rather than hardcoded so the header degrades to the text
 * wordmark instead of rendering a broken image if the file is missing. Server
 * side only — callers pass the result down to the client components.
 */
export function findLogo(): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const name of LOGO_CANDIDATES) {
    if (existsSync(path.join(publicDir, name))) return `/${name}`;
  }
  return null;
}
