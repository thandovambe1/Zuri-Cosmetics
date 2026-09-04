import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { EmptyState } from "@/components/ui";
import { IconSearch } from "@/components/icons";

export const metadata: Metadata = {
  title: "Search — Find Your Zuri Favourite",
  description: "Search the Zuri Cosmetics catalogue for lashes, cluster lashes, strip lashes, lash glue, press-on nails, nail care, lip gloss and lip liner.",
};

const SUGGESTIONS = [
  "Lashes",
  "Cluster lashes",
  "Strip lashes",
  "Lash glue",
  "Lash remover",
  "Press-on nails",
  "Nail care",
  "Lip gloss",
  "Lip liner",
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const products = query ? await getProducts({ q: query, sort: "featured" }) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
        <Link href="/" className="hover:text-rose-deep">Home</Link>
        <span className="mx-2 text-gold">/</span>
        <span className="text-plum">Search</span>
      </nav>

      <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] text-plum-deep">
        {query ? (
          <>
            Results for <em className="text-gold">“{query}”</em>
          </>
        ) : (
          "Search Zuri Cosmetics"
        )}
      </h1>
      <p className="mt-3 max-w-xl text-[0.95rem] text-ink/75">
        Find your perfect lashes, press-on nails, nail care and lip essentials.
      </p>

      {query && (
        <p className="mt-8 text-sm text-mauve">
          {products.length} result{products.length === 1 ? "" : "s"} found
        </p>
      )}

      {!query ? (
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Popular searches</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {SUGGESTIONS.map((s) => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full border border-blush-200 bg-ivory px-4 py-2 text-sm text-plum transition hover:border-gold hover:text-gold-deep">
                {s}
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <EmptyState
              icon={<IconSearch size={24} />}
              title="Type above to search"
              text="Search for lashes, cluster lashes, strip lashes, lash glue, lash remover, press-on nails, nail care, lip gloss, lip liner and more."
            />
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<IconSearch size={24} />}
            title="Nothing found — yet"
            text={`We couldn't find anything for “${query}”. Try a different word, or explore the full Zuri collection.`}
            action={
              <Link href="/shop" className="btn btn-gold">
                Shop Zuri Cosmetics
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
