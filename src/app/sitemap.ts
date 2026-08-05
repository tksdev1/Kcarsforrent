import type { MetadataRoute } from "next";

import { getActiveCars } from "@/lib/fleet";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/fleet", priority: 0.9 },
    { path: "/book", priority: 0.9 },
    { path: "/how-it-works", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/policies", priority: 0.3 },
  ].map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  let carRoutes: MetadataRoute.Sitemap = [];
  try {
    const cars = await getActiveCars();
    carRoutes = cars.map((car) => ({
      url: `${site.url}/fleet/${car.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // A store hiccup shouldn't take the whole sitemap down.
  }

  return [...staticRoutes, ...carRoutes];
}
