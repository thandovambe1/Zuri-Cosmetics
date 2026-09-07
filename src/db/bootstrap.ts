import { sql } from "drizzle-orm";
import { db } from "./index";
import { categories } from "./schema";
import { seedDatabase } from "./seed-data";

/* ------------------------------------------------------------------ */
/*  ZURI COSMETICS — RUNTIME DATABASE BOOTSTRAP                        */
/*                                                                     */
/*  On Vercel the build never runs migrations, so a fresh Neon         */
/*  database has NO tables. This module makes the app self-healing:    */
/*                                                                     */
/*  1. Creates the schema idempotently (CREATE TABLE IF NOT EXISTS).   */
/*  2. Applies additive column migrations (ADD COLUMN IF NOT EXISTS).  */
/*  3. Seeds the catalogue if — and only if — the store is empty.      */
/*                                                                     */
/*  The bootstrap runs at most once per server instance (cached        */
/*  promise) and retries on the next request if it failed, so a        */
/*  transient outage never permanently poisons the instance.           */
/* ------------------------------------------------------------------ */

const DDL = `
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  image text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category_id integer NOT NULL,
  short_description text,
  description text,
  whats_included jsonb NOT NULL DEFAULT '[]'::jsonb,
  specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  ingredients text,
  price numeric(10,2) NOT NULL,
  sale_price numeric(10,2),
  stock integer NOT NULL DEFAULT 0,
  sku text,
  featured boolean NOT NULL DEFAULT false,
  best_seller boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  sold_units integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  hex text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  id serial PRIMARY KEY,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  avatar text,
  location text,
  rating integer NOT NULL,
  title text,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  is_sample boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  order_number text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_provider text,
  status text NOT NULL DEFAULT 'Pending',
  notes text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id serial PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer,
  name text NOT NULL,
  slug text,
  shade text,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  image text
);

CREATE TABLE IF NOT EXISTS subscribers (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tutorials (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL,
  description text,
  video_url text NOT NULL,
  poster_url text,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  duration_label text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS faqs (
  id serial PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS avatar text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS location text;
`;

const globalForBootstrap = globalThis as typeof globalThis & {
  __zuriBootstrap?: Promise<void>;
};

async function bootstrap(): Promise<void> {
  // 1. Idempotent schema creation / additive migration.
  await db.execute(sql.raw(DDL));

  // 2. Seed only when the store is completely empty (fresh database).
  const existing = await db.select({ id: categories.id }).from(categories).limit(1);
  if (existing.length === 0) {
    console.log("[zuri] Empty database detected — seeding Zuri Cosmetics catalogue…");
    const counts = await seedDatabase({ reset: false });
    console.log(
      `[zuri] Seed complete: ${counts.products} products, ${counts.categories} categories, ` +
        `${counts.tutorials} tutorials, ${counts.faqs} FAQs.`
    );
  }
}

/**
 * Ensure schema + seed exist before any query runs.
 * Cached per server instance; safe to await from many callers at once.
 * On failure the cache is cleared so the next request retries.
 */
export function ensureDatabase(): Promise<void> {
  if (!globalForBootstrap.__zuriBootstrap) {
    globalForBootstrap.__zuriBootstrap = bootstrap().catch((error) => {
      globalForBootstrap.__zuriBootstrap = undefined;
      console.error(
        "[zuri] Database bootstrap failed:",
        error instanceof Error ? error.message : error
      );
      throw error;
    });
  }
  return globalForBootstrap.__zuriBootstrap;
}
