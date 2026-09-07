import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { IconSearch, LotusMark } from "@/components/icons";
import { listProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Zuri Cosmetics collection — lashes, nails, lip gloss and more.",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

const POPULAR = [
  "Cluster lashes",
  "Strip lashes",
  "Lash glue",
  "Lash remover",
  "Press-on nails",
  "Nail care",
  "Cuticle oil",
  "Lip gloss",
  "Lip liner",
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = sp.q;
  const q = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  const results = q.trim() ? await listProducts({ q: q.trim() }) : [];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow flex items-center justify-center gap-3">
          <LotusMark className="h-3 w-6 text-gold/80" />
          Site-wide search
          <LotusMark className="h-3 w-6 text-gold/80" />
        </p>
        <h1 className="mt-5 font-display text-5xl text-ink sm:text-6xl">
          {q ? (
            <>
              Results for <em className="gold-text italic">“{q}”</em>
            </>
          ) : (
            <>
              Search <em className="gold-text italic">Zuri Cosmetics</em>
            </>
          )}
        </h1>
        <form action="/search" className="mt-8" role="search">
          <div className="flex items-center gap-3 rounded-full border border-gold/40 bg-white/80 py-2 pr-2 pl-5 shadow-soft focus-within:border-gold">
            <IconSearch className="h-5 w-5 shrink-0 text-gold-deep" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Lashes, press-on nails, lip gloss, liner…"
              className="w-full bg-transparent py-2.5 font-display text-lg text-ink outline-none placeholder:text-plum/50"
              aria-label="Search products"
            />
            <button type="submit" className="btn-lux btn-blush !px-6 !py-3">
              Search
            </button>
          </div>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {POPULAR.map((p) => (
            <Link
              key={p}
              href={`/search?q=${encodeURIComponent(p)}`}
              className="rounded-full border border-mauve/30 bg-white/60 px-3.5 py-1.5 text-[0.66rem] tracking-[0.14em] text-plum uppercase transition-colors hover:border-gold/60 hover:text-gold-deep"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-14">
        {q.trim() === "" ? null : results.length === 0 ? (
          <div className="mx-auto max-w-md rounded-[1.6rem] border border-dashed border-mauve/40 bg-white/50 px-8 py-16 text-center">
            <LotusMark className="mx-auto h-5 w-10 text-gold/70" />
            <p className="mt-4 font-display text-3xl text-ink">No matches for “{q}”</p>
            <p className="mt-3 text-sm leading-relaxed text-plum">
              Nothing in the collection matches that just yet — try “lashes”, “nails” or
              “gloss”, or browse everything we make.
            </p>
            <Link href="/shop" className="btn-lux btn-blush mt-7">
              Shop Zuri Cosmetics
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[0.68rem] tracking-[0.22em] text-plum uppercase">
              {results.length} {results.length === 1 ? "product" : "products"} found
            </p>
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
              {results.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
