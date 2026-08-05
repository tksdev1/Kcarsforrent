import { getStore } from "./store";
import type { Car } from "./types";

const KEY = "fleet";

/**
 * Starter fleet. These are samples so the site is never empty on first deploy —
 * edit or replace them from /admin/fleet, no code change needed. Rates are
 * placeholders: set your real ones before you launch.
 */
export const SEED_FLEET: Car[] = [
  {
    id: "car_sakura",
    slug: "sakura-blossom",
    name: "Sakura",
    theme: "Cherry Blossom",
    tagline: "Soft pink petals, hard turns of the head.",
    description:
      "Our pastel pink Kei van wrapped end to end in falling cherry blossoms, finished with a bamboo dash and a tiny torii gate on the roof rack. The unanimous favourite for quinceañera photo sets and spring engagement shoots.",
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
  {
    id: "car_sundae",
    slug: "sundae-scoop",
    name: "Sundae",
    theme: "Ice Cream Truck",
    tagline: "Sprinkles on the outside, speakers on the inside.",
    description:
      "A working ice cream truck aesthetic in a package small enough to park anywhere. Mint and cream two-tone, a scalloped awning that folds out from the sliding door, and a chime you can actually play. Birthday parties book this one first.",
    model: "1998 Daihatsu Hijet",
    seats: 2,
    transmission: "Automatic",
    image: "",
    gallery: [],
    accent: "#3fb8a5",
    features: [
      "Fold-out serving awning",
      "Working ice cream chime",
      "Mint & cream two-tone wrap",
      "Rear serving window",
      "Cooler shelf (bring your own treats)",
    ],
    dailyRate: 219,
    weekendRate: 259,
    deliveryFee: 60,
    cleaningFee: 55,
    minDays: 1,
    active: true,
    sortOrder: 2,
  },
  {
    id: "car_arcade",
    slug: "retro-arcade",
    name: "Arcade",
    theme: "80s Arcade",
    tagline: "Insert coin. Press start. Drive.",
    description:
      "Neon grid lines, pixel-art side panels and a purple-to-cyan fade that photographs unreasonably well after dark. Under-glow lighting included. Built for night shoots, album covers and anyone whose party has a theme.",
    model: "1994 Honda Acty",
    seats: 4,
    transmission: "Manual",
    image: "",
    gallery: [],
    accent: "#8b5cf6",
    features: [
      "Neon grid wrap",
      "RGB under-glow lighting",
      "Pixel-art side panels",
      "Bluetooth sound system",
      "Interior LED strips",
    ],
    dailyRate: 199,
    weekendRate: 239,
    deliveryFee: 60,
    cleaningFee: 45,
    minDays: 1,
    active: true,
    sortOrder: 3,
  },
  {
    id: "car_daisy",
    slug: "hello-daisy",
    name: "Daisy",
    theme: "Sunshine Florals",
    tagline: "Impossible to be in a bad mood in this thing.",
    description:
      "Butter yellow with hand-painted daisies across every panel, a woven picnic basket strapped to the roof and gingham seat covers. Our most-requested car for bridal parties, farmers-market Saturdays and golden-hour portraits.",
    model: "1997 Subaru Sambar",
    seats: 4,
    transmission: "Automatic",
    image: "",
    gallery: [],
    accent: "#f2b134",
    features: [
      "Hand-painted daisy panels",
      "Gingham seat covers",
      "Roof picnic basket",
      "Sunroof",
      "Bluetooth sound system",
    ],
    dailyRate: 179,
    weekendRate: 209,
    deliveryFee: 60,
    cleaningFee: 45,
    minDays: 1,
    active: true,
    sortOrder: 4,
  },
  {
    id: "car_bloom",
    slug: "midnight-bloom",
    name: "Bloom",
    theme: "Midnight Garden",
    tagline: "Deep navy, gold leaf, quiet drama.",
    description:
      "The grown-up one. Deep navy base with gold-leaf botanical detailing and a cream leather interior. Understated enough for weddings and anniversary shoots, still unmistakably a Kei van.",
    model: "1999 Suzuki Carry",
    seats: 2,
    transmission: "Automatic",
    image: "",
    gallery: [],
    accent: "#2f4b7c",
    features: [
      "Gold-leaf botanical detailing",
      "Cream leather interior",
      "Ambient interior lighting",
      "Bluetooth sound system",
      "Cold A/C",
    ],
    dailyRate: 209,
    weekendRate: 249,
    deliveryFee: 60,
    cleaningFee: 50,
    minDays: 1,
    active: true,
    sortOrder: 5,
  },
  {
    id: "car_chile",
    slug: "chile-rojo",
    name: "Chile Rojo",
    theme: "Fiesta",
    tagline: "Papel picado, all the way down.",
    description:
      "Bright red with papel picado banners, marigold accents and hand-lettered scrollwork down both sides. Made for quinceañeras, birthdays and any celebration that deserves a proper entrance.",
    model: "1995 Mitsubishi Minicab",
    seats: 4,
    transmission: "Automatic",
    image: "",
    gallery: [],
    accent: "#d94436",
    features: [
      "Hand-lettered scrollwork",
      "Papel picado banner kit",
      "Marigold roof garland",
      "Bluetooth sound system",
      "Cold A/C",
    ],
    dailyRate: 189,
    weekendRate: 229,
    deliveryFee: 60,
    cleaningFee: 45,
    minDays: 1,
    active: true,
    sortOrder: 6,
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
