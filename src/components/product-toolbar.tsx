"use client";

import { useRouter } from "next/navigation";
import { PRICE_BANDS, SORT_OPTIONS } from "@/lib/site-config";
import type { CategoryInfo } from "@/lib/data";

const SHADE_OPTIONS = ["Clear", "Nude", "Pink", "Mauve", "Brown", "Rose", "Champagne", "Berry"];

export type FilterState = {
  category?: string;
  band?: string;
  availability?: string;
  shade?: string;
  sort?: string;
};

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mauve">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer rounded-full border border-blush-200 bg-ivory px-4 py-2.5 text-sm text-plum transition focus:border-gold focus:outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ProductToolbar({
  basePath,
  categories,
  current,
  lockedCategory,
  showShades = true,
}: {
  basePath: string;
  categories: CategoryInfo[];
  current: FilterState;
  lockedCategory?: string;
  showShades?: boolean;
}) {
  const router = useRouter();

  function update(next: FilterState) {
    const params = new URLSearchParams();
    if (next.category && next.category !== "all") params.set("category", next.category);
    if (next.band && next.band !== "any") params.set("band", next.band);
    if (next.availability && next.availability !== "all") params.set("availability", next.availability);
    if (next.shade) params.set("shade", next.shade);
    if (next.sort && next.sort !== "featured") params.set("sort", next.sort);
    const qs = params.toString();
    router.replace(qs ? `${basePath}?${qs}` : basePath);
  }

  const set = (patch: Partial<FilterState>) => update({ ...current, ...patch });

  const catOptions = [
    { value: "all", label: "All collections" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const categoryValue = current.category && current.category !== "all" ? current.category : "all";

  return (
    <div className="card-luxe flex flex-wrap items-end gap-x-5 gap-y-3 bg-ivory/90 p-4 backdrop-blur sm:p-5">
      {!lockedCategory && (
        <Select
          label="Category"
          value={categoryValue}
          onChange={(v) => set({ category: v })}
          options={catOptions}
        />
      )}
      <Select
        label="Price"
        value={current.band ?? "any"}
        onChange={(v) => set({ band: v })}
        options={PRICE_BANDS.map((b) => ({ value: b.id, label: b.label }))}
      />
      <Select
        label="Availability"
        value={current.availability ?? "all"}
        onChange={(v) => set({ availability: v })}
        options={[
          { value: "all", label: "All availability" },
          { value: "in", label: "In stock" },
          { value: "out", label: "Out of stock" },
        ]}
      />
      {showShades && (
        <Select
          label="Shade"
          value={current.shade ?? ""}
          onChange={(v) => set({ shade: v })}
          placeholder="All shades"
          options={SHADE_OPTIONS.map((s) => ({ value: s, label: s }))}
        />
      )}
      <Select
        label="Sort by"
        value={current.sort ?? "featured"}
        onChange={(v) => set({ sort: v })}
        options={SORT_OPTIONS.map((s) => ({ value: s.id, label: s.label }))}
      />
      {(current.category || current.band || current.availability || current.shade || (current.sort && current.sort !== "featured")) && (
        <button
          type="button"
          onClick={() => update({})}
          className="btn btn-soft !px-5 !py-2.5 !text-[0.65rem]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
