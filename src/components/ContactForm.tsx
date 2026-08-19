"use client";

import { useState } from "react";


export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, website }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors ?? { form: data.message ?? "Something went wrong." });
        setSubmitting(false);
        return;
      }

      setSent(true);
    } catch {
      setErrors({
        form:
          "We couldn't send that — it may have been a connection blip. Please check your connection and try again.",
      });
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="card p-10 text-center">
        <span aria-hidden className="text-4xl">
          📬
        </span>
        <h2 className="mt-4 font-display text-2xl font-extrabold">
          Message sent
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          Thanks {name.split(" ")[0]} — we read every message ourselves and
          we’ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-7">
      {errors.form && (
        <p
          role="alert"
          className="rounded-xl border-[1.5px] border-brand bg-brand-light px-4 py-3 text-sm font-semibold text-brand-dark"
        >
          {errors.form}
        </p>
      )}

      <label className="block">
        <span className="field-label">
          Name<span className="ml-1 text-brand">*</span>
        </span>
        <input
          type="text"
          className="field-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          required
        />
        {errors.name && <span className="field-error block">{errors.name}</span>}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">
            Email<span className="ml-1 text-brand">*</span>
          </span>
          <input
            type="email"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            required
          />
          {errors.email && (
            <span className="field-error block">{errors.email}</span>
          )}
        </label>

        <label className="block">
          <span className="field-label">Phone</span>
          <input
            type="tel"
            className="field-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </label>
      </div>

      <label className="block">
        <span className="field-label">
          Message<span className="ml-1 text-brand">*</span>
        </span>
        <textarea
          className="field-input min-h-36 resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you're planning and when."
          aria-invalid={Boolean(errors.message)}
          required
        />
        {errors.message && (
          <span className="field-error block">{errors.message}</span>
        )}
      </label>

      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full py-4 text-base"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
