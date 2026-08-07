import { getStore } from "./store";
import type { Car } from "./types";

const KEY = "fleet";

/**
 * The starter car.
 *
 * This is a sample so the site is never empty on first deploy — open
 * /admin/fleet and edit it into your actual car (name, theme, description,
 * photo, rates). Nothing here needs a code change.
 *
 * The site adapts automatically to how many cars are active: with one, the home
 * and fleet pages give it a full-width feature and the booking form drops its
 * "choose your car" step. Add a second car and both switch to a grid.
 */
export const SEED_FLEET: Car[] = [
  {
    // Opaque internal id, kept stable deliberately. Bookings reference it, so
    // renaming it would orphan any that already exist and let their dates be
    // double-booked. The name and slug are what people actually see.
    id: "car_sakura",
    slug: "hello-kitty-kei-van",
    name: "Kitty",
    theme: "Hello Kitty",
    tagline: "Bubblegum pink, bow to bumper.",
    description:
      "A genuine Japanese Kei van wrapped end to end in bubblegum pink Hello Kitty artwork \u2014 Kitty and her teddy across the sliding door, cherries down the flank, a bow on the rear quarter, and a lit \u201cRent Me!\u201d sign on the roof. It is impossible to drive this thing without someone waving at you. Made for birthdays, quincea\u00f1eras, photo shoots and any entrance that deserves a bit of theatre.",
    // TODO: add the model year once you have it to hand.
    model: "Suzuki Every",
    seats: 4,
    transmission: "Automatic",
    image: "/fleet/hello-kitty-kei-van.jpg",
    gallery: [],
    accent: "#d6206a",
    features: [
      "Full Hello Kitty wrap, inside and out",
      "Lit \u201cRent Me!\u201d roof sign",
      "Kitty & teddy side artwork",
      "Custom alloy wheels",
      "Cold A/C",
    ],
    dailyRate: 179,
    // No weekend premium — one rate every day. Leaving weekendRate unset makes
    // the quote show a single "Rental — N days" line instead of splitting it.
    deliveryFee: 60,
    cleaningFee: 45,
    minDays: 1,
    active: true,
    sortOrder: 1,
  },
];

function sortFleet(cars: Car[]): Car[] {
  return [...cars].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );
}

/** All cars, including inactive ones. Seeds the store on first run. */
export async function getAllCars(): Promise<Car[]> {
  const store = getStore();
  const existing = await store.get<Car[]>(KEY);
  if (existing && existing.length > 0) return sortFleet(existing);

  await store.set(KEY, SEED_FLEET);
  return sortFleet(SEED_FLEET);
}

/** Only the cars that should appear on the public site. */
export async function getActiveCars(): Promise<Car[]> {
  return (await getAllCars()).filter((car) => car.active);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  return (await getAllCars()).find((car) => car.slug === slug) ?? null;
}

export async function getCarById(id: string): Promise<Car | null> {
  return (await getAllCars()).find((car) => car.id === id) ?? null;
}

export async function saveAllCars(cars: Car[]): Promise<void> {
  await getStore().set(KEY, sortFleet(cars));
}

export async function upsertCar(car: Car): Promise<Car> {
  const cars = await getAllCars();
  const index = cars.findIndex((c) => c.id === car.id);
  if (index >= 0) cars[index] = car;
  else cars.push(car);
  await saveAllCars(cars);
  return car;
}

export async function deleteCar(id: string): Promise<void> {
  const cars = await getAllCars();
  await saveAllCars(cars.filter((car) => car.id !== id));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
