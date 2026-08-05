"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/bookings";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message ?? "Login failed.");
        setSubmitting(false);
        return;
      }

      // Only redirect within this site — never to a URL an attacker supplied.
      router.push(next.startsWith("/") ? next : "/admin/bookings");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-7">
      <label className="block">
        <span className="field-label">Password</span>
        <input
          type="password"
          className="field-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
          required
        />
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-xl border-[1.5px] border-brand bg-brand-light px-4 py-3 text-sm font-semibold text-brand-dark"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full py-3.5"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
