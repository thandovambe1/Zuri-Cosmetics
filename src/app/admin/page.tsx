import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, products, subscribers } from "@/db/schema";
import { ensureSeeded } from "@/lib/data";
import { zar, formatDate } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/site-config";

export default async function AdminDashboardPage() {
  await ensureSeeded();

  const [orderRows, productRows, subscriberRows, itemRows] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(60),
    db.select({ id: products.id, stock: products.stock, name: products.name }).from(products),
    db.select({ id: subscribers.id }).from(subscribers),
    db.select({ orderId: orderItems.orderId, count: sql<number>`count(*)::int` }).from(orderItems).groupBy(orderItems.orderId),
  ]);

  const itemCountMap = new Map(itemRows.map((r) => [r.orderId, Number(r.count)]));
  const counts: Record<string, number> = { total: orderRows.length, pending: 0, paid: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
  for (const o of orderRows) counts[o.orderStatus] = (counts[o.orderStatus] ?? 0) + 1;
  const lowStock = productRows.filter((p) => p.stock <= 15);

  const statCard = "card-luxe p-6";
  const statValue = "font-display text-3xl text-plum-deep";
  const statLabel = "mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-mauve";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-plum-deep">Dashboard</h1>
          <p className="mt-1 text-sm text-ink/70">Orders, stock and subscribers at a glance.</p>
        </div>
        <Link href="/admin/products" className="btn btn-plum !px-5 !py-2.5 !text-[0.65rem]">
          Manage products
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className={statCard}>
          <p className={statValue}>{counts.total}</p>
          <p className={statLabel}>Total orders</p>
        </div>
        <div className={statCard}>
          <p className={statValue}>{counts.pending}</p>
          <p className={statLabel}>Pending</p>
        </div>
        <div className={statCard}>
          <p className={statValue}>{productRows.length}</p>
          <p className={statLabel}>Products · {lowStock.length} low stock</p>
        </div>
        <div className={statCard}>
          <p className={statValue}>{subscriberRows.length}</p>
          <p className={statLabel}>Newsletter subscribers</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl text-plum-deep">Recent orders</h2>
        {orderRows.length === 0 ? (
          <div className="card-luxe mt-4 p-10 text-center text-sm text-ink/70">
            No orders yet — they&apos;ll appear here the moment customers check out. ✨
          </div>
        ) : (
          <div className="card-luxe mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-blush-100 text-[0.66rem] uppercase tracking-[0.18em] text-mauve">
                  <th className="px-5 py-3.5 font-semibold">Order</th>
                  <th className="px-5 py-3.5 font-semibold">Customer</th>
                  <th className="px-5 py-3.5 font-semibold">Items</th>
                  <th className="px-5 py-3.5 font-semibold">Total</th>
                  <th className="px-5 py-3.5 font-semibold">Payment</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {orderRows.map((o) => (
                  <tr key={o.id} className="border-b border-blush-100/70 align-top">
                    <td className="px-5 py-4 font-semibold text-plum-deep">{o.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p>{o.firstName} {o.lastName}</p>
                      <p className="text-xs text-mauve">{o.email}</p>
                    </td>
                    <td className="px-5 py-4">{itemCountMap.get(o.id) ?? 0}</td>
                    <td className="px-5 py-4 font-medium tabular-nums">{zar(o.totalCents)}</td>
                    <td className="px-5 py-4 text-xs capitalize">{o.paymentMethod} · <span className="text-gold-deep">{o.paymentStatus}</span></td>
                    <td className="px-5 py-4 text-xs">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-4">
                      <form action={`/api/admin/orders/${o.id}`} method="post" className="flex items-center gap-2">
                        <select name="orderStatus" defaultValue={o.orderStatus} className="cursor-pointer rounded-full border border-blush-200 bg-ivory px-3 py-1.5 text-xs text-plum focus:border-gold focus:outline-none">
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button type="submit" className="btn btn-gold !px-3 !py-1.5 !text-[0.6rem]">
                          Update
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/order/${o.orderNumber}?email=${encodeURIComponent(o.email)}`} className="text-xs text-gold-deep underline underline-offset-2">
                        view
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-mauve">
        Statuses follow: pending → paid → processing → shipped → delivered (or cancelled). Payment status is never
        changed automatically — only real payment confirmations should mark an order as paid.
      </p>
    </div>
  );
}
