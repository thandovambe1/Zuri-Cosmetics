import { db } from "@/db";
import {
  categories,
  orderItems,
  orders,
  productVariants,
  products,
  reviews,
  tutorials,
  faqs,
  type Category,
  type ProductVariant,
} from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { ensureDatabase } from "@/db/bootstrap";
import { toNumber } from "./utils";
import { effectivePrice, type ShopProduct, type SortKey } from "./types";

export { effectivePrice } from "./types";
export type { ProductFilters, ShopProduct, SortKey } from "./types";

function mapProduct(
  p: typeof products.$inferSelect,
  category: Category | undefined,
  variants: ProductVariant[],
  rating: { average: number; count: number }
): ShopProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryId: p.categoryId,
    categorySlug: category?.slug ?? "",
    categoryName: category?.name ?? "",
    shortDescription: p.shortDescription,
    description: p.description,
    whatsIncluded: p.whatsIncluded ?? [],
    specifications: p.specifications ?? {},
    ingredients: p.ingredients,
    price: toNumber(p.price),
    salePrice: p.salePrice === null ? null : toNumber(p.salePrice),
    stock: p.stock,
    sku: p.sku,
    featured: p.featured,
    bestSeller: p.bestSeller,
    status: p.status,
    images: p.images ?? [],
    tags: p.tags ?? [],
    soldUnits: p.soldUnits,
    createdAt: p.createdAt,
    variants,
    rating,
  };
}

async function loadAll(includeDrafts = false) {
  await ensureDatabase();
  const [allProducts, allCategories, allVariants, allReviews] = await Promise.all([
    db.select().from(products),
    db.select().from(categories),
    db.select().from(productVariants).orderBy(asc(productVariants.sortOrder)),
    db.select().from(reviews),
  ]);

  const catById = new Map(allCategories.map((c) => [c.id, c]));
  const variantsByProduct = new Map<number, ProductVariant[]>();
  for (const v of allVariants) {
    const list = variantsByProduct.get(v.productId) ?? [];
    list.push(v);
    variantsByProduct.set(v.productId, list);
  }
  const ratingsByProduct = new Map<number, { average: number; count: number }>();
  const approved = allReviews.filter((r) => r.status === "approved");
  for (const r of approved) {
    const current = ratingsByProduct.get(r.productId) ?? { average: 0, count: 0 };
    current.average += r.rating;
    current.count += 1;
    ratingsByProduct.set(r.productId, current);
  }
  for (const [key, value] of ratingsByProduct) {
    ratingsByProduct.set(key, {
      average: value.average / value.count,
      count: value.count,
    });
  }

  const mapped = allProducts
    .filter((p) => includeDrafts || p.status === "active")
    .map((p) =>
      mapProduct(
        p,
        catById.get(p.categoryId),
        variantsByProduct.get(p.id) ?? [],
        ratingsByProduct.get(p.id) ?? { average: 0, count: 0 }
      )
    );

  return { mapped, allReviews, allCategories };
}

export async function listProducts(
  filters: import("./types").ProductFilters = {}
): Promise<ShopProduct[]> {
  const { mapped } = await loadAll();
  let result = mapped;

  if (filters.category) {
    result = result.filter((p) => p.categorySlug === filters.category);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter((p) =>
      [p.name, p.shortDescription ?? "", p.description ?? "", p.categoryName, p.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }
  if (typeof filters.min === "number" && !Number.isNaN(filters.min)) {
    result = result.filter((p) => effectivePrice(p) >= filters.min!);
  }
  if (typeof filters.max === "number" && !Number.isNaN(filters.max)) {
    result = result.filter((p) => effectivePrice(p) <= filters.max!);
  }
  if (filters.inStock) {
    result = result.filter((p) => p.stock > 0);
  }
  if (filters.shade) {
    const s = filters.shade.toLowerCase();
    result = result.filter((p) =>
      p.variants.some((v) => v.name.toLowerCase().includes(s))
    );
  }

  const sort = filters.sort ?? "featured";
  const sorted = [...result];
  switch (sort) {
    case "newest":
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "best":
      sorted.sort((a, b) => b.soldUnits - a.soldUnits);
      break;
    case "price-asc":
      sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case "price-desc":
      sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    default:
      sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) || b.soldUnits - a.soldUnits
      );
  }
  return sorted;
}

export async function getCategories() {
  await ensureDatabase();
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getProductBySlug(slug: string) {
  const { mapped } = await loadAll();
  return mapped.find((p) => p.slug === slug);
}

export async function getRelated(product: ShopProduct, limit = 4) {
  const { mapped } = await loadAll();
  return mapped
    .filter((p) => p.id !== product.id)
    .map((p) => {
      const shared = p.tags.filter((t) => product.tags.includes(t)).length;
      const sameCategory = p.categoryId === product.categoryId ? 2 : 0;
      return { product: p, score: shared + sameCategory };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.product.soldUnits - a.product.soldUnits)
    .slice(0, limit)
    .map((entry) => entry.product);
}

export async function getReviews(productId: number) {
  await ensureDatabase();
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
  return rows.filter((r) => r.status === "approved");
}

export interface HomeReview {
  id: number;
  authorName: string;
  avatar: string | null;
  location: string | null;
  rating: number;
  title: string | null;
  body: string;
  isSample: boolean;
  productName: string;
  productSlug: string;
  createdAt: Date;
}

export async function getHomeReviews(limit = 6): Promise<HomeReview[]> {
  const { mapped, allReviews } = await loadAll();
  const productById = new Map(mapped.map((p) => [p.id, p]));
  return allReviews
    .filter((r) => r.status === "approved" && productById.has(r.productId))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
    .map((r) => {
      const p = productById.get(r.productId)!;
      return {
        id: r.id,
        authorName: r.authorName,
        avatar: r.avatar,
        location: r.location,
        rating: r.rating,
        title: r.title,
        body: r.body,
        isSample: r.isSample,
        productName: p.name,
        productSlug: p.slug,
        createdAt: r.createdAt,
      };
    });
}

export async function getTutorials() {
  await ensureDatabase();
  return db.select().from(tutorials).orderBy(asc(tutorials.sortOrder));
}

export async function getFaqs() {
  await ensureDatabase();
  return db.select().from(faqs).orderBy(asc(faqs.sortOrder));
}

export async function getOrderByNumber(orderNumber: string) {
  await ensureDatabase();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function getAllOrders() {
  await ensureDatabase();
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getAllProductsAdmin() {
  const { mapped } = await loadAll(true);
  return mapped;
}
