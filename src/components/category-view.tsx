import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategories, getProducts, type ProductFilters } from "@/lib/data";
import ProductCard from "@/components/product-card";
import ProductToolbar, { type FilterState } from "@/components/product-toolbar";
import Reveal from "@/components/reveal";
import { SectionHeading, Ornament, EmptyState } from "@/components/ui";
import { IconBag } from "@/components/icons";

export default async function CategoryView({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: FilterState;
}) {
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const filters: ProductFilters = {
    categorySlug: slug,
    sort: searchParams.sort,
    availability: searchParams.availability === "in" || searchParams.availability === "out" ? searchParams.availability : undefined,
    priceBand: searchParams.band,
    shade: searchParams.shade,
  };
  const products = await getProducts(filters);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={category.image ?? ""} alt={`${category.name} collection — Zuri Cosmetics`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-cream/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
            <Link href="/" className="hover:text-rose-deep">Home</Link>
            <span className="mx-2 text-gold">/</span>
            <Link href="/shop" className="hover:text-rose-deep">Shop</Link>
            <span className="mx-2 text-gold">/</span>
            <span className="text-plum">{category.name}</span>
          </nav>
          <p className="eyebrow mt-6">Zuri Cosmetics</p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5.5vw,4.2rem)] leading-none text-plum-deep">
            Zuri {category.name}
          </h1>
          <p className="mt-5 max-w-lg font-display text-xl italic text-rose-deep">“{category.tagline}”</p>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink/80">{category.description}</p>
        </div>
      </section>

      {/* Toolbar + grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="sticky top-[4.6rem] z-30 -mx-1 px-1 py-2 lg:top-[7rem]">
          <ProductToolbar
            basePath={`/${category.slug}`}
            categories={[]}
            current={searchParams}
            lockedCategory={category.slug}
            showShades={category.slug === "lipgloss"}
          />
        </div>

        <p className="mt-6 text-sm text-mauve">
          {products.length} product{products.length === 1 ? "" : "s"} in the {category.name} collection
        </p>

        {products.length === 0 ? (
          <EmptyState
            icon={<IconBag size={24} />}
            title="Nothing matches those filters"
            text="Try clearing a filter or two — gorgeous products are waiting in this collection."
            action={
              <Link href={`/${category.slug}`} className="btn btn-gold">
                Clear & view all
              </Link>
            }
          />
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Cross-sell other collections */}
      <CollectionCrossSell current={category.slug} />
    </div>
  );
}

async function CollectionCrossSell({ current }: { current: string }) {
  const categories = await getCategories();
  const others = categories.filter((c) => c.slug !== current).slice(0, 2);
  if (others.length === 0) return null;
  return (
    <section className="border-t border-blush-200/70 bg-blush-50/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading center eyebrow="Keep exploring" title="You might also love" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {others.map((c) => (
            <Reveal key={c.slug}>
              <Link href={`/${c.slug}`} className="group relative block overflow-hidden rounded-[1.6rem] shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div className="aspect-[16/8] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image ?? ""} alt={`${c.name} collection`} className="img-zoom h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-plum-deep/60 to-plum-deep/10" />
                <div className="absolute inset-0 flex flex-col justify-center gap-2 p-8">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-champagne">Collection</p>
                  <h3 className="font-display text-3xl text-ivory">Zuri {c.name}</h3>
                  <span className="mt-2 w-max text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ivory underline decoration-gold decoration-2 underline-offset-4">
                    Shop now →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Ornament className="mt-14 justify-center" />
      </div>
    </section>
  );
}
