import type { Metadata } from "next";
import CategoryView from "@/components/category-view";

export const metadata: Metadata = {
  title: "Zuri LipGloss — Glosses & Lip Liners",
  description:
    "Shop Zuri LipGloss: crystal-clear high-shine gloss, colour lip glosses in wearable shades and defining lip liners. Gloss your way.",
  alternates: { canonical: "/lipgloss" },
  openGraph: {
    title: "Zuri LipGloss | Zuri Cosmetics",
    description: "High-shine glosses and defining lip liners — gloss your way with Zuri Cosmetics.",
    url: "/lipgloss",
    type: "website",
  },
};

export default async function LipGlossPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <CategoryView
      slug="lipgloss"
      searchParams={{
        category: "lipgloss",
        band: sp.band,
        availability: sp.availability,
        shade: sp.shade,
        sort: sp.sort,
      }}
    />
  );
}
