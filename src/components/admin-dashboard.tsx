"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils";

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  status: string;
  featured: boolean;
  bestSeller: boolean;
  categoryName: string;
}
export interface AdminOrder {
  id: number;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}
export interface AdminReview {
  id: number;
  authorName: string;
  rating: number;
  body: string;
  status: string;
  productName: string;
}

const ORDER_STATUSES = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "refunded", "failed"];

export default function AdminDashboard({
  products,
  orders,
  reviews,
}: {
  products: AdminProduct[];
  orders: AdminOrder[];
  reviews: AdminReview[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const patchProduct = async (id: number, patch: Record<string, unknown>, key: string) => {
    setBusy(key);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    setBusy(null);
    router.refresh();
  };

  const patchOrder = async (id: number, patch: Record<string, unknown>) => {
    setBusy(`order-${id}`);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    setBusy(null);
    router.refresh();
  };

  const patchReview = async (id: number, action: string) => {
    setBusy(`review-${id}`);
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setBusy(null);
    router.refresh();
  };

  return (
    <div className="space-y-14">
      {/* Orders */}
      <section>
        <h2 className="font-display text-3xl text-ink">Orders</h2>
        <div className="mt-5 space-y-4">
          {orders.length === 0 && (
            <p className="rounded-[1.2rem] border border-dashed border-mauve/40 bg-white/50 p-8 text-center text-sm text-plum">
              No orders yet — they will appear here the moment a customer checks out.
            </p>
          )}
          {orders.map((o) => (
            <div key={o.id} className="card-lux flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-[10rem] flex-1">
                <p className="font-display text-xl text-ink">{o.orderNumber}</p>
                <p className="mt-0.5 text-xs text-plum">
                  {o.customer} · {o.email}
                </p>
                <p className="text-xs text-plum/80">{formatDate(o.createdAt)}</p>
              </div>
              <p className="font-display text-lg text-ink">{formatPrice(o.total)}</p>
              <label className="flex items-center gap-2 text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                Status
                <select
                  value={o.status}
                  disabled={busy === `order-${o.id}`}
                  onChange={(e) => patchOrder(o.id, { status: e.target.value })}
                  className="field-lux !w-auto !py-2 text-[0.7rem] normal-case"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                Payment
                <select
                  value={o.paymentStatus}
                  disabled={busy === `order-${o.id}`}
                  onChange={(e) => patchOrder(o.id, { paymentStatus: e.target.value })}
                  className="field-lux !w-auto !py-2 text-[0.7rem] normal-case"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 className="font-display text-3xl text-ink">Products & inventory</h2>
        <div className="mt-5 space-y-4">
          {products.map((p) => (
            <div key={p.id} className="card-lux p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-ink">{p.name}</p>
                  <p className="mt-0.5 text-[0.64rem] tracking-[0.18em] text-plum uppercase">
                    {p.categoryName} · {p.sku ?? "no sku"}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                  Status
                  <select
                    value={p.status}
                    disabled={busy === `status-${p.id}`}
                    onChange={(e) =>
                      patchProduct(p.id, { status: e.target.value }, `status-${p.id}`)
                    }
                    className="field-lux !w-auto !py-2 text-[0.7rem] normal-case"
                  >
                    <option value="active">active</option>
                    <option value="draft">draft</option>
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <label className="block text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                  Price (R)
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={p.price}
                    disabled={busy === `price-${p.id}`}
                    onBlur={(e) =>
                      Number(e.target.value) !== p.price &&
                      patchProduct(p.id, { price: Number(e.target.value) }, `price-${p.id}`)
                    }
                    className="field-lux mt-1.5"
                  />
                </label>
                <label className="block text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                  Sale price (R)
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={p.salePrice ?? ""}
                    placeholder="—"
                    disabled={busy === `sale-${p.id}`}
                    onBlur={(e) => {
                      const raw = e.target.value.trim();
                      const next = raw === "" ? null : Number(raw);
                      if (next !== p.salePrice)
                        patchProduct(p.id, { salePrice: next }, `sale-${p.id}`);
                    }}
                    className="field-lux mt-1.5"
                  />
                </label>
                <label className="block text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                  Stock
                  <input
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    disabled={busy === `stock-${p.id}`}
                    onBlur={(e) =>
                      Number(e.target.value) !== p.stock &&
                      patchProduct(p.id, { stock: Number(e.target.value) }, `stock-${p.id}`)
                    }
                    className="field-lux mt-1.5"
                  />
                </label>
                <div className="flex items-end gap-2 pb-1">
                  <label className="flex items-center gap-2 text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                    <input
                      type="checkbox"
                      checked={p.featured}
                      onChange={(e) =>
                        patchProduct(p.id, { featured: e.target.checked }, `feat-${p.id}`)
                      }
                      className="h-4 w-4 accent-gold"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                    <input
                      type="checkbox"
                      checked={p.bestSeller}
                      onChange={(e) =>
                        patchProduct(p.id, { bestSeller: e.target.checked }, `best-${p.id}`)
                      }
                      className="h-4 w-4 accent-gold"
                    />
                    Best
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review moderation */}
      <section>
        <h2 className="font-display text-3xl text-ink">Review moderation</h2>
        <div className="mt-5 space-y-4">
          {reviews.length === 0 && (
            <p className="rounded-[1.2rem] border border-dashed border-mauve/40 bg-white/50 p-8 text-center text-sm text-plum">
              No reviews awaiting moderation.
            </p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="card-lux flex flex-wrap items-start gap-4 p-5">
              <div className="flex-1">
                <p className="text-sm text-ink">
                  <strong className="font-medium">{r.authorName}</strong> · {r.rating}★ ·{" "}
                  <span className="text-plum">{r.productName}</span>
                  {r.status === "approved" && (
                    <span className="ml-2 rounded-full bg-whatsapp/15 px-2.5 py-0.5 text-[0.56rem] tracking-[0.18em] text-whatsapp uppercase">
                      live
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-plum">{r.body}</p>
              </div>
              <div className="flex gap-2">
                {r.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => patchReview(r.id, "approve")}
                    disabled={busy === `review-${r.id}`}
                    className="btn-lux btn-blush !px-4 !py-2 !text-[0.6rem]"
                  >
                    Approve
                  </button>
                )}
                {r.status === "approved" && (
                  <button
                    type="button"
                    onClick={() => patchReview(r.id, "unapprove")}
                    disabled={busy === `review-${r.id}`}
                    className="btn-lux btn-outline !px-4 !py-2 !text-[0.6rem]"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => patchReview(r.id, "delete")}
                  disabled={busy === `review-${r.id}`}
                  className="btn-lux btn-outline !px-4 !py-2 !text-[0.6rem] !text-[#b0565e]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
