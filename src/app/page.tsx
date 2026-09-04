import Link from "next/link";
import type { Metadata } from "next";
import { IMG } from "@/lib/media";

export const dynamic = "force-dynamic";
import { getCategories, getProducts, getTutorials } from "@/lib/data";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { SectionHeading, Ornament, CtaLink, Stars } from "@/components/ui";
import NewsletterForm from "@/components/newsletter-form";
import {
  IconArrowRight,
  IconGem,
  IconPlay,
  IconRefresh,
  IconShield,
  IconSparkles,
  IconTruck,
} from "@/components/icons";
import { REVIEW_SEED } from "@/db/seed-data";

export const metadata: Metadata = {
  title: "Zuri Cosmetics — Soft Luxury Beauty | Lashes, Nails & Lip Essentials",
  description:
    "Discover Zuri Cosmetics — a curated collection of premium lashes, press-on nails, nail care and lip essentials designed to elevate your everyday beauty routine. Soft luxury beauty, delivered to your door.",
};

const MARQUEE_WORDS = ["Lashes", "Press-On Nails", "Lip Gloss", "Nail Care", "Lip Liners", "Effortless Beauty"];

export default async function HomePage() {
  const [categories, featured, bestSellers, tutorials] = await Promise.all([
    getCategories(),
    getProducts({ sort: "featured" }),
    getProducts({ sort: "bestselling" }),
    getTutorials(),
  ]);

  const featuredSlice = featured.slice(0, 8);
  const bestSlice = bestSellers.slice(0, 4);
  const tutorialPreview = tutorials.slice(0, 3);

  return (
    <div>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blush-100 blur-3xl"
        />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-lavender/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24 lg:pt-20">
          <div className="anim-fade-up">
            <p className="eyebrow flex items-center gap-2">
              <span className="inline-block h-px w-8 bg-gold/60" /> Soft Luxury Beauty · Premium Cosmetics
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.04] tracking-tight text-plum-deep">
              Beauty, made{" "}
              <span className="relative whitespace-nowrap italic text-gold">
                effortless.
                <svg viewBox="0 0 220 12" className="absolute -bottom-2 left-0 w-full text-rose/60" aria-hidden>
                  <path d="M3 9c40-6 140-8 214-3" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink/85">
              Discover Zuri Cosmetics — a curated collection of lashes, press-on nails and lip
              essentials designed to elevate your everyday beauty routine.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <CtaLink href="/shop" variant="gold" className="!px-9 !py-4">
                Shop Now <IconArrowRight size={15} />
              </CtaLink>
              <CtaLink href="#shop-zuri" variant="outline" className="!px-9 !py-4">
                Explore Collection
              </CtaLink>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-blush-200 pt-6 text-center">
              {[
                { k: "Free delivery", v: "over R 1,200" },
                { k: "Delivery", v: "2–5 working days" },
                { k: "Checkout", v: "Secure & simple" },
              ].map((s) => (
                <div key={s.k}>
                  <p className="font-display text-[0.95rem] text-plum-deep">{s.v}</p>
                  <p className="mt-1 text-[0.66rem] uppercase tracking-[0.18em] text-mauve">{s.k}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero collage */}
          <div className="anim-fade-up relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: "150ms" }}>
            <div className="relative overflow-hidden rounded-[2rem] border border-blush-200/80 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG.lashHeroEyes}
                alt="Applying Zuri Cosmetics lashes with precision tongs"
                className="aspect-[4/4.6] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/20 via-transparent to-transparent" />
            </div>

            {/* floating mini card */}
            <div className="anim-float absolute -bottom-8 -left-4 w-40 rounded-2xl border border-blush-200 bg-ivory/95 p-3 shadow-lift backdrop-blur sm:-left-10 sm:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.lipGlossApp} alt="High-shine Zuri lip gloss" className="aspect-square w-full rounded-xl object-cover" />
              <p className="mt-2 text-center text-[0.7rem] font-medium uppercase tracking-[0.16em] text-plum">Lip Gloss · Glossy</p>
            </div>
            <div className="absolute -right-3 top-8 rounded-full bg-gold/95 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ivory shadow-glow sm:-right-5">
              ✨ Zuri Edit
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative border-y border-blush-200/80 bg-ivory/60 py-4 backdrop-blur">
          <div className="flex overflow-hidden" aria-hidden>
            <div className="flex w-max items-center gap-8 pr-8" style={{ animation: "marquee 30s linear infinite" }}>
              {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
                <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                  <span className="font-display text-lg italic text-plum-deep/90">{w}</span>
                  <span className="text-[0.65rem] text-gold">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── SHOP ZURI COSMETICS ─────────────────────── */}
      <section id="shop-zuri" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <SectionHeading
            center
            eyebrow="The Collections"
            title="Shop Zuri Cosmetics"
            sub="Three thoughtfully curated collections — lashes, nails and lip essentials — designed to make beautiful, premium beauty effortless at home."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 120}>
              <Link href={`/${cat.slug}`} className="group relative block overflow-hidden rounded-[1.8rem] shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image ?? IMG.pastelProducts}
                    alt={`${cat.name} collection — Zuri Cosmetics`}
                    className="img-zoom h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/70 via-plum-deep/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-6 text-center">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-champagne">Collection</p>
                  <h3 className="font-display text-3xl text-ivory">{cat.name}</h3>
                  <span className="btn btn-gold !px-6 !py-2.5 !text-[0.65rem] opacity-95 transition-transform duration-300 group-hover:scale-105">
                    Shop {cat.name}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── FEATURED PRODUCTS ───────────────────────── */}
      <section className="bg-gradient-to-b from-ivory to-blush-50/80 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Handpicked for you" title="Featured Products" sub="The Zuri favourites our community reaches for again and again." />
            <CtaLink href="/shop" variant="ghost" className="!px-6 !py-3">
              View all products <IconArrowRight size={14} />
            </CtaLink>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featuredSlice.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 90}>
                <ProductCard product={p} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── ABOUT BAND ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative order-2 lg:order-1">
            <div className="absolute -left-6 -top-6 h-full w-full rounded-[2rem] border border-gold/30" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.aboutPortrait} alt="Applying makeup for an effortless Zuri Cosmetics look" className="aspect-[4/4.4] w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden w-56 rounded-2xl bg-ivory p-4 shadow-lift sm:block">
              <p className="font-display text-2xl text-gold-deep">ZURI ✦</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/75">
                Premium beauty made accessible, convenient and easy to use at home.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <p className="eyebrow">The Zuri Philosophy</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.12] text-plum-deep">
              A modern beauty brand for <em className="text-gold">effortless confidence.</em>
            </h2>
            <p className="mt-5 leading-relaxed text-ink/85">
              Zuri Cosmetics is a modern beauty brand focused on making beautiful, premium beauty
              products accessible, convenient and easy to use at home. From fluttery lashes to
              salon-inspired nails and glossy lips — we design for the way you actually live.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                "Premium quality, thoughtfully curated collections",
                "Designed for effortless at-home application",
                "Soft luxury aesthetics you'll want to reach for daily",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[0.95rem] text-ink/85">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-light text-gold-deep">
                    <IconSparkles size={13} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <CtaLink href="/about" variant="plum" className="mt-9">
              About Zuri Cosmetics <IconArrowRight size={15} />
            </CtaLink>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── BEST SELLERS ───────────────────────── */}
      <section className="bg-gradient-to-b from-blush-50/80 to-ivory py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Loved by the Zuri community" title="Best Sellers" sub="Sample reviews shown during development — real customer reviews arrive with every order." />
            <CtaLink href="/lashes" variant="ghost" className="!px-6 !py-3">
              Shop Lashes <IconArrowRight size={14} />
            </CtaLink>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {bestSlice.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── TUTORIALS TEASER ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Learn with Zuri"
            title="Zuri Beauty Tutorials"
            sub="Lash application, press-on nail application and expert tips — beautiful results, guided step by step."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tutorialPreview.map((t, i) => (
            <Reveal key={t.id} delay={i * 120}>
              <Link href="/tutorials" className="group block">
                <div className="relative overflow-hidden rounded-[1.6rem] shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.poster ?? IMG.aboutFlatlay} alt={t.title} className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-plum-deep/25 transition group-hover:bg-plum-deep/10" />
                  <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory/95 pl-0.5 text-plum shadow-lift transition-transform duration-300 group-hover:scale-110">
                    <IconPlay size={19} />
                  </span>
                  <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-plum backdrop-blur">
                    {t.category}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl text-plum-deep transition-colors group-hover:text-rose-deep">{t.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink/70">{t.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <CtaLink href="/tutorials" variant="outline">
            Watch All Tutorials <IconPlay size={14} />
          </CtaLink>
        </Reveal>
      </section>

      {/* ───────────────────────── WHY SHOP WITH ZURI ───────────────────────── */}
      <section className="bg-gradient-to-b from-lavender/40 via-blush-50 to-cream py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading center eyebrow="The Zuri promise" title="Why Shop With Zuri Cosmetics" />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <IconGem size={22} />, t: "Curated Premium Edit", d: "Every product is chosen for premium quality, soft luxury aesthetics and real everyday wear." },
              { icon: <IconTruck size={22} />, t: "Effortless Delivery", d: "Tracked delivery across South Africa in 2–5 working days, with free delivery over R 1,200." },
              { icon: <IconShield size={22} />, t: "Secure & Private", d: "Secure checkout, protected data and never any sensitive card details stored by us." },
              { icon: <IconRefresh size={22} />, t: "Friendly Human Support", d: "Questions? Chat with the Zuri team directly on WhatsApp — we reply fast." },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 90}>
                <div className="card-luxe group h-full p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blush-100 to-champagne/60 text-gold-deep transition-transform duration-500 group-hover:scale-110">
                    {f.icon}
                  </span>
                  <h3 className="mt-5 font-display text-lg text-plum-deep">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CUSTOMER REVIEWS ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Kind words"
            title="What Our Community Says"
            sub="Sample content shown during development — real verified reviews appear as customers shop."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEW_SEED.slice(0, 3).map((r, i) => (
            <Reveal key={r.title} delay={i * 110}>
              <figure className="card-luxe flex h-full flex-col gap-4 p-7">
                <div className="flex items-center justify-between">
                  <Stars value={r.rating} />
                  <span className="rounded-full bg-blush-100 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-rose-deep">
                    Sample
                  </span>
                </div>
                <blockquote className="text-[0.95rem] leading-relaxed text-ink/85">“{r.content}”</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-blush-100 pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose to-mauve font-display text-sm text-ivory">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-plum-deep">{r.name}</p>
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-mauve">Verified shopper</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── NEWSLETTER ───────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blush-100 via-champagne/50 to-lavender/60" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <Ornament className="justify-center" />
            <h2 className="mt-6 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.12] text-plum-deep">
              A little more beauty in your inbox.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-ink/80">
              Subscribe for new product drops, exclusive offers, beauty tips and special
              promotions from Zuri Cosmetics.
            </p>
            <NewsletterForm className="mx-auto mt-8" />
            <p className="mt-3 text-[0.7rem] text-mauve">No spam, ever. Unsubscribe anytime.</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
