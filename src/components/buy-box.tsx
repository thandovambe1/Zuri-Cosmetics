"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { siteConfig, whatsappLink } from "@/lib/config";
import { formatPrice, cn } from "@/lib/utils";
import Stars from "./stars";
import {
  IconBag,
  IconCheck,
  IconMinus,
  IconPlus,
  IconTruck,
  IconWhatsApp,
} from "./icons";

export interface BuyBoxProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  image: string;
  categoryName: string;
  variants: { id: number; name: string; hex: string | null }[];
  rating: { average: number; count: number };
  sku: string | null;
}

export default function BuyBox({ product }: { product: BuyBoxProduct }) {
  const { add } = useCart();
  const router = useRouter();
  const [shade, setShade] = useState<string | null>(
    product.variants.length ? product.variants[0].name : null
  );
  const [qty, setQty] = useState(1);

  const price = product.salePrice !== null ? product.salePrice : product.price;
  const soldOut = product.stock <= 0;
  const selectedVariant = product.variants.find((v) => v.name === shade);

  const addItem = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price,
        shade,
        stock: product.stock,
      },
      qty
    );
  };

  const buyNow = () => {
    addItem();
    router.push("/checkout");
  };

  return (
    <div>
      <p className="eyebrow">{product.categoryName}</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
        {product.name}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Stars average={product.rating.average} count={product.rating.count} />
        {product.sku && (
          <span className="text-[0.62rem] tracking-[0.22em] text-plum/70 uppercase">
            SKU {product.sku}
          </span>
        )}
      </div>

      <p className="mt-6 flex items-baseline gap-3">
        <span className="font-display text-3xl text-ink">{formatPrice(price)}</span>
        {product.salePrice !== null && (
          <span className="text-base text-plum/70 line-through">
            {formatPrice(product.price)}
          </span>
        )}
        <span className="text-[0.62rem] tracking-[0.2em] text-plum uppercase">
          incl. VAT where applicable
        </span>
      </p>

      {/* Stock */}
      <p className="mt-5 flex items-center gap-2 text-xs tracking-[0.14em] uppercase">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            soldOut ? "bg-[#b0565e]" : product.stock <= 5 ? "bg-gold" : "bg-whatsapp"
          )}
        />
        <span className={soldOut ? "text-[#b0565e]" : "text-plum"}>
          {soldOut
            ? "Sold out — join the beauty list for restock news"
            : product.stock <= 5
              ? `Low stock — only ${product.stock} left`
              : `In stock — ${product.stock} available`}
        </span>
      </p>

      {/* Shades */}
      {product.variants.length > 0 && (
        <div className="mt-7">
          <p className="text-[0.66rem] font-medium tracking-[0.24em] text-cocoa uppercase">
            Shade: <span className="text-gold-deep">{shade}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setShade(v.name)}
                title={v.name}
                aria-label={`Select shade ${v.name}`}
                aria-pressed={shade === v.name}
                className={cn(
                  "group/shade flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-[0.68rem] tracking-[0.1em] transition-all duration-300",
                  shade === v.name
                    ? "border-gold bg-gold/10 text-ink shadow-soft"
                    : "border-mauve/30 bg-white/60 text-plum hover:border-gold/50"
                )}
              >
                <span
                  className="h-6 w-6 rounded-full border border-white/70 shadow-inner"
                  style={{ background: v.hex ?? "#e9d8cb" }}
                />
                {v.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.68rem] text-plum/80 italic">
            More shades are added to the Zuri collection as they arrive.
          </p>
        </div>
      )}

      {/* Qty + CTAs */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-mauve/35 bg-white/70">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="p-3.5 text-cocoa transition-colors hover:text-gold-deep disabled:opacity-40"
            disabled={qty <= 1}
          >
            <IconMinus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-display text-lg text-ink tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
            aria-label="Increase quantity"
            className="p-3.5 text-cocoa transition-colors hover:text-gold-deep disabled:opacity-40"
            disabled={qty >= product.stock}
          >
            <IconPlus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={addItem}
          disabled={soldOut}
          className="btn-lux btn-blush flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconBag className="h-4 w-4" />
          {soldOut ? "Sold out" : "Add to cart"}
        </button>
      </div>
      <button
        type="button"
        onClick={buyNow}
        disabled={soldOut}
        className="btn-lux btn-solid mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buy now
      </button>

      {/* Reassurance */}
      <div className="mt-8 space-y-3 rounded-[1.2rem] border border-gold/25 bg-white/60 p-5">
        <p className="flex items-center gap-3 text-xs text-plum">
          <IconTruck className="h-4.5 w-4.5 shrink-0 text-gold-deep" />
          {siteConfig.deliveryEstimate} · free delivery over{" "}
          {formatPrice(siteConfig.freeDeliveryOver)}
        </p>
        <p className="flex items-center gap-3 text-xs text-plum">
          <IconCheck className="h-4.5 w-4.5 shrink-0 text-gold-deep" />
          Secure checkout — card details are never stored on our servers
        </p>
        <a
          href={whatsappLink(`Hi Zuri Cosmetics! I have a question about ${product.name}${selectedVariant ? ` in ${selectedVariant.name}` : ""}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-xs text-plum transition-colors hover:text-whatsapp"
        >
          <IconWhatsApp className="h-4.5 w-4.5 shrink-0 text-whatsapp" />
          Ask us about this product on WhatsApp
        </a>
      </div>
    </div>
  );
}
