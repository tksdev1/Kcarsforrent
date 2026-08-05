import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { deleteCar, getAllCars, slugify, upsertCar } from "@/lib/fleet";
import { requireAdmin } from "@/lib/guard";
import type { Car } from "@/lib/types";
import { carSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  return NextResponse.json({ cars: await getAllCars() });
}

/** Create or update a car. An `id` in the body means update. */
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  const parsed = carSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Please check the highlighted fields.",
        errors: fieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const input = parsed.data;
  const cars = await getAllCars();
  const existing = input.id ? cars.find((car) => car.id === input.id) : null;

  // Slugs are part of public URLs, so keep an existing car's slug stable even
  // if its name is edited — renaming a car shouldn't break links or QR codes.
  let slug = existing?.slug ?? slugify(input.name);
  if (!slug) slug = `car-${Date.now()}`;
  if (!existing) {
    const taken = new Set(cars.map((car) => car.slug));
    let candidate = slug;
    let n = 2;
    while (taken.has(candidate)) candidate = `${slug}-${n++}`;
    slug = candidate;
  }

  const car: Car = {
    id: existing?.id ?? `car_${randomUUID()}`,
    slug,
    name: input.name,
    theme: input.theme,
    tagline: input.tagline,
    description: input.description,
    model: input.model,
    seats: input.seats,
    transmission: input.transmission,
    image: input.image,
    gallery: existing?.gallery ?? [],
    accent: input.accent,
    features: input.features
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    dailyRate: input.dailyRate,
    weekendRate: input.weekendRate === undefined ? undefined : input.weekendRate,
    deliveryFee: input.deliveryFee,
    cleaningFee: input.cleaningFee,
    minDays: input.minDays,
    active: input.active,
    sortOrder: input.sortOrder,
  };

  await upsertCar(car);
  return NextResponse.json({ car }, { status: existing ? 200 : 201 });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Missing car id." }, { status: 400 });
  }

  await deleteCar(id);
  return NextResponse.json({ ok: true });
}
