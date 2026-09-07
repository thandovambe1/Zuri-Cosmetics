import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDatabase } from "@/db/bootstrap";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "refunded", "failed"];

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  await ensureDatabase();
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "Invalid order id." }, { status: 400 });
  }

  const patch: Partial<typeof orders.$inferInsert> = {};
  if (body.status !== undefined) {
    if (!ORDER_STATUSES.includes(String(body.status))) {
      return NextResponse.json({ ok: false, message: "Invalid status." }, { status: 400 });
    }
    patch.status = String(body.status);
  }
  if (body.paymentStatus !== undefined) {
    if (!PAYMENT_STATUSES.includes(String(body.paymentStatus))) {
      return NextResponse.json({ ok: false, message: "Invalid payment status." }, { status: 400 });
    }
    patch.paymentStatus = String(body.paymentStatus);
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, message: "Nothing to update." }, { status: 400 });
  }

  await db.update(orders).set(patch).where(eq(orders.id, id));
  return NextResponse.json({ ok: true });
}
