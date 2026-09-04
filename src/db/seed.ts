import { db } from "@/db";
import {
  categories,
  products,
  productVariants,
  reviews,
  tutorials,
} from "@/db/schema";
import { CATEGORY_SEED, PRODUCT_SEED, REVIEW_SEED, TUTORIAL_SEED } from "@/db/seed-data";
import { slugify } from "@/lib/format";

/**
 * Seeds the Zuri Cosmetics catalogue only when the database is empty.
 * Idempotent & safe to call on every server start.
 */
export async function seedIfEmpty(): Promise<{ seeded: boolean; counts: Record<string, number> }> {
  const catRows = await db.select({ id: categories.id }).from(categories).limit(1);

  if (catRows.length > 0) {
    const [p, t, r, v, c] = await Promise.all([
      db.select({ id: products.id }).from(products),
      db.select({ id: tutorials.id }).from(tutorials),
      db.select({ id: reviews.id }).from(reviews),
      db.select({ id: productVariants.id }).from(productVariants),
      db.select({ id: categories.id }).from(categories),
    ]);
    return {
      seeded: false,
      counts: { products: p.length, tutorials: t.length, reviews: r.length, variants: v.length, categories: c.length },
    };
  }

  const catMap = new Map<string, number>();
  for (const cat of CATEGORY_SEED) {
    const [row] = await db
      .insert(categories)
      .values({ ...cat, sortOrder: cat.sortOrder })
      .returning({ id: categories.id, slug: categories.slug });
    catMap.set(row.slug, row.id);
  }

  const reviewTargets = new Map<string, number>();
  for (const p of PRODUCT_SEED) {
    const categoryId = catMap.get(p.category);
    if (!categoryId) continue;
    const base = {
      categoryId,
      name: p.name,
      slug: slugify(p.name),
      tagline: p.tagline ?? "",
      description: p.description ?? "",
      priceCents: p.priceCents,
      salePriceCents: p.salePriceCents ?? null,
      sku: p.sku ?? null,
      stock: p.stock,
      status: "active" as const,
      featured: p.featured ?? false,
      bestSeller: p.bestSeller ?? false,
      isNew: p.isNew ?? false,
      images: p.images ?? [],
      included: p.included ?? [],
      specs: p.specs ?? {},
      ingredients: p.ingredients ?? null,
      material: null,
    };
    const [row] = await db.insert(products).values(base).returning({ id: products.id, slug: products.slug });
    reviewTargets.set(row.slug, row.id);

    if (p.variants?.length) {
      await db.insert(productVariants).values(
        p.variants.map((v, i) => ({
          productId: row.id,
          type: "shade",
          label: v.label,
          name: v.name,
          value: v.value,
          stock: v.stock ?? p.stock,
          sku: v.sku ?? `${p.sku}-${i}`,
          isDefault: i === 0,
        }))
      );
    }
  }

  for (const t of TUTORIAL_SEED) {
    await db.insert(tutorials).values(t);
  }

  for (const r of REVIEW_SEED) {
    const productId = reviewTargets.get(r.productSlug);
    if (!productId) continue;
    await db.insert(reviews).values({
      productId,
      name: r.name,
      rating: r.rating,
      title: r.title,
      content: r.content,
      isSample: true,
    });
  }

  const counts = {
    products: PRODUCT_SEED.length,
    categories: CATEGORY_SEED.length,
    tutorials: TUTORIAL_SEED.length,
    reviews: REVIEW_SEED.length,
  };
  return { seeded: true, counts };
}
