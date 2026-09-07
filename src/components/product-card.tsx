"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { effectivePrice, type ShopProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Stars from "./stars";
import { IconBag } from "./icons";

export default function ProductCard({ product }: { product: ShopProduct }) {
  const { add } = useCart();
  const price = effectivePrice(product);
  const soldOut = product.stock <= 0;
  const hasShades = product.variants.length > 0;
  const isNew = Date.now() - product.createdAt.getTime() < 45 * 86400000;

  const quickAdd = () => {
    if (soldOut) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? "",
        price,
        shade: hasShades ? product.variants[0].name : null,
        stock: product.stock,
      },
      1
    );
  };

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-[1.4rem] border border-mauve/15 bg-blush shadow-soft transition-shadow duration-500 group-hover:shadow-lift"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <img
            src={product.images[0]}
            alt={`${product.name} — Zuri Cosmetics`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {soldOut && (
            <span className="rounded-full bg-ink/85 px-3 py-1 text-[0.58rem] font-medium tracking-[0.22em] text-cream uppercase">
              Sold out
            </span>
          )}
          {!soldOut && product.salePrice !== null && (
            <span className="rounded-full bg-gold px-3 py-1 text-[0.58rem] font-medium tracking-[0.22em] text-white uppercase">
              Sale
            </span>
          )}
          {!soldOut && isNew && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[0.58rem] font-medium tracking-[0.22em] text-gold-deep uppercase">
              New
            </span>
          )}
          {!soldOut && product.stock > 0 && product.stock <= 5 && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[0.58rem] font-medium tracking-[0.22em] text-[#b0565e] uppercase">
              Only {product.stock} left
            </span>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-y-[130%] lg:group-hover:translate-y-0">
          {hasShades ? (
            <span className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-3 text-[0.62rem] font-medium tracking-[0.22em] text-ink uppercase shadow-soft backdrop-blur">
              Choose shade · {product.variants.length}
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                quickAdd();
              }}
              disabled={soldOut}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-3 text-[0.62rem] font-medium tracking-[0.22em] text-ink uppercase shadow-soft backdrop-blur transition-colors hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IconBag className="h-4 w-4" />
              {soldOut ? "Sold out" : "Add to cart"}
            </button>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="eyebrow !text-[0.6rem]">{product.categoryName}</p>
        <h3 className="mt-1.5 font-display text-xl leading-snug text-ink transition-colors group-hover:text-gold-deep">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <Stars average={product.rating.average} count={product.rating.count} className="mt-2" />
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-plum">
          {product.shortDescription}
        </p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg text-ink">{formatPrice(price)}</span>
          {product.salePrice !== null && (
            <span className="text-xs text-plum/70 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
