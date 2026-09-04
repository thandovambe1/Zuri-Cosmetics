import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrderByNumberAndEmail } from "@/lib/data";
import { zar, formatDate } from "@/lib/format";
import { siteConfig, ORDER_STATUSES } from "@/lib/site-config";
import { EmptyState, Ornament } from "@/components/ui";
import { IconBag, IconCheck, IconMail } from "@/components/icons";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Thank you for shopping with Zuri Cosmetics — view your order details.",
  robots: { index: false, follow: true },
};

const STATUS_META: Record<string, { label: string; tone: string }> = {
  pending: { label: "Pending", tone: "bg-champagne/70 text-gold-deep" },
  paid: { label: "Paid", tone: "bg-blush-100 text-plum" },
  processing: { label: "Processing", tone: "bg-lavender/60 text-lavender-deep" },
  shipped: { label: "Shipped", tone: "bg-lavender/60 text-lavender-deep" },
  delivered: { label: "Delivered", tone: "bg-blush-100 text-plum" },
  cancelled: { label: "Cancelled", tone: "bg-rose/10 text-rose-deep" },
};

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orderNumber } = await params;
  const { email } = await searchParams;

  const order = email ? await getOrderByNumberAndEmail(orderNumber, email) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={<IconBag size={26} />}
          title="We couldn't find that order"
          text={
            email
              ? `No order ${orderNumber} was found for ${email}. Double-check the order number and email address used at checkout.`
              : "Add the email address you used at checkout to view your order."
          }
          action={
            <form method="get" className="mt-2 flex w-full max-w-md flex-col gap-2.5">
              <input
                type="email"
                name="email"
                required
                placeholder="Email used at checkout"
                className="input-luxe"
                defaultValue={email}
              />
              <button type="submit" className="btn btn-gold">
                View my order
              </button>
            </form>
          }
        />
        <div className="mt-8 text-center">
          <Link href="/shop" className="btn btn-ghost">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_META[order.orderStatus] ?? STATUS_META.pending;
  const stepIndex = ORDER_STATUSES.indexOf(order.orderStatus as (typeof ORDER_STATUSES)[number]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="anim-fade-up text-center">
        <span className="inline-grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-blush-100 to-champagne/70 text-4xl">
          ✨
        </span>
        <h1 className="mt-6 font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-tight text-plum-deep">
          Thank you for shopping with Zuri Cosmetics
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[0.95rem] leading-relaxed text-ink/75">
          Your order has been received. A member of the Zuri team will confirm once your payment
          reflects — no payment is taken automatically.
        </p>
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-blush-200 bg-ivory px-6 py-3 text-sm text-plum">
          Order number: <span className="font-semibold text-gold-deep">{order.orderNumber}</span>
          <span className={`rounded-full px-3 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] ${status.tone}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="card-luxe p-6">
          <h2 className="font-display text-lg text-plum-deep">Customer</h2>
          <p className="mt-3 text-sm text-ink/85">
            {order.firstName} {order.lastName}
          </p>
          <p className="text-sm text-ink/75">{order.email}</p>
          {order.phone && <p className="text-sm text-ink/75">{order.phone}</p>}
          <div className="mt-4 border-t border-blush-100 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-mauve">Delivery to</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/85">
              {order.address}
              {order.address2 ? `, ${order.address2}` : ""}
              <br />
              {order.city}, {order.province} {order.postalCode}
              <br />
              {order.country}
            </p>
          </div>
        </div>

        <div className="card-luxe p-6">
          <h2 className="font-display text-lg text-plum-deep">Payment</h2>
          <p className="mt-3 text-sm text-ink/85">
            Method:{" "}
            <span className="font-medium text-plum-deep">
              {order.paymentMethod === "eft" ? "Bank transfer (EFT)" : "Card"}
            </span>
          </p>
          <p className="text-sm text-ink/75">
            Status: <span className="font-medium text-gold-deep">Pending — awaiting payment confirmation</span>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-mauve">
            We will contact you on WhatsApp / email with payment instructions. Your order is never
            marked as paid until a payment is actually confirmed.
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="card-luxe mt-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg text-plum-deep">Your order</h2>
          <p className="text-xs text-mauve">Placed {formatDate(order.createdAt)}</p>
        </div>
        <ul className="mt-5 divide-y divide-blush-100">
          {order.items.map((it, idx) => (
            <li key={idx} className="flex items-center gap-4 py-4">
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt={it.productName} className="h-16 w-13 rounded-xl border border-blush-100 object-cover" style={{ width: 52 }} />
              ) : (
                <span className="grid h-16 w-13 place-items-center rounded-xl bg-blush-100" style={{ width: 52 }}>
                  <IconBag size={18} className="text-mauve" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-plum-deep">{it.productName}</p>
                {it.variantLabel && <p className="text-xs text-mauve">{it.variantLabel}</p>}
                <p className="text-xs text-mauve">Qty {it.quantity}</p>
              </div>
              <p className="text-sm font-medium text-plum-deep tabular-nums">{zar(it.unitPriceCents * it.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-blush-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/75">Subtotal</dt>
            <dd className="tabular-nums text-plum-deep">{zar(order.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/75">Delivery</dt>
            <dd className="tabular-nums text-plum-deep">{order.deliveryCents === 0 ? "Free" : zar(order.deliveryCents)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold text-plum-deep">
            <dt>Total</dt>
            <dd className="tabular-nums">{zar(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      {/* Status timeline */}
      <div className="card-luxe mt-6 p-6 sm:p-8">
        <h2 className="font-display text-lg text-plum-deep">Order status</h2>
        <ol className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ORDER_STATUSES.map((s, i) => {
            const meta = STATUS_META[s];
            const reached = stepIndex >= i;
            return (
              <li key={s} className="flex flex-col items-center gap-1.5 text-center">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border text-xs transition ${
                    reached ? "border-gold bg-gold/15 text-gold-deep" : "border-blush-200 text-mauve/60"
                  }`}
                >
                  {reached ? <IconCheck size={13} /> : i + 1}
                </span>
                <span className={`text-[0.58rem] uppercase tracking-[0.12em] ${reached ? "text-plum-deep" : "text-mauve/70"}`}>
                  {meta.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <Link href="/shop" className="btn btn-gold">
          Continue Shopping
        </Link>
        <p className="flex items-center gap-2 text-xs text-mauve">
          <IconMail size={13} className="text-gold-deep" />
          Email confirmations activate once email service is configured — save this page for your records.
        </p>
        <Ornament />
      </div>
    </div>
  );
}
