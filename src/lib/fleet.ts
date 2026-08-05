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
    id: "car_sakura",
    slug: "sakura-blossom",
    name: "Sakura",
    theme: "Cherry Blossom",
    tagline: "Soft pink petals, hard turns of the head.",
    description:
      "Our pastel pink Kei van wrapped end to end in falling cherry blossoms, finished with a bamboo dash and a tiny torii gate on the roof rack. Built for quinceañera photo sets, birthdays and spring engagement shoots.",
    model: "1996 Suzuki Every",
    seats: 4,
    transmission: "Automatic",
    image: "",
    gallery: [],
    accent: "#ec6a9c",
    features: [
      "Full cherry blossom wrap",
      "Bluetooth sound system",
      "Bamboo interior trim",
      "Rooftop torii prop",
      "Cold A/C",
    ],
    dailyRate: 189,
    weekendRate: 229,
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
