import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout-form";
import { LotusMark } from "@/components/icons";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Zuri Cosmetics order securely. Delivery across South Africa.",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-10">
      <div className="text-center">
        <LotusMark className="mx-auto h-5 w-10 text-gold/80" />
        <h1 className="mt-4 font-display text-5xl text-ink sm:text-6xl">Checkout</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-plum">
          A calm, secure checkout. Your details are used only to fulfil your Zuri
          Cosmetics order.
        </p>
      </div>
      <div className="mt-14">
        <CheckoutForm paymentsConfigured={siteConfig.paymentsConfigured} />
      </div>
    </section>
  );
}
