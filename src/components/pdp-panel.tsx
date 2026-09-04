"use client";

import { useEffect, useMemo, useState } from "react";
import { zar } from "@/lib/format";
import type { ProductVariantInfo } from "@/lib/data";
import { AddToCartButton, BuyNowButton, QuantityStepper, type BuyableProduct } from "@/components/cart";
import { IconRefresh, IconShield, IconTruck } from "@/components/icons";
import { StockBadge } from "@/components/ui";

export default function PdpPanel({
  product,
  variants,
}: {
  product: BuyableProduct & { salePriceCents: number | null };
  variants: ProductVariantInfo[];
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return variants.find((v) => v.id === selectedId) ?? null;
  }, [selectedId, variants]);

  // Default to first variant (with stock if possible)
  useEffect(() => {
    const preferred = variants.find((v) => v.stock > 0) ?? variants[0] ?? null;
    setSelectedId(preferred ? preferred.id : null);
  }, [variants]);

  const variantStock = selected ? selected.stock : product.stock;
  const maxQty = Math.max(1, variantStock);
  const effectiveQty = Math.min(qty, maxQty);
  const effective = product.salePriceCents && product.salePriceCents > 0 ? product.salePriceCents : product.priceCents;

  // Buttons must respect the selected variant's stock (not the base product stock)
  const buyable = { ...product, stock: variantStock };

  const shades = variants.filter((v) => v.type === "shade" || v.type === "colour" || v.type === "Style");

  return (
    <div className="space-y-6">
      <StockBadge stock={variantStock} />
      <p className="text-sm leading-relaxed text-ink/80">{product.name && `Each Zuri ${product.name} is quality-checked before it reaches your beauty bag.`}</p>

      {shades.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-plum-deep">
            {shades[0].label || "Shade"}
            {selected && <span className="ml-2 normal-case tracking-normal text-gold-deep">— {selected.name}</span>}
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {shades.map((v) => {
              const active = v.id === selectedId;
              const hasHex = v.value && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.value);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(v.id);
                    setQty(1);
                  }}
                  aria-pressed={active}
                  aria-label={`Select ${v.name}`}
                  className={`group flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all duration-300 ${
                    active ? "border-gold bg-gold-light/50 shadow-glow" : "border-blush-200 bg-ivory hover:border-rose/60"
                  }`}
                >
                  {hasHex ? (
                    <span
                      className="h-5 w-5 rounded-full border border-white/70 shadow-inner"
                      style={{ backgroundColor: v.value ?? "#eee" }}
                    />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-blush-200 bg-blush-50" />
                  )}
                  {v.name}
                  {v.stock <= 0 && <span className="text-[0.6rem] uppercase tracking-wide text-rose-deep">sold out</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + add */}
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={effectiveQty} onChange={setQty} max={maxQty} />
        <p className="text-sm text-mauve">Max {maxQty} available</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <AddToCartButton
          product={buyable}
          variantId={selected?.id}
          variantLabel={selected ? `${selected.label}: ${selected.name}` : undefined}
          qty={effectiveQty}
          className="flex-1"
        />
        <BuyNowButton
          product={buyable}
          variantId={selected?.id}
          variantLabel={selected ? `${selected.label}: ${selected.name}` : undefined}
          qty={effectiveQty}
          className="flex-1"
        />
      </div>

      <ul className="grid gap-2.5 rounded-2xl border border-blush-100 bg-blush-50/70 p-4 text-[0.8rem] text-ink/80 sm:grid-cols-2">
        <li className="flex items-center gap-2.5">
          <IconTruck size={16} className="shrink-0 text-gold-deep" />
          Free delivery over R 1,200 · 2–5 working days
        </li>
        <li className="flex items-center gap-2.5">
          <IconShield size={16} className="shrink-0 text-gold-deep" />
          Secure checkout — details never shared
        </li>
        <li className="flex items-center gap-2.5">
          <IconRefresh size={16} className="shrink-0 text-gold-deep" />
          Order support via WhatsApp, fast
        </li>
        <li className="flex items-center gap-2.5 text-sm font-medium text-plum-deep">
          {effectiveQty} × {zar(effective)} = <span className="text-gold-deep">{zar(effective * effectiveQty)}</span>
        </li>
      </ul>
    </div>
  );
}
