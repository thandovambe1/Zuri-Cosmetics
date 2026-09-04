import Link from "next/link";
import type { Metadata } from "next";
import { IMG } from "@/lib/media";
import Reveal from "@/components/reveal";
import { SectionHeading, Ornament, CtaLink } from "@/components/ui";
import { IconGem, IconHeart, IconSparkles } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Zuri Cosmetics — Soft Luxury Beauty",
  description:
    "Zuri Cosmetics is a modern beauty brand making beautiful, premium beauty products accessible, convenient and easy to use at home — lashes, press-on nails, nail care and lip essentials.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: <IconGem size={22} />,
    title: "Luxury, made accessible",
    text: "Premium beauty should never feel out of reach. We design refined, high-quality products that make salon-inspired results achievable at home.",
  },
  {
    icon: <IconHeart size={22} />,
    title: "Confidence, made effortless",
    text: "Beautiful lashes, nails and lips in minutes — so you can show up feeling polished, without the fuss.",
  },
  {
    icon: <IconSparkles size={22} />,
    title: "Beauty, made for you",
    text: "Self-expression is personal. That's why our collections offer choice — shades, styles and tools that flex around your routine.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h1 className="mt-3 font-display text-[clamp(2.3rem,5vw,3.9rem)] leading-[1.06] text-plum-deep">
              About <span className="italic text-gold">Zuri Cosmetics</span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-ink/85">
              Zuri Cosmetics is a modern beauty brand focused on making beautiful, premium beauty
              products accessible, convenient and easy to use at home. From fluttery cluster lashes
              to salon-inspired press-on nails and high-shine lip essentials, every Zuri product is
              designed for effortless beauty — soft luxury you can reach for every day.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-ink/80">
              We believe beauty should feel like confidence, not chore. That&apos;s why we obsess
              over quality, ease of application and the little details that make a product feel
              genuinely premium.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <CtaLink href="/shop" variant="gold">
                Shop the Collection
              </CtaLink>
              <CtaLink href="/tutorials" variant="outline">
                Watch Tutorials
              </CtaLink>
            </div>
          </Reveal>
          <Reveal delay={120} className="relative">
            <div className="absolute -right-5 -top-5 h-full w-full rounded-[2rem] bg-gradient-to-br from-champagne/60 to-blush-100" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.glamPortrait} alt="Effortless beauty with Zuri Cosmetics" className="aspect-[4/4.6] w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 left-6 rounded-2xl border border-blush-200 bg-ivory/95 px-5 py-4 shadow-soft backdrop-blur">
              <p className="font-display text-2xl text-plum-deep">ZURI <span className="text-gold">✦</span></p>
              <p className="text-xs uppercase tracking-[0.18em] text-mauve">Soft Luxury Beauty</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gradient-to-b from-blush-50/80 to-ivory py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading center eyebrow="What we stand for" title="Beauty, confidence, convenience" />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="card-luxe group h-full p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blush-100 to-champagne/70 text-gold-deep transition-transform duration-500 group-hover:scale-110">
                    {v.icon}
                  </span>
                  <h2 className="mt-5 font-display text-xl text-plum-deep">{v.title}</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/75">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Image band */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.aboutFlatlay} alt="Zuri Cosmetics soft-luxury beauty products" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <p className="eyebrow">The Zuri edit</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.12] text-plum-deep">
              Three collections. One effortless ritual.
            </h2>
            <div className="mt-7 space-y-5">
              {[
                { t: "Zuri Lashes", d: "Cluster & strip lashes with complete kits — your perfect lash look, made effortless.", href: "/lashes" },
                { t: "Zuri Nails", d: "Acrylic & gel press-ons plus the full nail-care ritual — salon-inspired, from home.", href: "/nails" },
                { t: "Zuri LipGloss", d: "High-shine glosses and defining liners — gloss your way, in shades made for you.", href: "/lipgloss" },
              ].map((c) => (
                <div key={c.t} className="flex items-start gap-4">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  <div>
                    <Link href={c.href} className="font-display text-lg text-plum-deep transition-colors hover:text-rose-deep">
                      {c.t} →
                    </Link>
                    <p className="mt-1 text-sm leading-relaxed text-ink/75">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Ornament className="mt-9" />
            <p className="mt-6 text-sm leading-relaxed text-mauve">
              The Zuri team is growing every day. Detailed company information, founder stories and
              certifications will be added here as they become available.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
