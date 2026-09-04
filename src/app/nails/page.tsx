import type { Metadata } from "next";
import CategoryView from "@/components/category-view";

export const metadata: Metadata = {
  title: "Zuri Nails — Press-On Nails & Nail Care",
  description:
    "Shop Zuri Nails: acrylic press-on nails, gel press-on nails, nail art stickers, base & top coats, cuticle oil, the Nail Care Kit and cuticle tools. Salon-inspired nails, from home.",
  alternates: { canonical: "/nails" },
  openGraph: {
    title: "Zuri Nails | Zuri Cosmetics",
    description: "Acrylic & gel press-on nails plus complete nail care — salon-inspired nails, from the comfort of home.",
    url: "/nails",
    type: "website",
  },
};

export default async function NailsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <CategoryView
      slug="nails"
      searchParams={{
        category: "nails",
        band: sp.band,
        availability: sp.availability,
        shade: sp.shade,
        sort: sp.sort,
      }}
    />
  );
}
