import type { Metadata } from "next";
import AdminLogin from "@/components/admin-login";
import AdminDashboard, {
  type AdminOrder,
  type AdminProduct,
  type AdminReview,
} from "@/components/admin-dashboard";
import { LotusMark } from "@/components/icons";
import { adminPasswordIsDefault, isAdmin } from "@/lib/admin";
import { getAllOrders, getAllProductsAdmin } from "@/lib/queries";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { ensureDatabase } from "@/db/bootstrap";
import { toNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authorized = await isAdmin();
  if (!authorized) {
    return <AdminLogin passwordIsDefault={adminPasswordIsDefault()} />;
  }

  await ensureDatabase();

  const [allProducts, allOrders, pendingAndLive] = await Promise.all([
    getAllProductsAdmin(),
    getAllOrders(),
    db.select().from(reviews),
  ]);

  const productNames = new Map(allProducts.map((p) => [p.id, p.name]));
  const reviewRows: AdminReview[] = pendingAndLive
    .filter((r) => r.status === "pending" || r.isSample)
    .map((r) => ({
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      body: r.body,
      status: r.status,
      productName: productNames.get(r.productId) ?? "Unknown product",
    }));

  const productRows: AdminProduct[] = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: p.price,
    salePrice: p.salePrice,
    stock: p.stock,
    status: p.status,
    featured: p.featured,
    bestSeller: p.bestSeller,
    categoryName: p.categoryName,
  }));

  const orderRows: AdminOrder[] = allOrders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customer: `${o.firstName} ${o.lastName}`,
    email: o.email,
    total: toNumber(o.total),
    status: o.status,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <LotusMark className="mx-auto h-5 w-10 text-gold/80" />
        <h1 className="mt-4 font-display text-5xl text-ink">Zuri Admin</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-plum">
          Manage orders, inventory, pricing and review moderation. Changes publish to
          the storefront immediately.
        </p>
      </div>
      <div className="mt-12">
        <AdminDashboard products={productRows} orders={orderRows} reviews={reviewRows} />
      </div>
    </section>
  );
}
