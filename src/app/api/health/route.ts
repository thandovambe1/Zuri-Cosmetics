import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDatabase } from "@/db/bootstrap";

export const dynamic = "force-dynamic";

/**
 * Diagnostic health check for Zuri Cosmetics.
 * Reports availability of the runtime environment and database WITHOUT
 * exposing credentials, connection strings or any secret values.
 */
function sanitize(message: string): string {
  return message
    .replace(/postgres(ql)?:\/\/[^\s"']+/gi, "postgres://***redacted***")
    .replace(/password=[^\s&"']+/gi, "password=***");
}

export async function GET() {
  const checks = {
    databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
    databaseConnected: false,
    schemaReady: false,
    categories: 0,
    products: 0,
  };
  let error: string | null = null;

  if (!checks.databaseUrlConfigured) {
    error =
      "DATABASE_URL is not configured in this environment. " +
      "Set it in your hosting provider's environment variables and redeploy.";
  } else {
    try {
      await db.execute(sql`select 1`);
      checks.databaseConnected = true;

      await ensureDatabase();

      const result = await db.execute(sql`
        select
          (select count(*) from categories)::int as categories,
          (select count(*) from products)::int as products
      `);
      const row = (result.rows?.[0] ?? {}) as {
        categories?: number;
        products?: number;
      };
      checks.categories = Number(row.categories ?? 0);
      checks.products = Number(row.products ?? 0);
      checks.schemaReady = true;
    } catch (err) {
      error = sanitize(err instanceof Error ? err.message : "Unknown database error");
    }
  }

  const ok =
    checks.databaseUrlConfigured && checks.databaseConnected && checks.schemaReady;

  return NextResponse.json(
    {
      ok,
      service: "zuri-cosmetics",
      timestamp: new Date().toISOString(),
      checks,
      error,
    },
    { status: ok ? 200 : 503 }
  );
}
