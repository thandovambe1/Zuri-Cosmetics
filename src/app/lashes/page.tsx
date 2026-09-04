import type { Metadata } from "next";
import CategoryView from "@/components/category-view";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Zuri Lashes — Cluster & Strip Lash Kits",
  description:
    "Shop Zuri Lashes: cluster lashes, strip lashes, complete application kits, lash glue and gentle remover. Your perfect lash look, made effortless.",
  alternates: { canonical: "/lashes" },
  openGraph: {
    title: "Zuri Lashes | Zuri Cosmetics",
    description: "Cluster lashes, strip lashes and complete application kits — your perfect lash look, made effortless.",
    url: "/lashes",
    type: "website",
  },
};

export default async function LashesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <CategoryView
      slug="lashes"
      searchParams={{
        category: "lashes",
        band: sp.band,
        availability: sp.availability,
        shade: sp.shade,
        sort: sp.sort,
      }}
    />
  );
}
