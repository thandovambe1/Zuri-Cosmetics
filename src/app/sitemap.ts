import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    "",
    "/shop",
    "/lashes",
    "/nails",
    "/lipgloss",
    "/tutorials",
    "/about",
    "/contact",
    "/faq",
    "/search",
    "/account",
    "/policies/shipping",
    "/policies/returns",
    "/policies/privacy",
    "/policies/terms",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    const products = await listProducts();
    const productRoutes = products.map((p) => ({
      url: `${siteConfig.url}/product/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
