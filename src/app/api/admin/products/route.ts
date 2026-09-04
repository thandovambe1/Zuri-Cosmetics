import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";
import { randInputToCents, slugify } from "@/lib/format";

export async function POST(req: Request) {
  const store = await cookies();
  if (!isValidAdminToken(store.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const url = new URL(req.url);
  const form = await req.formData().catch(() => new FormData());

  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  const categoryId = Number(form.get("categoryId"));
  const priceCents = randInputToCents(String(form.get("price") ?? ""));
  const saleRaw = String(form.get("sale") ?? "").trim();
  const salePriceCents = saleRaw ? randInputToCents(saleRaw) : null;
  const stock = Math.max(0, Math.min(99999, Math.round(Number(form.get("stock") ?? 0)) || 0));

  if (!name || !Number.isInteger(categoryId) || priceCents <= 0) {
    return NextResponse.redirect(new URL("/admin/products?error=invalid", url.origin));
  }

  let slug = slugify(name) || "product";
  let exists = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
  let counter = 2;
  while (exists.length > 0) {
    slug = `${slugify(name) || "product"}-${counter++}`;
    exists = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
  }

  const flag = (key: string) => form.get(key) === "1";

  await db.insert(products).values({
    categoryId,
    name,
    slug,
    tagline: String(form.get("tagline") ?? "").trim().slice(0, 200) || null,
    description: String(form.get("description") ?? "").trim().slice(0, 4000) || null,
    priceCents,
    salePriceCents,
    sku: String(form.get("sku") ?? "").trim().slice(0, 60) || null,
    stock,
    status: form.get("status") === "draft" ? "draft" : "active",
    featured: flag("featured"),
    bestSeller: flag("bestSeller"),
    isNew: flag("isNew"),
    images: String(form.get("images") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6),
    included: String(form.get("included") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 12),
    specs: {},
    ingredients: null,
    material: null,
  });

  return NextResponse.redirect(new URL("/admin/products?created=1", url.origin));
}
