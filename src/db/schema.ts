import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    tagline: text("tagline"),
    description: text("description"),
    image: text("image"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("categories_slug_idx").on(t.slug)]
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    tagline: text("tagline"),
    description: text("description"),
    priceCents: integer("price_cents").notNull().default(0),
    salePriceCents: integer("sale_price_cents"),
    sku: text("sku"),
    stock: integer("stock").notNull().default(0),
    status: text("status").notNull().default("active"), // active | draft
    featured: boolean("featured").notNull().default(false),
    bestSeller: boolean("best_seller").notNull().default(false),
    isNew: boolean("is_new").notNull().default(false),
    images: text("images").array().notNull().default([]),
    included: text("included").array().notNull().default([]),
    specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),
    ingredients: text("ingredients"),
    material: text("material"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("products_slug_idx").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_status_idx").on(t.status),
  ]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("shade"), // shade | colour | size
    label: text("label").notNull(), // e.g. "Shade: Nude"
    name: text("name").notNull(), // e.g. "Nude"
    value: text("value"), // hex swatch e.g. "#D9A98C"
    stock: integer("stock").notNull().default(0),
    sku: text("sku"),
    image: text("image"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("variants_product_idx").on(t.productId)]
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    rating: integer("rating").notNull(),
    title: text("title"),
    content: text("content"),
    isSample: boolean("is_sample").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("reviews_product_idx").on(t.productId)]
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    address: text("address").notNull(),
    address2: text("address2"),
    city: text("city").notNull(),
    province: text("province").notNull(),
    postalCode: text("postal_code"),
    country: text("country").notNull(),
    notes: text("notes"),
    subtotalCents: integer("subtotal_cents").notNull().default(0),
    deliveryCents: integer("delivery_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull().default(0),
    paymentMethod: text("payment_method").notNull().default("eft"),
    paymentStatus: text("payment_status").notNull().default("pending"), // pending | paid | failed
    orderStatus: text("order_status").notNull().default("pending"), // pending | paid | processing | shipped | delivered | cancelled
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("orders_number_idx").on(t.orderNumber),
    index("orders_email_idx").on(t.email),
  ]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id"),
    productName: text("product_name").notNull(),
    variantLabel: text("variant_label"),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull(),
    image: text("image"),
    sku: text("sku"),
  },
  (t) => [index("items_order_idx").on(t.orderId)]
);

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("newsletter"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const tutorials = pgTable(
  "tutorials",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull(), // lashes | nails
    description: text("description"),
    videoUrl: text("video_url").notNull(),
    poster: text("poster"),
    durationLabel: text("duration_label"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("tutorials_category_idx").on(t.category)]
);

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type Tutorial = typeof tutorials.$inferSelect;
