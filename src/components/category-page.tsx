import type { Metadata } from "next";
import { Suspense } from "react";
import FilterBar from "@/components/filter-bar";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { LotusMark } from "@/components/icons";
import { listProducts, type SortKey } from "@/lib/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  category?: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  title: string;
  subtitle: string;
  banner: string;
  eyebrow: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export async function CategoryPage({
  category,
  searchParams,
  title,
  subtitle,
  banner,
  eyebrow,
  description,
  metaTitle,
  metaDescription,
}: Props) {
  const sp = await searchParams;
  const str = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : (v ?? "");
  };

  const filters = {
    category,
    q: str("q") || undefined,
    min: str("min") ? Number(str("min")) : undefined,
    max: str("max") ? Number(str("max")) : undefined,
    inStock: str("stock") === "1",
    shade: str("shade") || undefined,
    sort: (str("sort") as SortKey) || "featured",
  };

  const products = await listProducts(filters);

  return (
    <>
      {/* Category hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={banner}
            alt=""
            aria-hidden
            className="h-full w-full animate-kenburns object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/85 to-cream" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 text-center sm:px-6 lg:px-10 lg:pt-24 lg:pb-16">
          <p className="eyebrow flex items-center justify-center gap-3">
            <LotusMark className="h-3 w-6 text-gold/80" />
            {eyebrow}
            <LotusMark className="h-3 w-6 text-gold/80" />
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-display text-xl text-plum italic sm:text-2xl">
            “{subtitle}”
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-plum">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
          <Suspense fallback={null}>
            <FilterBar lockedCategory={category} resultCount={products.length} />
          </Suspense>
          <div>
            {products.length === 0 ? (
              <div className="rounded-[1.6rem] border border-dashed border-mauve/40 bg-white/50 px-8 py-20 text-center">
                <LotusMark className="mx-auto h-5 w-10 text-gold/70" />
                <p className="mt-4 font-display text-3xl text-ink">Nothing matches — yet</p>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-plum">
                  Try widening your filters, or explore the full Zuri Cosmetics collection.
                </p>
                <Link href="/shop" className="btn-lux btn-blush mt-7">
                  Shop all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 xl:grid-cols-3 xl:gap-x-7">
                {products.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 90}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function categoryMetadata(title: string, description: string): Metadata {
  return { title, description };
}
