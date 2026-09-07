"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import OrderStatus from "@/components/order-status";
import { formatPrice, formatDate, isEmail } from "@/lib/utils";
import { IconSearch, IconUser, LotusMark } from "@/components/icons";

interface OrderItemRow {
  id: number;
  name: string;
  shade: string | null;
  quantity: number;
  unitPrice: string;
  image: string | null;
}
interface OrderRow {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  paymentStatus: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  createdAt: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export default function AccountPage() {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!number.trim() || !isEmail(email)) {
      setState("error");
      setMessage("Please enter your order number and the email used at checkout.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch(
        `/api/order-lookup?number=${encodeURIComponent(number.trim())}&email=${encodeURIComponent(email.trim())}`
      );
      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
        order?: OrderRow;
        items?: OrderItemRow[];
      };
      if (!res.ok || !data.ok || !data.order) {
        throw new Error(data.message ?? "Order not found.");
      }
      setOrder(data.order);
      setItems(data.items ?? []);
      setState("success");
      setMessage("");
    } catch (err) {
      setOrder(null);
      setItems([]);
      setState("error");
      setMessage(err instanceof Error ? err.message : "Could not find that order.");
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 pt-16 pb-24 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/35 bg-blush text-gold-deep">
          <IconUser className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-5xl text-ink sm:text-6xl">Your Zuri account</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-plum">
          Guest checkout is always welcome at Zuri Cosmetics. Track any order below with
          your order number and email — full customer accounts with saved addresses,
          favourites and subscriptions are coming soon.
        </p>
      </div>

      <form onSubmit={submit} className="card-lux mx-auto mt-12 max-w-xl p-7 sm:p-9" noValidate>
        <h2 className="font-display text-2xl text-ink">Track your order</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">
              Order number
            </span>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="ZC-2026-00000"
              className="field-lux mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-lux mt-2"
            />
          </label>
        </div>
        <button type="submit" className="btn-lux btn-blush mt-6 w-full" disabled={state === "loading"}>
          <IconSearch className="h-4 w-4" />
          {state === "loading" ? "Finding your order…" : "Find my order"}
        </button>
        {state === "error" && (
          <p className="mt-4 text-xs text-[#b0565e]" role="alert">
            {message}
          </p>
        )}
      </form>

      {state === "success" && order && (
        <div className="card-lux mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 bg-blush/60 px-7 py-5">
            <div>
              <p className="text-[0.62rem] tracking-[0.26em] text-plum uppercase">Order</p>
              <p className="mt-1 font-display text-2xl text-ink">{order.orderNumber}</p>
            </div>
            <p className="text-sm text-plum">{formatDate(order.createdAt)}</p>
          </div>
          <div className="px-7 py-6">
            <OrderStatus status={order.status} />
            <ul className="mt-6 space-y-3.5">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  {item.image && (
                    <span className="block w-12 shrink-0 overflow-hidden rounded-[0.6rem] border border-mauve/20">
                      <img src={item.image} alt={item.name} className="aspect-[4/5] w-full object-cover" />
                    </span>
                  )}
                  <span className="flex-1 text-sm text-ink">
                    {item.name}
                    {item.shade ? ` — ${item.shade}` : ""}
                    <span className="block text-[0.66rem] tracking-[0.16em] text-plum uppercase">
                      Qty {item.quantity}
                    </span>
                  </span>
                  <span className="text-sm text-cocoa">
                    {formatPrice(Number(item.unitPrice) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-gold/20 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-plum">Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-plum">Delivery</dt>
                <dd>{Number(order.deliveryFee) === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between font-display text-lg">
                <dt className="text-ink">Total</dt>
                <dd className="gold-text font-semibold">{formatPrice(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[0.7rem] leading-relaxed text-plum">
              Delivering to: {order.address}, {order.city}, {order.province}{" "}
              {order.postalCode}, {order.country}
            </p>
            <Link href={`/order/${order.orderNumber}`} className="btn-lux btn-outline mt-6">
              View full confirmation
            </Link>
          </div>
        </div>
      )}

      <div className="mt-14 text-center">
        <LotusMark className="mx-auto h-4 w-9 text-gold/60" />
        <p className="mx-auto mt-4 max-w-md text-[0.7rem] leading-relaxed tracking-[0.14em] text-plum uppercase">
          Coming soon: saved addresses, favourites, subscription management & order
          history in one place
        </p>
      </div>
    </section>
  );
}
