import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts, type ProductFilters } from "@/lib/data";
import ProductCard from "@/components/product-card";
import ProductToolbar, { type FilterState } from "@/components/product-toolbar";
import Reveal from "@/components/reveal";
import { SectionHeading, EmptyState } from "@/components/ui";
import { IconBag } from "@/components/icons";

export const metadata: Metadata = {
  title: "Shop All — Lashes, Nails & Lip Essentials",
  description:
    "Shop the full Zuri Cosmetics range: cluster lashes, strip lashes, press-on nails, nail care, lip glosses and lip liners. Filter by collection, price, availability and shade.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  const filters: ProductFilters = {
    categorySlug: sp.category && sp.category !== "all" ? sp.category : undefined,
    sort: sp.sort,
    availability: sp.availability === "in" || sp.availability === "out" ? sp.availability : undefined,
    priceBand: sp.band,
    shade: sp.shade,
  };

  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);
  const currentCategory = categories.find((c) => c.slug === sp.category);

  const toolbarState: FilterState = {
    category: sp.category ?? "all",
    band: sp.band,
    availability: sp.availability,
    shade: sp.shade,
    sort: sp.sort,
  };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-blush-200/60 bg-gradient-to-b from-blush-50 via-cream to-cream">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
            <Link href="/" className="hover:text-rose-deep">Home</Link>
            <span className="mx-2 text-gold">/</span>
            <span className="text-plum">Shop</span>
          </nav>
          <SectionHeading
            className="mt-5"
            eyebrow="Zuri Cosmetics"
            title={currentCategory ? `Zuri ${currentCategory.name}` : "Shop Zuri Cosmetics"}
            sub={
              currentCategory
                ? currentCategory.description
                : "The complete Zuri edit — lashes, press-on nails, nail care and lip essentials in one beautiful place."
            }
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6">
        <div className="sticky top-[4.6rem] z-30 -mx-1 px-1 py-2 lg:top-[7rem]">
          <ProductToolbar basePath="/shop" categories={categories} current={toolbarState} showShades />
        </div>

        <p className="mt-6 text-sm text-mauve">
          Showing {products.length} product{products.length === 1 ? "" : "s"}
          {currentCategory ? ` in ${currentCategory.name}` : ""}
          {sp.shade ? ` · shade “${sp.shade}”` : ""}
        </p>

        {products.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<IconBag size={24} />}
              title="No products match those filters"
              text="Try adjusting the price, availability or shade filters — or clear them all to see the full Zuri collection."
              action={
                <Link href="/shop" className="btn btn-gold">
                  Clear all filters
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
