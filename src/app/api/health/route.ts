import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSeeded } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbOk = false;
  let productCount = 0;
  let categoryCount = 0;
  try {
    await db.execute(sql`select 1`);
    dbOk = true;
    await ensureSeeded();
    const [p, c] = await Promise.all([
      db.execute<{ n: number }>(sql`select count(*)::int as n from products`),
      db.execute<{ n: number }>(sql`select count(*)::int as n from categories`),
    ]);
    productCount = p.rows[0]?.n ?? 0;
    categoryCount = c.rows[0]?.n ?? 0;
  } catch {
    /* fresh DB — report status without crashing */
  }

  return NextResponse.json({
    ok: true,
    service: "zuri-cosmetics",
    database: dbOk ? "connected" : "unavailable",
    seeded: dbOk && productCount > 0 ? "yes" : "no",
    counts: { products: productCount, categories: categoryCount },
  });
}
