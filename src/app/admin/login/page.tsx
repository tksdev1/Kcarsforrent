import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Owner login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper-2 bg-dots px-5">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold">
            Owner dashboard
          </h1>
          <p className="mt-2 text-sm text-muted">{site.name}</p>
        </div>

        <Suspense
          fallback={<div className="card mt-8 p-7 text-center text-muted">Loading…</div>}
        >
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-muted">
          <a href="/" className="hover:text-brand">
            ← Back to the website
          </a>
        </p>
      </div>
    </div>
  );
}
