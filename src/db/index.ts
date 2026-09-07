import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/* ------------------------------------------------------------------ */
/*  ZURI COSMETICS — DATABASE CLIENT                                   */
/*                                                                     */
/*  IMPORTANT (production/Vercel):                                     */
/*  - The pool is created LAZILY on first query, never at import       */
/*    time. A missing DATABASE_URL therefore produces a clear,         */
/*    catchable error at request time instead of crashing every        */
/*    module that merely imports "@/db".                               */
/*  - Remote databases (Neon, Supabase, RDS…) automatically get TLS.   */
/*  - DATABASE_URL is only ever read server-side and is never logged.  */
/* ------------------------------------------------------------------ */

function createPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set in this environment. " +
        "Add it under Vercel → Project → Settings → Environment Variables " +
        "(use the Neon pooled connection string) and redeploy."
    );
  }

  // Enable TLS for any non-local database host (required by Neon).
  let ssl: { rejectUnauthorized: boolean } | undefined;
  try {
    const host = new URL(databaseUrl).hostname;
    const isLocal =
      host === "localhost" || host === "127.0.0.1" || host === "::1";
    if (!isLocal) {
      ssl = { rejectUnauthorized: false };
    }
  } catch {
    // If the URL cannot be parsed, let pg surface its own descriptive error.
  }

  return new Pool({
    connectionString: databaseUrl,
    ssl,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

function createDb() {
  return drizzle(getPool());
}

type Db = ReturnType<typeof createDb>;

const globalForDb = globalThis as typeof globalThis & {
  __zuriPool?: Pool;
  __zuriDb?: Db;
};

export function getPool(): Pool {
  if (!globalForDb.__zuriPool) {
    globalForDb.__zuriPool = createPool();
  }
  return globalForDb.__zuriPool;
}

function getDb(): Db {
  if (!globalForDb.__zuriDb) {
    globalForDb.__zuriDb = drizzle(getPool());
  }
  return globalForDb.__zuriDb;
}

/**
 * Lazy proxy: existing `import { db } from "@/db"` call sites keep working
 * unchanged, but the underlying pool is only created on first actual use.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance as object, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
