"use client";

import { useState } from "react";

import type { EmailHealth } from "@/lib/email-health";

/**
 * Email configuration status, plus a one-click send test.
 *
 * The test is the point: it proves the API key, sending address and
 * notification address all work together, without having to submit a fake
 * booking and delete it afterwards.
 */
export function EmailStatusPanel({ health }: { health: EmailHealth }) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  async function sendTest() {
    setSending(true);
    setResult(null);
    try {
      const response = await fetch("/api/admin/test-email", { method: "POST" });
      const data = await response.json();
      setResult({ ok: Boolean(data.ok), message: data.message ?? "" });
    } catch {
      setResult({ ok: false, message: "Couldn't reach the server." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-6">
      {!health.configured && (
        <div
          role="alert"
          className="rounded-xl border-[1.5px] border-brand bg-brand-light px-5 py-4"
        >
          <p className="font-display text-lg font-extrabold text-brand-dark">
            Email isn't fully set up
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-brand-dark">
            {health.problems.map((problem) => (
              <li key={problem}>• {problem}</li>
            ))}
          </ul>
          <a
            href={health.settingsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary mt-4 px-5 py-2.5 text-sm"
          >
            Open environment variables in Netlify ↗
          </a>
          <p className="mt-3 text-xs text-brand-dark/80">
            Add them there, then <strong>redeploy</strong> — Netlify only reads
            environment variables on a fresh build. Bookings are never lost
            either way; they're saved before any email is attempted.
          </p>
        </div>
      )}

      <div
        className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${
          health.configured ? "" : "mt-3"
        }`}
      >
        <button
          type="button"
          onClick={sendTest}
          disabled={sending}
          className="btn btn-ghost bg-white px-5 py-2.5 text-sm"
        >
          {sending ? "Sending…" : "Send test email"}
        </button>

        {health.configured && !result && (
          <p className="text-sm text-muted">
            Sending as{" "}
            <span className="font-semibold text-ink-2">
              {health.fromAddress}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-ink-2">
              {health.ownerRecipients.join(", ")}
            </span>
            .
          </p>
        )}

        {result && (
          <p
            role="status"
            className={`rounded-xl border-[1.5px] px-4 py-2.5 text-sm font-semibold ${
              result.ok
                ? "border-mint bg-mint/10 text-[#0f5c50]"
                : "border-brand bg-brand-light text-brand-dark"
            }`}
          >
            {result.message}
          </p>
        )}
      </div>
    </div>
  );
}
