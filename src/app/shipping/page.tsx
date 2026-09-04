import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { zar } from "@/lib/format";
import Reveal from "@/components/reveal";
import { Ornament } from "@/components/ui";
import { IconRefresh, IconTruck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Shipping & Returns — Zuri Cosmetics",
  description: "Zuri Cosmetics delivery information and returns policy. Standard delivery and free delivery over R 1,200.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  const fee = siteConfig.delivery.feeCents;
  const freeOver = siteConfig.delivery.freeOverCents;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
        <Link href="/" className="hover:text-rose-deep">Home</Link>
        <span className="mx-2 text-gold">/</span>
        <span className="text-plum">Shipping & Returns</span>
      </nav>

      <Reveal className="mt-6">
        <p className="eyebrow">Good to know</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.4rem)] text-plum-deep">Shipping & Returns</h1>
      </Reveal>

      <div className="mt-10 space-y-4">
        <Reveal>
          <div className="card-luxe flex items-start gap-5 p-7">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-light text-gold-deep"><IconTruck size={22} /></span>
            <div>
              <h2 className="font-display text-xl text-plum-deep">Delivery</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
                <li>• Standard delivery: <strong className="text-plum-deep">{zar(fee)}</strong> — {siteConfig.delivery.estimate}.</li>
                <li>• <strong className="text-plum-deep">Free delivery</strong> on orders of {zar(freeOver)} or more.</li>
                <li>• Orders are dispatched within 24–48 hours of payment confirmation.</li>
                <li>• You&apos;ll receive order confirmation and tracking updates on WhatsApp / email.</li>
              </ul>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card-luxe flex items-start gap-5 p-7">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush-100 text-rose-deep"><IconRefresh size={22} /></span>
            <div>
              <h2 className="font-display text-xl text-plum-deep">Returns & exchanges</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
                <li>• Beauty products are carefully quality-checked before dispatch.</li>
                <li>• If you receive a wrong or damaged product, contact us within 7 days on WhatsApp with your order number and a photo — we&apos;ll make it right.</li>
                <li>• For hygiene reasons, opened cosmetics can only be returned if faulty.</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-10 text-center">
        <Ornament className="justify-center" />
        <p className="mt-5 text-sm text-ink/75">More questions? Visit the <Link href="/faq" className="text-rose-deep underline underline-offset-2">FAQ</Link> or <Link href="/contact" className="text-rose-deep underline underline-offset-2">contact us</Link>.</p>
      </Reveal>
    </div>
  );
}
