import Link from "next/link";
import type { ProductCardData } from "@/lib/data";
import { effectivePrice } from "@/lib/data";
import { Price, RatingLine, StockBadge } from "@/components/ui";
import { AddToCartButton } from "@/components/cart";
import { IconSparkles } from "@/components/icons";

export default function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const price = effectivePrice(product);
  const discount =
    product.salePriceCents && product.salePriceCents > 0
      ? Math.round(((product.priceCents - product.salePriceCents) / product.priceCents) * 100)
      : 0;
  const image = product.images?.[0] ?? "";

  return (
    <article className="group card-luxe relative flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-blush-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={`${product.name} — Zuri Cosmetics`} loading={priority ? "eager" : "lazy"} className="img-zoom h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.bestSeller && (
            <span className="rounded-full bg-plum/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-champagne backdrop-blur">
              Best Seller
            </span>
          )}
          {product.isNew && !product.bestSeller && (
            <span className="rounded-full bg-gold/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-rose-deep/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur">
              −{discount}%
            </span>
          )}
        </div>

        {product.stock > 0 && (
          <span className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-ivory/95 text-plum opacity-0 shadow-soft backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <IconSparkles size={17} />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
            {product.category.name}
          </p>
          <StockBadge stock={product.stock} className="!px-2.5 !text-[0.6rem]" />
        </div>

        <h3 className="font-display text-[1.05rem] leading-snug text-plum-deep transition-colors group-hover:text-rose-deep">
          <Link href={`/product/${product.slug}`} className="line-clamp-2">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-ink/70">{product.tagline}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <Price cents={product.priceCents} saleCents={product.salePriceCents} size="md" />
            <RatingLine avg={product.ratingAvg} count={product.reviewCount} className="mt-1 hidden sm:inline-flex" />
          </div>
          {product.stock > 0 ? (
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                image,
                priceCents: product.priceCents,
                salePriceCents: product.salePriceCents,
                stock: product.stock,
              }}
              label="Add"
              className="!px-4 !py-2.5 !text-[0.65rem]"
            />
          ) : (
            <Link href={`/product/${product.slug}`} className="btn btn-soft !px-4 !py-2.5 !text-[0.65rem]">
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
