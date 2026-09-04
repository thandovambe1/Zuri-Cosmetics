import Link from "next/link";
import type { Metadata } from "next";
import { FAQ_ITEMS, siteConfig } from "@/lib/site-config";
import Reveal from "@/components/reveal";
import { Ornament } from "@/components/ui";
import { IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Zuri Cosmetics FAQ — Help & Answers",
  description:
    "Answers to common questions about Zuri Cosmetics: applying and removing lashes, press-on nail sizing and removal, delivery, payments, order changes and more.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
        <Link href="/" className="hover:text-rose-deep">Home</Link>
        <span className="mx-2 text-gold">/</span>
        <span className="text-plum">FAQ</span>
      </nav>

      <Reveal className="mt-6 text-center">
        <p className="eyebrow">Help centre</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] text-plum-deep">Zuri Cosmetics FAQ</h1>
        <p className="mx-auto mt-4 max-w-xl text-[0.95rem] text-ink/75">
          Everything you need to know about your Zuri favourites. Can&apos;t find an answer? We&apos;re
          one message away on WhatsApp.
        </p>
      </Reveal>

      <div className="mt-12 space-y-4">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.q} delay={Math.min(i * 50, 300)}>
            <details className="group card-luxe overflow-hidden bg-ivory">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-lg text-plum-deep transition-colors [&::-webkit-details-marker]:hidden hover:text-rose-deep">
                {item.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="border-t border-blush-100 px-6 py-5 text-[0.95rem] leading-relaxed text-ink/80">
                {item.a}
              </div>
            </details>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 text-center">
        <Ornament className="justify-center" />
        <h2 className="mt-6 font-display text-2xl text-plum-deep">Still have questions?</h2>
        <p className="mt-2 text-sm text-ink/75">The Zuri team is happy to help with orders, tutorials and product advice.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-plum">
            <IconWhatsApp size={16} /> Chat on WhatsApp
          </a>
          <Link href="/contact" className="btn btn-outline">
            Contact page
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
