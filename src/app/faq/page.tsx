import type { Metadata } from "next";
import Link from "next/link";
import FaqList from "@/components/faq-list";
import Reveal from "@/components/reveal";
import { LotusMark } from "@/components/icons";
import { whatsappLink } from "@/lib/config";
import { getFaqs } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Zuri Cosmetics FAQ | Lashes, Nails, Delivery & Orders",
  description:
    "Answers to your Zuri Cosmetics questions — lash application & removal, press-on nail sizing & wear, delivery times, payments, orders and returns.",
  alternates: { canonical: "/faq" },
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center sm:px-6">
        <p className="eyebrow flex items-center justify-center gap-3">
          <LotusMark className="h-3 w-6 text-gold/80" />
          Good to know
          <LotusMark className="h-3 w-6 text-gold/80" />
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ink sm:text-7xl">
          Zuri Cosmetics <em className="gold-text italic">FAQ</em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-plum sm:text-base">
          Everything customers ask us most — from lash application to delivery, payments
          and returns.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <Reveal>
          <FaqList faqs={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer, category: f.category }))} />
        </Reveal>
      </section>

      <section className="border-t border-gold/15 bg-blush/50 py-16">
        <Reveal className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Still curious?</h2>
          <p className="mt-3 text-sm leading-relaxed text-plum">
            Our team answers on WhatsApp and email during business hours — usually the
            same day.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-lux btn-blush">
              WhatsApp us
            </a>
            <Link href="/contact" className="btn-lux btn-outline">
              Contact page
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
