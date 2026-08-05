/**
 * Values shared between the Edge middleware and the Node server runtime.
 *
 * Middleware runs on the Edge, where `node:crypto` isn't available — so this
 * file must stay free of Node imports. Anything needing crypto lives in
 * `auth.ts`, which only ever runs server-side.
 */
export const SESSION_COOKIE = "kc_admin";

export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours
