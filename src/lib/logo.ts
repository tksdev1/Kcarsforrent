import logo from "../../public/logo.png";

/**
 * The brand logo, resolved at build time.
 *
 * Deliberately a static import rather than a runtime filesystem check. The
 * previous version called existsSync() on public/logo.png, which is true
 * locally but false on Netlify — the app runs in a serverless function and
 * public/ is never bundled into it, since static files are served by the CDN.
 * The header silently fell back to the text wordmark in production.
 *
 * A static import is resolved by the bundler, so local and deployed can't
 * disagree, and a missing file fails the build loudly instead of degrading
 * quietly.
 */
export const LOGO_SRC = logo.src;
export const LOGO_WIDTH = logo.width;
export const LOGO_HEIGHT = logo.height;
