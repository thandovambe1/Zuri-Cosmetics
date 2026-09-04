import { NextResponse } from "next/server";
import { seedIfEmpty } from "@/db/seed";

export const dynamic = "force-dynamic";

/** Seeds the catalogue when the database is empty (idempotent). */
export async function POST() {
  try {
    const result = await seedIfEmpty();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error)?.message ?? "Seed failed" },
      { status: 500 }
    );
  }
}
