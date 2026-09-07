import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatus from "@/components/order-status";
import Reveal from "@/components/reveal";
import { LotusMark } from "@/components/icons";
import { whatsappLink } from "@/lib/config";
import { getOrderByNumber } from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const result = await getOrderByNumber(orderNumber);
  if (!result) notFound();

  const { order, items } = result;

  return (
    <section className="mx-auto max-w-4xl px-4 pt-16 pb-24 sm:px-6">
      <Reveal className="text-center">
        <LotusMark className="mx-auto h-6 w-12 text-gold" />
        <h1 className="mt-6 font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
          Thank you for shopping with{" "}
          <span className="gold-text font-semibold">Zuri Cosmetics</span> ✨
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-plum">
          Your order has been received and is being prepared with care. A confirmation
          email will be sent automatically once our email service is connected — keep
          this page for your records.
        </p>
      </Reveal>

      <Reveal delay={150} className="mt-12">
        <div className="card-lux overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/20 bg-blush/60 px-7 py-5">
            <div>
              <p className="text-[0.62rem] tracking-[0.26em] text-plum uppercase">Order number</p>
              <p className="mt-1 font-display text-2xl text-ink">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[0.62rem] tracking-[0.26em] text-plum uppercase">Placed</p>
              <p className="mt-1 text-sm text-cocoa">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="grid gap-8 px-7 py-7 sm:grid-cols-2">
            <div>
              <h2 className="eyebrow">Customer</h2>
              <p className="mt-3 font-display text-xl text-ink">
                {order.firstName} {order.lastName}
              </p>
              <p className="mt-1 text-sm text-plum">{order.email}</p>
              <p className="text-sm text-plum">{order.phone}</p>
            </div>
            <div>
              <h2 className="eyebrow">Delivery details</h2>
              <p className="mt-3 text-sm leading-relaxed text-cocoa">
                {order.address}
                <br />
                {order.city}, {order.province} {order.postalCode}
                <br />
                {order.country}
              </p>
            </div>
          </div>

          <div className="border-t border-gold/20 px-7 py-7">
            <h2 className="eyebrow">Order status</h2>
            <div className="mt-4">
              <OrderStatus status={order.status} />
            </div>
            <p className="mt-4 text-[0.7rem] leading-relaxed text-plum">
              Payment status:{" "}
              <span className="tracking-[0.14em] uppercase">
                {order.paymentStatus === "pending"
                  ? "Pending — a secure payment confirmation will follow"
                  : order.paymentStatus}
              </span>
            </p>
          </div>

          <div className="border-t border-gold/20 px-7 py-7">
            <h2 className="eyebrow">Your products</h2>
            <ul className="mt-4 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  {item.image && (
                    <span className="block w-14 shrink-0 overflow-hidden rounded-[0.7rem] border border-mauve/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-[4/5] w-full object-cover"
                      />
                    </span>
                  )}
                  <span className="flex-1">
                    <span className="block text-sm text-ink">
                      {item.name}
                      {item.shade ? ` — ${item.shade}` : ""}
                    </span>
                    <span className="mt-0.5 block text-[0.68rem] tracking-[0.16em] text-plum uppercase">
                      Qty {item.quantity} × {formatPrice(item.unitPrice)}
                    </span>
                  </span>
                  <span className="text-sm text-cocoa">
                    {formatPrice(Number(item.unitPrice) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2.5 border-t border-gold/20 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-plum">Subtotal</dt>
                <dd className="text-cocoa">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-plum">Delivery</dt>
                <dd className="text-cocoa">
                  {Number(order.deliveryFee) === 0 ? "Free" : formatPrice(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between font-display text-xl">
                <dt className="text-ink">Total</dt>
                <dd className="gold-text font-semibold">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Reveal>

      <Reveal delay={250} className="mt-10 flex flex-col items-center gap-4">
        <Link href="/shop" className="btn-lux btn-blush">
          Continue shopping
        </Link>
        <a
          href={whatsappLink(`Hi Zuri Cosmetics! I have a question about order ${order.orderNumber}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.68rem] tracking-[0.2em] text-plum uppercase underline-offset-4 hover:text-whatsapp hover:underline"
        >
          Questions about this order? WhatsApp us
        </a>
      </Reveal>
    </section>
  );
}
