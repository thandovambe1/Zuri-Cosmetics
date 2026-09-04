import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";
import { randInputToCents } from "@/lib/format";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const store = await cookies();
  if (!isValidAdminToken(store.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return NextResponse.json({ ok: false }, { status: 400 });

  const url = new URL(req.url);
  const form = await req.formData().catch(() => new FormData());
  const action = String(form.get("action") ?? "update");

  if (action === "delete") {
    await db.delete(products).where(eq(products.id, productId));
    return NextResponse.redirect(new URL("/admin/products?deleted=1", url.origin));
  }

  const priceCents = randInputToCents(String(form.get("price") ?? ""));
  const saleRaw = String(form.get("sale") ?? "").trim();
  const salePriceCents = saleRaw ? randInputToCents(saleRaw) : null;
  const stock = Math.max(0, Math.min(99999, Math.round(Number(form.get("stock") ?? 0)) || 0));
  const status = form.get("status") === "draft" ? "draft" : "active";

  await db
    .update(products)
    .set({
      priceCents: priceCents > 0 ? priceCents : undefined,
      salePriceCents,
      stock,
      status,
      featured: form.get("featured") === "1",
      bestSeller: form.get("bestSeller") === "1",
      isNew: form.get("isNew") === "1",
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  return NextResponse.redirect(new URL("/admin/products?saved=1", url.origin));
}
