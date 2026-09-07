import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Shop All | Luxury Lashes, Press-On Nails & Lip Gloss",
  description:
    "Browse the full Zuri Cosmetics collection — cluster lashes, strip lashes, press-on nails, nail care, lip gloss and lip liners. Filter by category, price, shade and availability.",
  alternates: { canonical: "/shop" },
};

const BANNER =
  "https://images.pexels.com/photos/7256131/pexels-photo-7256131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CategoryPage
      searchParams={searchParams}
      title="Shop Zuri Cosmetics"
      subtitle="Every piece of the ritual, in one place."
      banner={BANNER}
      eyebrow="The full collection"
      description="Filter by category, price, shade and availability — or sort by featured, newest, best selling and price."
      metaTitle="Shop All"
      metaDescription="The full Zuri Cosmetics collection."
    />
  );
}
