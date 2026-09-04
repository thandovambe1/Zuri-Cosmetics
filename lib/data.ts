import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, productVariants, reviews, tutorials, orders, orderItems } from "@/db/schema";
import { seedIfEmpty } from "@/db/seed";
import { PRICE_BANDS } from "@/lib/site-config";

/* ─────────────────────────── Auto-seed guard ─────────────────────────── */

let seedPromise: Promise<boolean> | null = null;

export function ensureSeeded(): Promise<boolean> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        const res = await seedIfEmpty();
        return res.seeded;
      } catch (err) {
        // Tables may not exist yet (fresh DB) — pages handle gracefully.
        console.warn("[zuri] seed skipped:", (err as Error)?.message ?? err);
        return false;
      }
    })();
  }
  return seedPromise;
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await ensureSeeded();
    return await fn();
  } catch (err) {
    console.warn("[zuri] data fetch failed:", (err as Error)?.message ?? err);
    return fallback;
  }
}

/* ─────────────────────────── Types ─────────────────────────── */

export type CategoryInfo = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string | null;
};

export type ProductVariantInfo = {
  id: number;
  type: string;
  label: string;
  name: string;
  value: string | null;
  stock: number;
  sku: string | null;
  image: string | null;
};

export type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  priceCents: number;
  salePriceCents: number | null;
  sku: string | null;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  images: string[];
  category: { slug: string; name: string };
  ratingAvg: number | null;
  reviewCount: number;
};

export type ProductDetail = ProductCardData & {
  included: string[];
  specs: Record<string, string>;
  ingredients: string | null;
  material: string | null;
  variants: ProductVariantInfo[];
  createdAt: Date;
};

export type TutorialInfo = {
  id: number;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
  poster: string | null;
  durationLabel: string | null;
};

/* ─────────────────────────── Helpers ─────────────────────────── */

async function ratingMap(): Promise<Map<number, { avg: number; count: number }>> {
  const rows = await db
    .select({
      productId: reviews.productId,
      avg: sql<number>`round(avg(${reviews.rating})::numeric, 1)::float8`,
      count: sql<number>`count(*)::int`,
    })
    .from(reviews)
    .groupBy(reviews.productId);
  return new Map(rows.map((r) => [r.productId, { avg: Number(r.avg), count: Number(r.count) }]));
}

async function categoryMap(): Promise<Map<number, CategoryInfo>> {
  const rows = await db.select().from(categories);
  return new Map(
    rows.map((c) => [
      c.id,
      {
        id: c.id,
        name: c.name,
        slug: c.slug,
        tagline: c.tagline ?? "",
        description: c.description ?? "",
        image: c.image,
      },
    ])
  );
}

function toCard(row: typeof products.$inferSelect, cat: CategoryInfo | undefined, rating?: { avg: number; count: number }): ProductCardData {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    priceCents: row.priceCents,
    salePriceCents: row.salePriceCents,
    sku: row.sku,
    stock: row.stock,
    featured: row.featured,
    bestSeller: row.bestSeller,
    isNew: row.isNew,
    images: row.images ?? [],
    category: { slug: cat?.slug ?? "", name: cat?.name ?? "" },
    ratingAvg: rating ? rating.avg : null,
    reviewCount: rating ? rating.count : 0,
  };
}

/* ─────────────────────────── Categories ─────────────────────────── */

export async function getCategories(): Promise<CategoryInfo[]> {
  return safe(async () => {
    const rows = await db.select().from(categories).orderBy(categories.sortOrder);
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      tagline: c.tagline ?? "",
      description: c.description ?? "",
      image: c.image,
    }));
  }, []);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryInfo | null> {
  return safe(async () => {
    const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      tagline: row.tagline ?? "",
      description: row.description ?? "",
      image: row.image,
    };
  }, null);
}

/* ─────────────────────────── Products ─────────────────────────── */

export type ProductFilters = {
  categorySlug?: string;
  q?: string;
  sort?: string;
  availability?: "in" | "out";
  priceBand?: string;
  shade?: string;
};

export async function getProducts(f: ProductFilters = {}): Promise<ProductCardData[]> {
  return safe(async () => {
    const catMap = await categoryMap();
    const ratings = await ratingMap();

    // Resolve category id
    let categoryId: number | null = null;
    if (f.categorySlug) {
      const cat = await getCategoryBySlug(f.categorySlug);
      if (!cat) return [];
      categoryId = cat.id;
    }

    // Resolve shade filter → restrict to matching product ids
    let shadeIds: number[] | null = null;
    if (f.shade && f.shade.trim()) {
      const variantRows = await db
        .select({ productId: productVariants.productId })
        .from(productVariants)
        .where(sql`lower(${productVariants.name}) = lower(${f.shade.trim()})`);
      shadeIds = [...new Set(variantRows.map((v) => v.productId))];
      if (shadeIds.length === 0) return [];
    }

    const band = PRICE_BANDS.find((b) => b.id === f.priceBand);

    const conds: ReturnType<typeof and>[] = [eq(products.status, "active")];
    if (categoryId !== null) conds.push(eq(products.categoryId, categoryId));
    if (f.q?.trim()) {
      const q = `%${f.q.trim()}%`;
      conds.push(
        or(ilike(products.name, q), ilike(products.tagline, q), ilike(products.description, q)) as never
      );
    }
    if (f.availability === "in") conds.push(sql`${products.stock} > 0`);
    if (f.availability === "out") conds.push(sql`${products.stock} <= 0`);
    if (band?.min !== undefined) conds.push(sql`${products.priceCents} >= ${band.min}`);
    if (band?.max !== undefined) conds.push(sql`${products.priceCents} <= ${band.max}`);
    if (shadeIds) conds.push(inArray(products.id, shadeIds));

    const rows = await db
      .select()
      .from(products)
      .where(and(...(conds as never[])))
      .orderBy(desc(products.createdAt));

    let list = rows.map((r) => toCard(r, catMap.get(r.categoryId), ratings.get(r.id)));

    // Sorting
    switch (f.sort) {
      case "price-asc":
        list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            (rows.find((r) => r.id === b.id)?.createdAt?.getTime() ?? 0) -
            (rows.find((r) => r.id === a.id)?.createdAt?.getTime() ?? 0)
        );
        break;
      case "bestselling":
        list.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || (b.reviewCount - a.reviewCount));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, []);
}

export function effectivePrice(p: { priceCents: number; salePriceCents: number | null }): number {
  return p.salePriceCents && p.salePriceCents > 0 && p.salePriceCents < p.priceCents
    ? p.salePriceCents
    : p.priceCents;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  const all = await getProducts({ sort: "featured" });
  return all.filter((p) => p.featured || p.bestSeller).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  return safe(async () => {
    const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (!row) return null;
    const catMap = await categoryMap();
    const ratings = await ratingMap();
    const [variantRows, rating] = await Promise.all([
      db.select().from(productVariants).where(eq(productVariants.productId, row.id)).orderBy(productVariants.id),
      ratings.get(row.id),
    ]);
    const card = toCard(row, catMap.get(row.categoryId), rating);
    return {
      ...card,
      included: row.included ?? [],
      specs: row.specs ?? {},
      ingredients: row.ingredients,
      material: row.material,
      variants: variantRows.map((v) => ({
        id: v.id,
        type: v.type,
        label: v.label,
        name: v.name,
        value: v.value,
        stock: v.stock,
        sku: v.sku,
        image: v.image,
      })),
      createdAt: row.createdAt ?? new Date(),
    };
  }, null);
}

export async function getRelatedProducts(product: ProductCardData, limit = 4): Promise<ProductCardData[]> {
  const all = await getProducts();
  const sameCat = all.filter((p) => p.category.slug === product.category.slug && p.id !== product.id);
  const fallback = all.filter((p) => p.id !== product.id);
  return [...sameCat, ...fallback].slice(0, limit);
}

export async function getReviewsForProduct(productId: number) {
  return safe(async () => {
    const rows = await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
    return rows;
  }, []);
}

/* ─────────────────────────── Tutorials ─────────────────────────── */

export async function getTutorials(category?: string): Promise<TutorialInfo[]> {
  return safe(async () => {
    const rows = category
      ? await db.select().from(tutorials).where(eq(tutorials.category, category)).orderBy(tutorials.sortOrder)
      : await db.select().from(tutorials).orderBy(tutorials.sortOrder);
    return rows.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      description: t.description ?? "",
      videoUrl: t.videoUrl,
      poster: t.poster,
      durationLabel: t.durationLabel,
    }));
  }, []);
}

/* ─────────────────────────── Orders ─────────────────────────── */

export type OrderWithItems = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string;
  address2: string | null;
  city: string;
  province: string;
  postalCode: string | null;
  country: string;
  notes: string | null;
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
  items: {
    productName: string;
    variantLabel: string | null;
    unitPriceCents: number;
    quantity: number;
    image: string | null;
  }[];
};

export async function getOrderByNumberAndEmail(orderNumber: string, email: string): Promise<OrderWithItems | null> {
  return safe(async () => {
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.orderNumber, orderNumber.trim()), sql`lower(${orders.email}) = lower(${email.trim()})`))
      .limit(1);
    if (!order) return null;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return {
      orderNumber: order.orderNumber,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      address2: order.address2,
      city: order.city,
      province: order.province,
      postalCode: order.postalCode,
      country: order.country,
      notes: order.notes,
      subtotalCents: order.subtotalCents,
      deliveryCents: order.deliveryCents,
      totalCents: order.totalCents,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt ?? new Date(),
      items: items.map((i) => ({
        productName: i.productName,
        variantLabel: i.variantLabel,
        unitPriceCents: i.unitPriceCents,
        quantity: i.quantity,
        image: i.image,
      })),
    };
  }, null);
}

export async function getOrderCounts() {
  return safe(async () => {
    const all = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
    const counts: Record<string, number> = {
      total: all.length,
      pending: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const o of all) counts[o.orderStatus] = (counts[o.orderStatus] ?? 0) + 1;
    return { counts, orders: all };
  }, { counts: { total: 0 }, orders: [] as never[] });
}
