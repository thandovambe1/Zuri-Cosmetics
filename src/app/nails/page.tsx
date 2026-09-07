import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Zuri Nails | Press-On Nails, Nail Art & Nail Care",
  description:
    "Salon-inspired nails, from the comfort of home. Shop Zuri Cosmetics acrylic & gel press-on nails, nail art stickers, base coat, top coat, cuticle oil and nail care kits.",
  alternates: { canonical: "/nails" },
};

const BANNER =
  "https://images.pexels.com/photos/34835287/pexels-photo-34835287.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default async function NailsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CategoryPage
      category="nails"
      searchParams={searchParams}
      title="Zuri Nails"
      subtitle="Salon-inspired nails, from the comfort of home."
      banner={BANNER}
      eyebrow="Zuri Nails"
      description="Acrylic and gel press-ons, delicate nail art and the complete care edit — base coats, top coats, cuticle love and prep kits."
      metaTitle="Zuri Nails"
      metaDescription="Press-on nails, nail art and the complete nail care edit."
    />
  );
}
