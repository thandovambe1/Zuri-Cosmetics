import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LotusMark } from "@/components/icons";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

interface PolicyContent {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

const POLICIES: Record<string, PolicyContent> = {
  shipping: {
    title: "Shipping & Delivery",
    intro: `Zuri Cosmetics delivers across South Africa. Our current estimate is ${siteConfig.deliveryEstimate}. Delivery fees and free-delivery thresholds are configured in site settings and shown clearly at checkout before you pay.`,
    sections: [
      {
        heading: "Delivery fees",
        body: `A flat delivery fee of R${siteConfig.deliveryFee.toFixed(2)} applies to orders under R${siteConfig.freeDeliveryOver.toFixed(2)}. Orders over that value qualify for free delivery. Final costs are always displayed in your bag and at checkout.`,
      },
      {
        heading: "Order tracking",
        body: "Every order receives a unique Zuri order number on confirmation. Use the Account & Order Tracking page with your order number and email to see live status from Pending through to Delivered.",
      },
      {
        heading: "Delays",
        body: "If your order is delayed beyond the estimate, message us on WhatsApp or email with your order number and we will follow it up personally.",
      },
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    intro:
      "We want you to love every Zuri piece. If something arrives damaged, incorrect or not as described, we will make it right.",
    sections: [
      {
        heading: "Wrong or damaged product",
        body: "Message us on WhatsApp or email with your order number and a photo within the returns window stated on your confirmation. We will arrange a replacement or resolution as quickly as possible.",
      },
      {
        heading: "Hygiene & safety",
        body: "For hygiene reasons, lashes, lip products and nail sets can only be returned unused and sealed in their original packaging, unless the item arrived faulty or incorrect.",
      },
      {
        heading: "How to start a return",
        body: "Contact us with your order number — our team guides you through every step. Refunds or exchanges are processed once the returned item is received and checked.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "Your privacy matters to Zuri Cosmetics. This summary explains what we collect and why. The full policy document will be published here once finalised.",
    sections: [
      {
        heading: "What we collect",
        body: "Only what we need: your name, contact details and delivery address when you order; your email if you subscribe; and messages you send us. We never collect or store card or payment details on our servers.",
      },
      {
        heading: "How we use it",
        body: "To fulfil orders, provide support, and — only if you subscribe — send the Zuri Beauty List. We do not sell your personal information.",
      },
      {
        heading: "Your rights",
        body: "You may request a copy, correction or deletion of your personal information at any time by contacting us. Newsletter emails always include a way to unsubscribe once our mailing service is live.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro:
      "These terms govern your use of the Zuri Cosmetics website and your orders. The full legal document will be published here once finalised.",
    sections: [
      {
        heading: "Orders & payment",
        body: "Orders are confirmed with a unique order number. Until online payments are enabled, orders are recorded as Pending Payment and our team confirms a secure payment method with you directly. Prices are displayed in South African Rand and are configurable by Zuri Cosmetics.",
      },
      {
        heading: "Product information",
        body: "We describe every product as accurately as we can. Shade appearance may vary slightly between screens. Ingredient listings are published on packaging and product pages as confirmed by our suppliers.",
      },
      {
        heading: "Website use",
        body: "You agree to use this website lawfully. All content, branding and the Zuri Cosmetics name and logo are the property of Zuri Cosmetics.",
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) return { title: "Not found" };
  return { title: policy.title, description: policy.intro };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <section className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6">
      <p className="eyebrow flex items-center justify-center gap-3">
        <LotusMark className="h-3 w-6 text-gold/80" />
        Zuri Cosmetics
        <LotusMark className="h-3 w-6 text-gold/80" />
      </p>
      <h1 className="mt-5 text-center font-display text-5xl text-ink sm:text-6xl">
        {policy.title}
      </h1>
      <p className="mt-6 text-center text-sm leading-relaxed text-plum">{policy.intro}</p>

      <div className="mt-12 space-y-8">
        {policy.sections.map((s) => (
          <div key={s.heading} className="card-lux p-7 sm:p-8">
            <h2 className="font-display text-2xl text-ink">{s.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-plum">{s.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-[0.68rem] leading-relaxed text-plum/80">
        Questions?{" "}
        <Link href="/contact" className="link-sweep text-gold-deep">
          Contact Zuri Cosmetics
        </Link>{" "}
        — policy details are configurable and will be updated as the brand grows.
      </p>
    </section>
  );
}
