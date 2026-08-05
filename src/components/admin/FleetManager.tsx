"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { formatMoney } from "@/lib/site";
import type { Car } from "@/lib/types";

type Draft = {
  id?: string;
  name: string;
  theme: string;
  tagline: string;
  description: string;
  model: string;
  seats: string;
  transmission: "Automatic" | "Manual";
  image: string;
  accent: string;
  features: string;
  dailyRate: string;
  weekendRate: string;
  deliveryFee: string;
  cleaningFee: string;
  minDays: string;
  active: boolean;
  sortOrder: string;
};

const EMPTY: Draft = {
  name: "",
  theme: "",
  tagline: "",
  description: "",
  model: "",
  seats: "4",
  transmission: "Automatic",
  image: "",
  accent: "#d94436",
  features: "",
  dailyRate: "179",
  weekendRate: "",
  deliveryFee: "60",
  cleaningFee: "45",
  minDays: "1",
  active: true,
  sortOrder: "10",
};

function toDraft(car: Car): Draft {
  return {
    id: car.id,
    name: car.name,
    theme: car.theme,
    tagline: car.tagline,
    description: car.description,
    model: car.model,
    seats: String(car.seats),
    transmission: car.transmission,
    image: car.image,
    accent: car.accent,
    features: car.features.join("\n"),
    dailyRate: String(car.dailyRate),
    weekendRate: car.weekendRate === undefined ? "" : String(car.weekendRate),
    deliveryFee: String(car.deliveryFee),
    cleaningFee: String(car.cleaningFee),
    minDays: String(car.minDays),
    active: car.active,
    sortOrder: String(car.sortOrder),
  };
}

export function FleetManager({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;

    setSaving(true);
    setErrors({});

    try {
      const response = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          // Empty weekend rate means "same as the weekday rate".
          weekendRate: draft.weekendRate === "" ? undefined : draft.weekendRate,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors ?? { form: data.message ?? "Couldn't save." });
        setSaving(false);
        return;
      }

      setFlash(`Saved ${draft.name}.`);
      setDraft(null);
      router.refresh();
    } catch {
      setErrors({ form: "Couldn't reach the server." });
    } finally {
      setSaving(false);
    }
  }

  async function remove(car: Car) {
    if (
      !window.confirm(
        `Delete ${car.name} permanently? Existing bookings keep their record, but the car disappears from the site.\n\nIf you only want to hide it, edit the car and untick "Show on the website" instead.`,
      )
    ) {
      return;
    }

    await fetch(`/api/admin/cars?id=${encodeURIComponent(car.id)}`, {
      method: "DELETE",
    });
    setFlash(`Deleted ${car.name}.`);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-extrabold">Fleet</h1>
          <p className="mt-2 text-sm text-muted">
            {cars.filter((c) => c.active).length} live on the site ·{" "}
            {cars.length} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDraft(EMPTY);
            setErrors({});
          }}
          className="btn btn-primary"
        >
          Add a car
        </button>
      </div>

      {flash && (
        <p
          role="status"
          className="mt-6 rounded-xl border-[1.5px] border-mint bg-mint/10 px-4 py-3 text-sm font-semibold text-[#0f5c50]"
        >
          {flash}
        </p>
      )}

      {draft && (
        <form onSubmit={save} className="card mt-7 p-7">
          <h2 className="font-display text-2xl font-extrabold">
            {draft.id ? `Editing ${draft.name || "car"}` : "New car"}
          </h2>

          {errors.form && (
            <p
              role="alert"
              className="mt-4 rounded-xl border-[1.5px] border-brand bg-brand-light px-4 py-3 text-sm font-semibold text-brand-dark"
            >
              {errors.form}
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Text label="Name" value={draft.name} error={errors.name} onChange={(v) => set("name", v)} required />
            <Text label="Theme" value={draft.theme} error={errors.theme} onChange={(v) => set("theme", v)} />

            <div className="sm:col-span-2">
              <Text
                label="Tagline"
                value={draft.tagline}
                error={errors.tagline}
                onChange={(v) => set("tagline", v)}
                hint="One short line shown under the name on the card."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block">
                <span className="field-label">Description</span>
                <textarea
                  className="field-input min-h-28 resize-y"
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </label>
            </div>

            <Text label="Base vehicle" value={draft.model} onChange={(v) => set("model", v)} hint="e.g. 1996 Suzuki Every" />

            <label className="block">
              <span className="field-label">Transmission</span>
              <select
                className="field-input"
                value={draft.transmission}
                onChange={(e) =>
                  set("transmission", e.target.value as "Automatic" | "Manual")
                }
              >
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </label>

            <Text label="Seats" type="number" value={draft.seats} error={errors.seats} onChange={(v) => set("seats", v)} />

            <label className="block">
              <span className="field-label">Accent colour</span>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border-[1.5px] border-line bg-white p-1"
                  value={draft.accent}
                  onChange={(e) => set("accent", e.target.value)}
                />
                <input
                  type="text"
                  className="field-input"
                  value={draft.accent}
                  onChange={(e) => set("accent", e.target.value)}
                />
              </div>
              {errors.accent && <span className="field-error block">{errors.accent}</span>}
            </label>

            <div className="sm:col-span-2">
              <Text
                label="Photo URL"
                value={draft.image}
                error={errors.image}
                onChange={(v) => set("image", v)}
                hint="Leave blank to use the illustrated placeholder. Use /fleet/name.jpg for a file in public/fleet, or a full https:// URL."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block">
                <span className="field-label">Features — one per line</span>
                <textarea
                  className="field-input min-h-28 resize-y font-mono text-sm"
                  value={draft.features}
                  onChange={(e) => set("features", e.target.value)}
                  placeholder={"Bluetooth sound system\nCold A/C\nRoof rack"}
                />
              </label>
            </div>

            <Text label="Daily rate" type="number" value={draft.dailyRate} error={errors.dailyRate} onChange={(v) => set("dailyRate", v)} />
            <Text
              label="Weekend rate (Fri–Sun)"
              type="number"
              value={draft.weekendRate}
              error={errors.weekendRate}
              onChange={(v) => set("weekendRate", v)}
              hint="Leave blank to charge the daily rate every day."
            />
            <Text label="Delivery fee" type="number" value={draft.deliveryFee} error={errors.deliveryFee} onChange={(v) => set("deliveryFee", v)} />
            <Text label="Cleaning & prep fee" type="number" value={draft.cleaningFee} error={errors.cleaningFee} onChange={(v) => set("cleaningFee", v)} />
            <Text label="Minimum days" type="number" value={draft.minDays} error={errors.minDays} onChange={(v) => set("minDays", v)} />
            <Text
              label="Sort order"
              type="number"
              value={draft.sortOrder}
              error={errors.sortOrder}
              onChange={(v) => set("sortOrder", v)}
              hint="Lower numbers appear first."
            />

            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => set("active", e.target.checked)}
                className="h-4.5 w-4.5 accent-[#d94436]"
              />
              <span className="text-sm font-bold">Show on the website</span>
            </label>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? "Saving…" : "Save car"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="btn btn-ghost bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="mt-7 space-y-3">
        {cars.map((car) => (
          <li key={car.id} className="card flex flex-wrap items-center gap-x-5 gap-y-3 p-5">
            <span
              aria-hidden
              className="h-12 w-12 shrink-0 rounded-xl"
              style={{ backgroundColor: car.accent }}
            />

            <div className="min-w-48 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-extrabold">{car.name}</h2>
                {!car.active && (
                  <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-stone-600">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">
                {car.theme} · {car.seats} seats · /fleet/{car.slug}
              </p>
            </div>

            <p className="text-sm font-bold">
              {formatMoney(car.dailyRate)}
              <span className="font-semibold text-muted"> / day</span>
              {car.weekendRate && car.weekendRate !== car.dailyRate && (
                <span className="font-semibold text-muted">
                  {" "}
                  · {formatMoney(car.weekendRate)} wknd
                </span>
              )}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(toDraft(car));
                  setErrors({});
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn btn-ghost bg-white px-4 py-2 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(car)}
                className="px-2 text-sm font-bold text-muted transition-colors hover:text-brand"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Text({
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
      </span>
      <input
        type={type}
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "any" : undefined}
      />
      {hint && !error && (
        <span className="mt-1 block text-xs text-muted">{hint}</span>
      )}
      {error && <span className="field-error block">{error}</span>}
    </label>
  );
}
