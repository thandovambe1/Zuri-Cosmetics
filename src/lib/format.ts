import { siteConfig } from "@/lib/site-config";

/** Format integer cents as a South African Rand string, e.g. R 1 249.00 */
export function zar(cents: number | null | undefined): string {
  const value = Math.round(Number(cents ?? 0));
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const [int, dec] = (abs / 100).toFixed(2).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${siteConfig.currencySymbol} ${grouped}.${dec}`;
}

export function randInputToCents(input: string | number | null | undefined): number {
  const cleaned = String(input ?? "").replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100);
}

export function centsToRandInput(cents: number | null | undefined): string {
  const value = Number(cents ?? 0) / 100;
  return value.toFixed(2);
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
