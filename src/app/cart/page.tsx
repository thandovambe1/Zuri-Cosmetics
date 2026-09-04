"use client";

import Link from "next/link";
import { CartItemRow, useCart } from "@/components/cart";
import { zar } from "@/lib/format";
import { EmptyState, Ornament } from "@/components/ui";
import { IconArrowRight, IconBag } from "@/components/icons";

export default function CartPage() {
  const { items, mounted, subtotalCents, deliveryCents, totalCents, freeOverCents, clearCart } = useCart();
  const remaining = freeOverCents - subtotalCents;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
        <Link href="/" className="hover:text-rose-deep">Home</Link>
        <span className="mx-2 text-gold">/</span>
        <span className="text-plum">Shopping Bag</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Zuri Cosmetics</p>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-plum-deep">Your Shopping Bag</h1>
        </div>
        <Ornament />
      </div>

      {!mounted ? (
        <p className="mt-16 text-center text-mauve">Loading your bag…</p>
      ) : items.length === 0 ? (
        <div className="mt-16">
          <EmptyState
            icon={<IconBag size={26} />}
            title="Your beauty bag is waiting..."
            text="It's feeling a little light — explore lashes, press-on nails and lip essentials made for effortless beauty."
            action={
              <Link href="/shop" className="btn btn-gold">
                Shop Zuri Cosmetics
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="card-luxe divide-y divide-blush-100 px-6 sm:px-8">
            {items.map((item) => (
              <CartItemRow key={item.key} item={item} />
            ))}
            <div className="flex justify-end py-4">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-medium uppercase tracking-[0.16em] text-mauve transition hover:text-rose-deep"
              >
                Clear bag
              </button>
            </div>
          </div>

          <aside className="h-max space-y-4 lg:sticky lg:top-32">
            <div className="card-luxe p-6 sm:p-7">
              <h2 className="font-display text-xl text-plum-deep">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/75">Subtotal</dt>
                  <dd className="font-medium text-plum-deep tabular-nums">{zar(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/75">Delivery</dt>
                  <dd className="font-medium text-plum-deep tabular-nums">{deliveryCents === 0 ? "Free" : zar(deliveryCents)}</dd>
                </div>
                {remaining > 0 && (
                  <p className="rounded-xl bg-blush-50 px-3 py-2.5 text-xs text-plum">
                    ✨ Add {zar(remaining)} more for <strong>free delivery</strong>.
                  </p>
                )}
                <div className="flex justify-between border-t border-blush-200 pt-3 text-base font-semibold text-plum-deep">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{zar(totalCents)}</dd>
                </div>
              </dl>
              <Link href="/checkout" className="btn btn-gold mt-6 w-full">
                Proceed to Checkout <IconArrowRight size={14} />
              </Link>
              <Link href="/shop" className="btn btn-ghost mt-2.5 w-full">
                Continue Shopping
              </Link>
            </div>
            <p className="px-2 text-center text-[0.7rem] leading-relaxed text-mauve">
              Secure checkout · No card details stored by Zuri Cosmetics
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
