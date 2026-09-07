import type { ProductVariant } from "@/db/schema";

/* Client-safe shared types & helpers (no database imports). */

export type SortKey = "featured" | "newest" | "best" | "price-asc" | "price-desc";

export interface ShopProduct {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  shortDescription: string | null;
  description: string | null;
  whatsIncluded: string[];
  specifications: Record<string, string>;
  ingredients: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string | null;
  featured: boolean;
  bestSeller: boolean;
  status: string;
  images: string[];
  tags: string[];
  soldUnits: number;
  createdAt: Date;
  variants: ProductVariant[];
  rating: { average: number; count: number };
}

export interface ProductFilters {
  category?: string;
  q?: string;
  min?: number;
  max?: number;
  inStock?: boolean;
  shade?: string;
  sort?: SortKey;
}

export function effectivePrice(p: ShopProduct) {
  return p.salePrice !== null ? p.salePrice : p.price;
}
