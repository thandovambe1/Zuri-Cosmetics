import Link from "next/link";
import type { Metadata } from "next";
import { getOrderByNumberAndEmail } from "@/lib/data";
import { zar, formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { EmptyState, Ornament } from "@/components/ui";
import { IconBag, IconUser } from "@/components/icons";

export const metadata: Metadata = {
  title: "Your Account & Order Tracking — Zuri Cosmetics",
  description: "Track your Zuri Cosmetics order, view order history and manage your beauty essentials.",
  alternates: { canonical: "/account" },
};

const STATUS_TONE: Record<string, string> = {
  pending: "bg-champagne/70 text-gold-deep",
  paid: "bg-blush-100 text-plum",
  processing: "bg-lavender/60 text-lavender-deep",
  shipped: "bg-lavender/60 text-lavender-deep",
  delivered: "bg-blush-100 text-plum",
  cancelled: "bg-rose/10 text-rose-deep",
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ order?: string; email?: string }> }) {
  const { order, email } = await searchParams;
  const found = order && email ? await getOrderByNumberAndEmail(order, email) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Zuri Cosmetics</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] text-plum-deep">Your Account</h1>
          <p className="mt-2 max-w-lg text-[0.95rem] text-ink/75">
            Track any order placed with Zuri Cosmetics using the email address and order number from
            your confirmation.
          </p>
        </div>
        <Ornament />
      </div>

      {/* Lookup */}
      <div className="card-luxe mt-8 p-6 sm:p-8">
        <h2 className="flex items-center gap-2.5 font-display text-lg text-plum-deep">
          <IconBag size={18} className="text-gold-deep" /> Track an order
        </h2>
        <form method="get" className="mt-5 grid gap-3.5 sm:grid-cols-[1fr_1fr_auto]">
          <input name="email" type="email" required placeholder="Email used at checkout" defaultValue={email ?? ""} className="input-luxe" />
          <input name="order" placeholder="Order number (e.g. ZC-XXXXXX)" defaultValue={order ?? ""} className="input-luxe" />
          <button type="submit" className="btn btn-gold">
            Track order
          </button>
        </form>
        <p className="mt-3 text-xs text-mauve">
          Full customer accounts with saved addresses, wishlists and subscriptions are coming soon —
          guest checkout stays quick and easy in the meantime.
        </p>
      </div>

      {/* Result */}
      {order && email && !found && (
        <div className="mt-8">
          <EmptyState
            icon={<IconUser size={24} />}
            title="No matching order found"
            text={`We couldn't find ${order} for ${email}. Double-check both fields — order numbers look like ZC-XXXXXX.`}
            action={
              <Link href="/shop" className="btn btn-gold">
                Shop Zuri Cosmetics
              </Link>
            }
          />
        </div>
      )}

      {found && (
        <div className="card-luxe mt-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-mauve">Order</p>
              <p className="font-display text-2xl text-plum-deep">{found.orderNumber}</p>
              <p className="mt-1 text-xs text-mauve">Placed {formatDate(found.createdAt)}</p>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${STATUS_TONE[found.orderStatus] ?? STATUS_TONE.pending}`}>
              {found.orderStatus}
            </span>
          </div>

          <ul className="mt-6 divide-y divide-blush-100 border-t border-blush-100">
            {found.items.map((it, i) => (
              <li key={i} className="flex items-center gap-4 py-3.5">
                {it.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt={it.productName} className="h-14 w-11 rounded-lg border border-blush-100 object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-plum-deep">{it.productName}</p>
                  {it.variantLabel && <p className="text-xs text-mauve">{it.variantLabel}</p>}
                </div>
                <p className="text-sm text-mauve">× {it.quantity}</p>
                <p className="w-24 text-right text-sm font-medium text-plum-deep tabular-nums">{zar(it.unitPriceCents * it.quantity)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1.5 border-t border-blush-100 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink/70">Subtotal</dt><dd className="tabular-nums">{zar(found.subtotalCents)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/70">Delivery</dt><dd className="tabular-nums">{found.deliveryCents === 0 ? "Free" : zar(found.deliveryCents)}</dd></div>
            <div className="flex justify-between font-semibold text-plum-deep"><dt>Total</dt><dd className="tabular-nums">{zar(found.totalCents)}</dd></div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-blush-100 pt-5">
            <Link href={`/order/${found.orderNumber}?email=${encodeURIComponent(found.email)}`} className="btn btn-soft">
              Full confirmation
            </Link>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hi Zuri Cosmetics! I have a question about order ${found.orderNumber}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Ask about this order
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
