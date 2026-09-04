import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions — Zuri Cosmetics",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] text-plum-deep">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-mauve">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-[0.95rem] leading-relaxed text-ink/80">
        <section>
          <h2 className="font-display text-xl text-plum-deep">1. Orders & payment</h2>
          <p className="mt-2">
            By placing an order with {siteConfig.legalName} you agree to pay the total shown at checkout.
            Orders are confirmed once received; payment is confirmed separately. We never mark an order
            as paid unless payment has actually been received.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-plum-deep">2. Pricing & stock</h2>
          <p className="mt-2">
            Prices are shown in South African Rand and may change without notice. We do our best to keep
            stock accurate, but occasionally an item sells out between order and dispatch — we&apos;ll
            contact you promptly in that case.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-plum-deep">3. Delivery</h2>
          <p className="mt-2">
            Delivery times are estimates, not guarantees. See our Shipping & Returns page for details.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-plum-deep">4. Beauty products & usage</h2>
          <p className="mt-2">
            Cosmetics are for external use. If irritation occurs, discontinue use. Always patch-test and
            follow the application guides in our tutorials.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-plum-deep">5. Contact</h2>
          <p className="mt-2">
            Questions about these terms? Email <a href={`mailto:${siteConfig.email}`} className="text-rose-deep underline underline-offset-2">{siteConfig.email}</a>.
          </p>
        </section>
      </div>
      <p className="mt-8">
        <Link href="/" className="text-sm text-gold-deep underline underline-offset-2">← Back to Zuri Cosmetics</Link>
      </p>
    </div>
  );
}
