import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDatabase } from "@/db/bootstrap";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  await ensureDatabase();
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "Invalid product id." }, { status: 400 });
  }

  const patch: Partial<typeof products.$inferInsert> = {};
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ ok: false, message: "Invalid price." }, { status: 400 });
    }
    patch.price = price.toFixed(2);
  }
  if (body.salePrice !== undefined) {
    patch.salePrice =
      body.salePrice === null || body.salePrice === ""
        ? null
        : Number(body.salePrice).toFixed(2);
  }
  if (body.stock !== undefined) {
    const stock = Math.max(0, Math.floor(Number(body.stock)));
    if (!Number.isFinite(stock)) {
      return NextResponse.json({ ok: false, message: "Invalid stock." }, { status: 400 });
    }
    patch.stock = stock;
  }
  if (body.status !== undefined) {
    patch.status = body.status === "draft" ? "draft" : "active";
  }
  if (body.featured !== undefined) {
    patch.featured = Boolean(body.featured);
  }
  if (body.bestSeller !== undefined) {
    patch.bestSeller = Boolean(body.bestSeller);
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, message: "Nothing to update." }, { status: 400 });
  }

  await db.update(products).set(patch).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}
