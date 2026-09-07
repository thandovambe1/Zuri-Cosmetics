"use client";

import Link from "next/link";
import { useCart, cartKey } from "@/lib/cart";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import {
  IconArrowRight,
  IconBag,
  IconMinus,
  IconPlus,
  IconTrash,
  IconTruck,
  LotusMark,
} from "@/components/icons";

export default function CartPage() {
  const { items, ready, subtotal, setQty, remove } = useCart();

  const delivery =
    items.length === 0
      ? 0
      : subtotal >= siteConfig.freeDeliveryOver
        ? 0
        : siteConfig.deliveryFee;
  const total = subtotal + delivery;

  if (ready && items.length === 0) {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/35 bg-blush text-gold-deep">
          <IconBag className="h-9 w-9" />
        </span>
        <h1 className="mt-8 font-display text-5xl text-ink sm:text-6xl">
          Your beauty bag is waiting…
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-plum">
          Nothing here yet — but your next favourite lash set, press-on manicure or
          glossy lip is one tap away.
        </p>
        <Link href="/shop" className="btn-lux btn-blush mt-9">
          Shop Zuri Cosmetics
        </Link>
        <LotusMark className="mt-14 h-5 w-10 text-gold/50" />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-10">
      <p className="eyebrow text-center">Your selection</p>
      <h1 className="mt-3 text-center font-display text-5xl text-ink sm:text-6xl">
        The Beauty Bag
      </h1>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <ul className="space-y-5">
          {items.map((item) => {
            const key = cartKey(item.productId, item.shade);
            return (
              <li
                key={key}
                className="card-lux flex gap-4 p-4 transition-shadow duration-300 hover:shadow-lift sm:gap-6 sm:p-5"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="block w-24 shrink-0 overflow-hidden rounded-[1rem] border border-mauve/20 sm:w-32"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-display text-xl leading-snug text-ink transition-colors hover:text-gold-deep sm:text-2xl"
                      >
                        {item.name}
                      </Link>
                      {item.shade && (
                        <p className="mt-1 text-[0.66rem] tracking-[0.2em] text-plum uppercase">
                          Shade: {item.shade}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-plum/80">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(key)}
                      aria-label={`Remove ${item.name} from bag`}
                      className="rounded-full p-2 text-plum transition-colors hover:bg-blush hover:text-[#b0565e]"
                    >
                      <IconTrash className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div className="flex items-center rounded-full border border-mauve/35 bg-white/70">
                      <button
                        type="button"
                        onClick={() => setQty(key, item.qty - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="p-2.5 text-cocoa hover:text-gold-deep"
                      >
                        <IconMinus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(key, item.qty + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="p-2.5 text-cocoa hover:text-gold-deep disabled:opacity-40"
                        disabled={item.qty >= item.stock}
                      >
                        <IconPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-display text-xl text-ink">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit lg:sticky lg:top-32">
          <div className="card-lux p-7 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Order summary</h2>
            <dl className="mt-6 space-y-3.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-plum">Subtotal</dt>
                <dd className="text-cocoa">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-plum">Delivery</dt>
                <dd className="text-cocoa">
                  {delivery === 0 ? (
                    <span className="text-whatsapp">Free</span>
                  ) : (
                    formatPrice(delivery)
                  )}
                </dd>
              </div>
              {delivery > 0 && (
                <p className="rounded-xl bg-blush/70 px-3.5 py-2.5 text-[0.68rem] leading-relaxed text-plum">
                  Add {formatPrice(siteConfig.freeDeliveryOver - subtotal)} more for free
                  delivery.
                </p>
              )}
              <div className="flex justify-between border-t border-gold/25 pt-4 font-display text-xl">
                <dt className="text-ink">Total</dt>
                <dd className="gold-text font-semibold">{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="btn-lux btn-blush mt-7 w-full">
              Proceed to checkout
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/shop" className="btn-lux btn-outline mt-3 w-full">
              Continue shopping
            </Link>
            <p className="mt-5 flex items-start gap-2.5 text-[0.68rem] leading-relaxed text-plum">
              <IconTruck className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
              {siteConfig.deliveryEstimate}. Delivery fee configurable in site settings.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
