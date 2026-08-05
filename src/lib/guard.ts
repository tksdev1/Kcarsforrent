import { NextResponse } from "next/server";

import { isAuthenticated } from "./auth";

/**
 * Guard for admin API routes.
 *
 * Middleware only checks that a cookie exists; this verifies the signature, so
 * every admin route handler must call it before doing anything. Returns a 401
 * response when the caller isn't authenticated, or null when they are.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAuthenticated()) return null;
  return NextResponse.json({ message: "Not authorised." }, { status: 401 });
}
