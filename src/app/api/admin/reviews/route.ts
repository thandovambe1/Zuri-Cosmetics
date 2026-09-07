import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  const action = String(body.action);
  if (!Number.isFinite(id) || !["approve", "unapprove", "delete"].includes(action)) {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (action === "delete") {
    await db.delete(reviews).where(eq(reviews.id, id));
  } else {
    await db
      .update(reviews)
      .set({ status: action === "approve" ? "approved" : "pending" })
      .where(eq(reviews.id, id));
  }
  return NextResponse.json({ ok: true });
}
