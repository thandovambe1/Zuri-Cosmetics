import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zuricosmetics.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/shop",
    "/lashes",
    "/nails",
    "/lipgloss",
    "/tutorials",
    "/about",
    "/faq",
    "/contact",
    "/shipping",
  ];

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));
}
