import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Zuri Lashes | Cluster & Strip Lashes, Kits, Glue & Remover",
  description:
    "Your perfect lash look, made effortless. Shop Zuri Cosmetics cluster lashes, strip lashes, application kits, lash glue remover and lash tools.",
  alternates: { canonical: "/lashes" },
};

const BANNER =
  "https://images.pexels.com/photos/8558535/pexels-photo-8558535.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default async function LashesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CategoryPage
      category="lashes"
      searchParams={searchParams}
      title="Zuri Lashes"
      subtitle="Your perfect lash look, made effortless."
      banner={BANNER}
      eyebrow="Zuri Lashes"
      description="Feather-light cluster and strip lashes, complete application kits and gentle removal — everything your lash ritual needs."
      metaTitle="Zuri Lashes"
      metaDescription="Cluster lashes, strip lashes, kits, glue remover and tools."
    />
  );
}
