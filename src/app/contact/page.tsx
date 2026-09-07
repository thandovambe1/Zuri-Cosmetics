import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import Reveal from "@/components/reveal";
import {
  IconMail,
  IconPhone,
  IconPin,
  IconWhatsApp,
  LotusMark,
} from "@/components/icons";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Zuri Cosmetics | WhatsApp, Email & Order Help",
  description:
    "Get in touch with Zuri Cosmetics — WhatsApp beauty help, order support and product advice. We reply during business hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const cards = [
    {
      icon: IconWhatsApp,
      title: "WhatsApp",
      body: "Fastest for order help & shade advice.",
      action: (
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="link-sweep text-gold-deep"
        >
          Start a chat
        </a>
      ),
      note: siteConfig.whatsappNumberIsPlaceholder
        ? "Number is a configurable placeholder"
        : siteConfig.whatsappNumber,
    },
    {
      icon: IconMail,
      title: "Email",
      body: "For orders, returns and everything else.",
      action: (
        <a href={`mailto:${siteConfig.email}`} className="link-sweep text-gold-deep">
          {siteConfig.email}
        </a>
      ),
      note: siteConfig.emailIsPlaceholder ? "Configurable placeholder address" : undefined,
    },
    {
      icon: IconPhone,
      title: "Business hours",
      body: siteConfig.hours,
      action: <span className="text-plum">Replies during hours</span>,
      note: undefined,
    },
    {
      icon: IconPin,
      title: "Based in",
      body: siteConfig.address,
      action: <span className="text-plum">Online boutique</span>,
      note: undefined,
    },
  ];

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center sm:px-6">
        <p className="eyebrow flex items-center justify-center gap-3">
          <LotusMark className="h-3 w-6 text-gold/80" />
          We’re listening
          <LotusMark className="h-3 w-6 text-gold/80" />
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ink sm:text-7xl">
          Contact <em className="gold-text italic">Zuri Cosmetics</em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-plum sm:text-base">
          Questions about an order, a shade, a size or your lashes at 7am before an
          event? Reach us wherever you are most comfortable.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <div className="card-lux h-full p-6 transition-shadow duration-300 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-white/70 text-gold-deep">
                  <c.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-2xl text-ink">{c.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-plum">{c.body}</p>
                <p className="mt-3 text-[0.72rem] tracking-[0.12em] uppercase">{c.action}</p>
                {c.note && (
                  <p className="mt-2 text-[0.6rem] tracking-[0.14em] text-plum/60 uppercase">
                    {c.note}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mx-auto mt-12 max-w-3xl">
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
