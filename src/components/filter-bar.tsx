"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SortKey } from "@/lib/types";
import { IconClose, IconSearch } from "./icons";

const CATEGORIES = [
  { slug: "", label: "All products" },
  { slug: "lashes", label: "Lashes" },
  { slug: "nails", label: "Nails" },
  { slug: "lipgloss", label: "LipGloss" },
];

const SHADES = ["", "Clear", "Nude", "Pink", "Mauve", "Brown", "Berry", "Lavender", "Champagne"];

const PRICE_RANGES = [
  { label: "Any price", min: "", max: "" },
  { label: "Under R100", min: "", max: "100" },
  { label: "R100 – R200", min: "100", max: "200" },
  { label: "R200 – R300", min: "200", max: "300" },
  { label: "Over R300", min: "300", max: "" },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "best", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function FilterBar({
  lockedCategory,
  resultCount,
}: {
  lockedCategory?: string;
  resultCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const current = {
    category: lockedCategory ?? params.get("category") ?? "",
    min: params.get("min") ?? "",
    max: params.get("max") ?? "",
    stock: params.get("stock") === "1",
    shade: params.get("shade") ?? "",
    sort: (params.get("sort") as SortKey) || "featured",
    q: params.get("q") ?? "",
  };

  const apply = (patch: Record<string, string>) => {
    const next = new URLSearchParams();
    const merged: Record<string, string> = {
      category: current.category,
      min: current.min,
      max: current.max,
      stock: current.stock ? "1" : "",
      shade: current.shade,
      sort: current.sort === "featured" ? "" : current.sort,
      q: current.q,
      ...patch,
    };
    if (lockedCategory) delete merged.category;
    Object.entries(merged).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });
    const qs = next.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  };

  const activeCount =
    (current.category ? 1 : 0) +
    (current.min || current.max ? 1 : 0) +
    (current.stock ? 1 : 0) +
    (current.shade ? 1 : 0);

  const panel = (
    <div className="space-y-7">
      {!lockedCategory && (
        <fieldset>
          <legend className="eyebrow mb-3">Category</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug || "all"}
                type="button"
                onClick={() => apply({ category: c.slug })}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.66rem] font-medium tracking-[0.18em] uppercase transition-all",
                  current.category === c.slug
                    ? "border-gold bg-gold text-white shadow-soft"
                    : "border-mauve/30 bg-white/60 text-plum hover:border-gold/60 hover:text-gold-deep"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="eyebrow mb-3">Price</legend>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((r) => {
            const active = current.min === r.min && current.max === r.max;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => apply({ min: r.min, max: r.max })}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.66rem] font-medium tracking-[0.18em] uppercase transition-all",
                  active
                    ? "border-gold bg-gold text-white shadow-soft"
                    : "border-mauve/30 bg-white/60 text-plum hover:border-gold/60 hover:text-gold-deep"
                )}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3">Shade / Colour</legend>
        <select
          value={current.shade}
          onChange={(e) => apply({ shade: e.target.value })}
          className="field-lux"
          aria-label="Filter by shade or colour"
        >
          {SHADES.map((s) => (
            <option key={s || "any"} value={s}>
              {s || "All shades"}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3">Availability</legend>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-cocoa">
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
              current.stock ? "border-gold bg-gold text-white" : "border-mauve/40 bg-white"
            )}
          >
            {current.stock && (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={current.stock}
            onChange={(e) => apply({ stock: e.target.checked ? "1" : "" })}
            className="sr-only"
          />
          In stock only
        </label>
      </fieldset>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() =>
            apply({ category: lockedCategory ?? "", min: "", max: "", stock: "", shade: "" })
          }
          className="flex items-center gap-2 text-[0.66rem] font-medium tracking-[0.2em] text-[#b0565e] uppercase underline-offset-4 hover:underline"
        >
          <IconClose className="h-3.5 w-3.5" />
          Clear filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-lux btn-outline !px-5 !py-2.5 lg:hidden"
        >
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>
        <p className="text-[0.68rem] tracking-[0.22em] text-plum uppercase">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </p>
        <label className="flex items-center gap-3">
          <span className="hidden text-[0.66rem] tracking-[0.2em] text-plum uppercase sm:block">
            Sort
          </span>
          <select
            value={current.sort}
            onChange={(e) => apply({ sort: e.target.value === "featured" ? "" : e.target.value })}
            className="field-lux !w-auto !py-2.5 text-[0.72rem] tracking-[0.12em] uppercase"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 hidden lg:block">{panel}</div>

      {/* Mobile filter drawer */}
      <div
        className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-400",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-cream px-7 py-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="mb-7 flex items-center justify-between">
            <p className="flex items-center gap-2 font-display text-2xl text-ink">
              <IconSearch className="h-4 w-4 text-gold-deep" />
              Refine
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="rounded-full p-2 text-cocoa hover:bg-blush"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>
          {panel}
          <button type="button" onClick={() => setOpen(false)} className="btn-lux btn-blush mt-9 w-full">
            Show {resultCount} results
          </button>
        </div>
      </div>
    </div>
  );
}
