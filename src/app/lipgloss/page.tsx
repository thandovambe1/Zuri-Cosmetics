import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Zuri LipGloss | Plain Gloss, Colour Gloss & Lip Liners",
  description:
    "Gloss your way. Shop Zuri Cosmetics plain high-shine lip gloss, colour lip glosses in a growing shade edit and creamy precision lip liners.",
  alternates: { canonical: "/lipgloss" },
};

const BANNER =
  "https://images.pexels.com/photos/2547462/pexels-photo-2547462.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default async function LipGlossPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CategoryPage
      category="lipgloss"
      searchParams={searchParams}
      title="Zuri LipGloss"
      subtitle="Gloss your way."
      banner={BANNER}
      eyebrow="Zuri LipGloss"
      description="High-shine plain gloss, sheer colour glosses and creamy lip liners — in a soft-luxury shade edit that keeps on growing."
      metaTitle="Zuri LipGloss"
      metaDescription="Plain gloss, colour gloss shades and lip liners."
    />
  );
}
