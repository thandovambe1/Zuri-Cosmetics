import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import Reveal from "@/components/reveal";
import { SectionHeading, Ornament } from "@/components/ui";
import { IconMail, IconPhone, IconWhatsApp } from "@/components/icons";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Zuri Cosmetics — We'd Love to Hear From You",
  description: "Contact Zuri Cosmetics on WhatsApp, email or phone. Friendly support for orders, tutorials and product advice.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Hello Zuri Cosmetics")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <Reveal className="text-center">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-3 font-display text-[clamp(2.3rem,5vw,3.8rem)] text-plum-deep">Contact Zuri Cosmetics</h1>
        <p className="mx-auto mt-4 max-w-xl text-[0.98rem] text-ink/80">
          Questions about an order, a tutorial, or which shade suits you best? We&apos;d love to help.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Contact channels */}
        <Reveal>
          <div className="card-luxe p-8">
            <SectionHeading eyebrow="Say hello" title="Reach us directly" />
            <div className="mt-8 space-y-4">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-blush-200 bg-ivory p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                  <IconWhatsApp size={22} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-plum-deep">WhatsApp Business</span>
                  <span className="block text-xs text-ink/70">Fastest — chat with us right now</span>
                </span>
                <span className="ml-auto text-gold">→</span>
              </a>
              <a href={mailto} className="group flex items-center gap-4 rounded-2xl border border-blush-200 bg-ivory p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-light text-gold-deep">
                  <IconMail size={22} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-plum-deep">Email us</span>
                  <span className="block text-xs text-ink/70">{siteConfig.email}</span>
                </span>
                <span className="ml-auto text-gold">→</span>
              </a>
              <a href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`} className="group flex items-center gap-4 rounded-2xl border border-blush-200 bg-ivory p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush-100 text-rose-deep">
                  <IconPhone size={22} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-plum-deep">Call us</span>
                  <span className="block text-xs text-ink/70">{siteConfig.phoneDisplay}</span>
                </span>
                <span className="ml-auto text-gold">→</span>
              </a>
            </div>
            <Ornament className="mt-8" />
            <p className="mt-5 text-xs leading-relaxed text-mauve">
              WhatsApp and email are monitored during business hours — we aim to reply within one
              working day. Include your order number (e.g. ZC-XXXXXX) for the fastest help.
            </p>
          </div>
        </Reveal>

        {/* Quick message via WhatsApp form */}
        <Reveal delay={120}>
          <div className="card-luxe p-8">
            <SectionHeading eyebrow="Quick message" title="Send a message" sub="Compose a quick note — it opens in WhatsApp or your email app with everything ready to send." />
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
