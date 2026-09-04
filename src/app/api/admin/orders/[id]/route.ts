import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";
import { ORDER_STATUSES } from "@/lib/site-config";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const store = await cookies();
  if (!isValidAdminToken(store.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const orderId = Number(id);
  const form = await req.formData().catch(() => new FormData());
  const orderStatus = String(form.get("orderStatus") ?? "");

  if (!Number.isInteger(orderId) || !ORDER_STATUSES.includes(orderStatus as (typeof ORDER_STATUSES)[number])) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await db.update(orders).set({ orderStatus }).where(eq(orders.id, orderId));

  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/admin", url.origin));
}
