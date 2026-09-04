"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart";
import { zar } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { EmptyState, Ornament } from "@/components/ui";
import { IconBag, IconCheck, IconLock, IconShield } from "@/components/icons";

export default function CheckoutPage() {
  const { items, mounted, subtotalCents, deliveryCents, totalCents, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "South Africa",
    notes: "",
    paymentMethod: "eft",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!mounted || items.length === 0) return;
    setSubmitting(true);
    setError("");

    const payload = {
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
      delivery: {
        address: form.address,
        address2: form.address2,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
        country: form.country,
        notes: form.notes,
      },
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.qty,
        name: i.name,
        variantLabel: i.variantLabel,
        priceCents: i.priceCents,
        image: i.image,
        slug: i.slug,
      })),
      paymentMethod: form.paymentMethod,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; orderNumber?: string };
      if (res.ok && data.ok && data.orderNumber) {
        clearCart();
        router.push(`/order/${data.orderNumber}?email=${encodeURIComponent(form.email)}`);
        return;
      }
      setError(data.error || "We couldn't place your order. Please try again.");
      setSubmitting(false);
    } catch {
      setError("We couldn't place your order. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  const input = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(key, e.target.value),
  });

  if (!mounted) {
    return <p className="py-24 text-center text-mauve">Preparing checkout…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={<IconBag size={26} />}
          title="Your beauty bag is empty"
          text="Add a few Zuri favourites before heading to checkout."
          action={
            <Link href="/shop" className="btn btn-gold">
              Shop Zuri Cosmetics
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
        <Link href="/" className="hover:text-rose-deep">Home</Link>
        <span className="mx-2 text-gold">/</span>
        <Link href="/cart" className="hover:text-rose-deep">Bag</Link>
        <span className="mx-2 text-gold">/</span>
        <span className="text-plum">Checkout</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Zuri Cosmetics</p>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-plum-deep">Checkout</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink/75">
            <IconLock size={14} className="text-gold-deep" /> Secure checkout — your details are encrypted and never shared.
          </p>
        </div>
        <Ornament />
      </div>

      <form onSubmit={placeOrder} className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          {/* Customer details */}
          <section className="card-luxe p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl text-plum-deep">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-light text-sm text-gold-deep">1</span>
              Customer Details
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">First name *</span>
                <input required autoComplete="given-name" {...input("firstName")} className="input-luxe" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Last name *</span>
                <input required autoComplete="family-name" {...input("lastName")} className="input-luxe" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Email *</span>
                <input required type="email" autoComplete="email" {...input("email")} className="input-luxe" placeholder="you@email.com" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Phone *</span>
                <input required type="tel" autoComplete="tel" {...input("phone")} className="input-luxe" placeholder="+27 00 000 0000" />
              </label>
            </div>
          </section>

          {/* Delivery details */}
          <section className="card-luxe p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl text-plum-deep">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-light text-sm text-gold-deep">2</span>
              Delivery Details
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Street address *</span>
                <input required autoComplete="street-address" {...input("address")} className="input-luxe" placeholder="House number & street name" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Address line 2 (optional)</span>
                <input autoComplete="address-line2" {...input("address2")} className="input-luxe" placeholder="Unit, complex, floor…" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">City *</span>
                <input required autoComplete="address-level2" {...input("city")} className="input-luxe" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Province *</span>
                <input required autoComplete="address-level1" {...input("province")} className="input-luxe" placeholder="e.g. Gauteng" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Postal code *</span>
                <input required autoComplete="postal-code" {...input("postalCode")} className="input-luxe" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Country *</span>
                <select required autoComplete="country-name" {...input("country")} className="input-luxe cursor-pointer">
                  <option>South Africa</option>
                  <option>Botswana</option>
                  <option>Eswatini</option>
                  <option>Lesotho</option>
                  <option>Namibia</option>
                  <option>Zimbabwe</option>
                  <option>Mozambique</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mauve">Order notes (optional)</span>
                <textarea rows={3} {...input("notes")} className="input-luxe resize-y" placeholder="Anything we should know about your delivery?" />
              </label>
            </div>
          </section>

          {/* Payment */}
          <section className="card-luxe p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl text-plum-deep">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-light text-sm text-gold-deep">3</span>
              Secure Payment
            </h2>
            <div className="mt-6 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gold/50 bg-gold-light/30 p-4 transition hover:bg-gold-light/50">
                <input type="radio" name="paymentMethod" value="eft" checked={form.paymentMethod === "eft"} onChange={() => set("paymentMethod", "eft")} className="mt-1 accent-[#93702f]" />
                <span>
                  <span className="block text-sm font-semibold text-plum-deep">Bank transfer (EFT)</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink/70">
                    Place your order now — our team will confirm once your payment reflects. No payment is taken automatically.
                  </span>
                </span>
              </label>

              <div className="flex items-start gap-3 rounded-2xl border border-blush-200 bg-blush-50 p-4 opacity-80">
                <span className="mt-1 grid h-4 w-4 place-items-center rounded-full border border-blush-300" />
                <span>
                  <span className="block text-sm font-medium text-plum-deep">Card & instant payment</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink/70">
                    Coming soon — card payments will activate automatically once a payment provider is configured. Your order is never falsely marked as paid.
                  </span>
                </span>
              </div>
              <p className="flex items-center gap-2 text-xs text-mauve">
                <IconShield size={14} className="shrink-0 text-gold-deep" />
                Payment configuration lives in secure environment variables — never in the browser.
              </p>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="h-max space-y-4 lg:sticky lg:top-32">
          <div className="card-luxe p-6 sm:p-7">
            <h2 className="font-display text-xl text-plum-deep">Order Summary</h2>
            <ul className="mt-5 space-y-4">
              {items.map((i) => (
                <li key={i.key} className="flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt={i.name} className="h-14 w-12 rounded-lg border border-blush-100 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-plum-deep">{i.name}</p>
                    {i.variantLabel && <p className="text-xs text-mauve">{i.variantLabel}</p>}
                    <p className="text-xs text-mauve">Qty {i.qty}</p>
                  </div>
                  <p className="text-sm font-medium text-plum-deep tabular-nums">{zar(i.priceCents * i.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2.5 border-t border-blush-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/75">Subtotal</dt>
                <dd className="tabular-nums text-plum-deep">{zar(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/75">Delivery ({siteConfig.delivery.estimate})</dt>
                <dd className="tabular-nums text-plum-deep">{deliveryCents === 0 ? "Free" : zar(deliveryCents)}</dd>
              </div>
              <div className="flex justify-between border-t border-blush-200 pt-2.5 text-base font-semibold text-plum-deep">
                <dt>Total</dt>
                <dd className="tabular-nums">{zar(totalCents)}</dd>
              </div>
            </dl>

            {error && <p className="mt-4 rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose-deep">{error}</p>}

            <button type="submit" disabled={submitting} className="btn btn-gold mt-5 w-full !py-4">
              {submitting ? "Placing your order…" : "Place Order"}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-mauve">
              <IconCheck size={12} className="text-gold-deep" /> By placing your order you agree to our Terms & Conditions.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
