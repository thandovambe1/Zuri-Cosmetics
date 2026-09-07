import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import ProductCard from "@/components/product-card";
import Newsletter from "@/components/newsletter";
import VideoPlayer from "@/components/video-player";
import Stars from "@/components/stars";
import {
  getCategories,
  getHomeReviews,
  listProducts,
  getTutorials,
} from "@/lib/queries";
import { siteConfig, whatsappLink } from "@/lib/config";
import {
  IconArrowRight,
  IconDrop,
  IconLock,
  IconPlay,
  IconTruck,
  IconWhatsApp,
  LotusMark,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Zuri Cosmetics — Beauty, Made Effortless | Lashes, Press-On Nails & Lip Gloss",
  description:
    "Discover Zuri Cosmetics — a curated collection of lashes, press-on nails and lip essentials designed to elevate your everyday beauty routine.",
  alternates: { canonical: "/" },
};

const HERO_MAIN = "/images/hero-lashes.jpg";
const HERO_LIPS = "/images/hero-lips.jpg";
const HERO_NAILS = "/images/cat-nails.jpg";
const ABOUT_IMG = "/images/cat-lipgloss.jpg";
const ABOUT_IMG2 = "/images/cat-lashes.jpg";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  /*
    Categories & products are critical — if they genuinely fail, the error
    surfaces to the branded error boundary (app/error.tsx) and is logged.
    Reviews & tutorials are NON-critical: a failure there is logged
    server-side but must never take the whole homepage down.
  */
  const [categories, featured, bestSellers, reviews, tutorials] = await Promise.all([
    getCategories(),
    listProducts({ sort: "featured" }),
    listProducts({ sort: "best" }),
    getHomeReviews(3).catch((error) => {
      console.error(
        "[zuri] Non-critical: homepage reviews failed to load:",
        error instanceof Error ? error.message : error
      );
      return [];
    }),
    getTutorials().catch((error) => {
      console.error(
        "[zuri] Non-critical: homepage tutorials failed to load:",
        error instanceof Error ? error.message : error
      );
      return [];
    }),
  ]);

  const featuredProducts = featured.filter((p) => p.featured).slice(0, 4);
  const bestProducts = bestSellers.filter((p) => p.bestSeller).slice(0, 4);
  const teaserTutorials = tutorials.slice(0, 2);

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60rem 40rem at 85% 10%, rgba(231,225,241,0.75), transparent 60%), radial-gradient(50rem 36rem at 8% 85%, rgba(246,231,227,0.9), transparent 62%), radial-gradient(30rem 22rem at 55% 45%, rgba(241,228,208,0.5), transparent 65%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-10 lg:pt-20 lg:pb-28">
          <div className="relative">
            <p className="eyebrow flex items-center gap-3">
              <LotusMark className="h-3.5 w-7 text-gold" />
              Zuri Cosmetics · Soft Luxury Beauty
            </p>
            <h1 className="mt-6 font-display text-[3.4rem] leading-[0.95] text-ink sm:text-[4.6rem] lg:text-[5.4rem]">
              <span className="line-mask" style={{ ["--line-delay" as string]: "80ms" }}>
                <span>Beauty,</span>
              </span>
              <span className="line-mask" style={{ ["--line-delay" as string]: "220ms" }}>
                <span>
                  made <em className="gold-text italic">effortless.</em>
                </span>
              </span>
            </h1>
            <Reveal delay={500}>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-plum sm:text-lg">
                Discover Zuri Cosmetics — a curated collection of lashes, press-on nails
                and lip essentials designed to elevate your everyday beauty routine.
              </p>
            </Reveal>
            <Reveal delay={650} className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/shop" className="btn-lux btn-blush">
                Shop now
              </Link>
              <Link href="/#categories" className="btn-lux btn-outline">
                Explore collection
              </Link>
            </Reveal>
            <Reveal delay={800} className="mt-12 grid max-w-lg grid-cols-3 gap-4">
              {[
                { icon: IconTruck, label: siteConfig.deliveryEstimate },
                { icon: IconLock, label: "Secure checkout & payments" },
                { icon: IconWhatsApp, label: "WhatsApp beauty help" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-start gap-2">
                  <t.icon className="h-5 w-5 text-gold-deep" />
                  <span className="text-[0.66rem] leading-snug tracking-[0.14em] text-plum uppercase">
                    {t.label}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Collage */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden
              className="absolute -top-10 -right-6 h-40 w-40 animate-spin-slow rounded-full border border-dashed border-gold/40"
            />
            <div
              aria-hidden
              className="absolute -bottom-12 -left-8 h-56 w-56 rounded-full bg-lavender/50 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-gold/25 shadow-lift">
              <img
                src={HERO_MAIN}
                alt="Black South African woman wearing dramatic Zuri Cosmetics lashes and soft glam makeup"
                className="aspect-[4/5] w-full animate-kenburns object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-6 pt-16">
                <p className="font-display text-2xl text-cream italic">The lash ritual</p>
                <p className="mt-1 text-[0.65rem] tracking-[0.28em] text-cream/80 uppercase">
                  Clusters · Strips · Glue · Tongs
                </p>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 w-32 animate-floaty overflow-hidden rounded-[1.4rem] border border-gold/30 shadow-lift sm:w-40">
              <img
                src={HERO_LIPS}
                alt="Coloured South African woman wearing high-shine Zuri Cosmetics lip gloss"
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="absolute -right-4 -bottom-8 w-32 animate-floaty-slow overflow-hidden rounded-[1.4rem] border border-gold/30 shadow-lift sm:w-44">
              <img
                src={HERO_NAILS}
                alt="Hands wearing Zuri Cosmetics pastel press-on nails"
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ SHOP ZURI COSMETICS ---------------------- */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="The Collections"
            title="Shop Zuri Cosmetics"
            description="Three edits, one philosophy — premium beauty that fits into your life, not the other way around."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 120}>
              <Link
                href={`/${cat.slug}`}
                className="group relative block overflow-hidden rounded-[1.6rem] border border-mauve/20 shadow-soft transition-shadow duration-500 hover:shadow-lift"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={cat.image ?? ""}
                    alt={`${cat.name} collection by Zuri Cosmetics`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <LotusMark className="h-4 w-8 text-gold-soft" />
                  <h3 className="mt-3 font-display text-4xl text-cream">{cat.name}</h3>
                  <p className="mt-2 text-sm text-cream/85 italic">{cat.tagline}</p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-cream/40 px-5 py-2.5 text-[0.62rem] font-medium tracking-[0.26em] text-cream uppercase transition-all duration-300 group-hover:border-gold-soft group-hover:bg-gold-soft group-hover:text-ink">
                    Shop {cat.name}
                    <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------- FEATURED ------------------------------ */}
      <section className="border-y border-gold/15 bg-shell/70 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                align="left"
                eyebrow="Hand-picked"
                title={
                  <>
                    Featured <em className="gold-text italic">pieces</em>
                  </>
                }
              />
              <Link href="/shop" className="btn-lux btn-outline">
                View all products
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
            {featuredProducts.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- ABOUT ------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative lg:sticky lg:top-32 lg:self-start">
            <Reveal className="overflow-hidden rounded-[2rem] border border-gold/25 shadow-lift">
              <img
                src={ABOUT_IMG}
                alt="Black South African woman wearing glossy Zuri Cosmetics lip gloss"
                loading="lazy"
                className="aspect-[5/4] w-full object-cover transition-transform duration-[1.6s] hover:scale-105"
              />
            </Reveal>
            <Reveal
              delay={200}
              className="absolute -right-4 -bottom-10 w-40 overflow-hidden rounded-[1.4rem] border border-gold/30 shadow-lift sm:w-52"
            >
              <img
                src={ABOUT_IMG2}
                alt="Mixed race South African woman wearing fluttery Zuri Cosmetics lashes"
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </Reveal>
          </div>
          <div className="lg:pt-10">
            <Reveal>
              <p className="eyebrow">About Zuri Cosmetics</p>
              <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
                A modern beauty brand for{" "}
                <em className="gold-text italic">everyday elegance</em>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 text-base leading-relaxed text-plum">
                Zuri Cosmetics is focused on making beautiful, premium beauty products
                accessible, convenient and easy to use at home. Every piece of the
                collection — from feather-light lashes to salon-inspired press-ons and
                high-shine gloss — is chosen to help you feel confident, expressive and
                effortlessly put together.
              </p>
              <p className="mt-4 text-base leading-relaxed text-plum">
                Beauty should not require an appointment, an expert or hours of your day.
                It should feel like a soft ritual: a few considered products, a little
                guidance, and results that look like you — only more so.
              </p>
            </Reveal>
            <Reveal delay={250} className="mt-9 space-y-5">
              {[
                ["Beauty", "Curated edits that work together, never clutter."],
                ["Confidence", "Looks that feel like you, only elevated."],
                ["Convenience", "Salon results from the comfort of home."],
                ["Self-expression", "Shades and styles for every mood."],
              ].map(([title, copy]) => (
                <div key={title} className="flex gap-5 border-b border-gold/15 pb-5">
                  <span className="mt-1 font-display text-2xl text-gold italic">
                    {title.charAt(0)}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-ink">{title}</h3>
                    <p className="mt-1 text-sm text-plum">{copy}</p>
                  </div>
                </div>
              ))}
            </Reveal>
            <Reveal delay={350} className="mt-9">
              <Link href="/about" className="btn-lux btn-solid">
                Our philosophy
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------- BEST SELLERS --------------------------- */}
      <section className="border-y border-gold/15 bg-blush/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="Loved by the Zuri community"
              title="Best sellers"
              description="The pieces our customers reach for again and again."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
            {bestProducts.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- TUTORIALS ----------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Zuri Beauty Tutorials"
            title="Learn the ritual, love the result"
            description="Short, beautiful video guides for lashes and press-on nails — from prep to removal."
          />
        </Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {teaserTutorials.map((t, i) => (
            <Reveal key={t.id} delay={i * 140}>
              <div className="group">
                <VideoPlayer src={t.videoUrl} poster={t.posterUrl} title={t.title} />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow !text-[0.6rem]">
                      {t.category === "lashes" ? "Lash application" : "Press-on nails"}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-ink">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-plum">{t.description}</p>
                  </div>
                  <Link
                    href="/tutorials"
                    aria-label={`Watch ${t.title} and more tutorials`}
                    className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-deep transition-all duration-300 group-hover:bg-gold group-hover:text-white"
                  >
                    <IconPlay className="ml-0.5 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href="/tutorials" className="btn-lux btn-outline">
            All tutorials
          </Link>
        </Reveal>
      </section>

      {/* ------------------------- WHY SHOP ZURI --------------------------- */}
      <section className="border-y border-gold/15 bg-shell/70 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
          {[
            {
              icon: IconDrop,
              title: "Effortless routines",
              copy: "Considered products that simplify your beauty ritual, not complicate it.",
            },
            {
              icon: IconTruck,
              title: "Delivered to you",
              copy: `${siteConfig.deliveryEstimate}. Tracked from our door to yours.`,
            },
            {
              icon: IconLock,
              title: "Secure checkout",
              copy: "Your details stay yours. Card data is never stored on our servers.",
            },
            {
              icon: IconWhatsApp,
              title: "Real human help",
              copy: "Message us on WhatsApp for shade advice, orders and application help.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100} className="group text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/35 bg-white/70 text-gold-deep transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-glow">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-ink">{item.title}</h3>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-plum">
                {item.copy}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------- REVIEWS ------------------------------ */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Customer reviews"
            title="In their words"
            description="Reviews are submitted by customers and published after moderation."
          />
        </Reveal>
        {reviews.length === 0 ? (
          <Reveal className="mx-auto mt-10 max-w-md rounded-[1.4rem] border border-dashed border-mauve/40 bg-white/50 p-10 text-center">
            <LotusMark className="mx-auto h-5 w-10 text-gold/70" />
            <p className="mt-4 font-display text-2xl text-ink">No reviews yet</p>
            <p className="mt-2 text-sm text-plum">
              Be the first to share your Zuri experience — reviews open on every product page.
            </p>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 120}>
                <figure className="card-lux relative h-full p-7">
                  <span
                    aria-hidden
                    className="absolute -top-4 left-6 font-display text-7xl text-gold/30 italic"
                  >
                    “
                  </span>
                  <Stars average={r.rating} />
                  <blockquote className="mt-4 text-sm leading-relaxed text-cocoa">
                    {r.body}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-gold/15 pt-4">
                    {r.avatar && (
                      <img
                        src={r.avatar}
                        alt={`${r.authorName}, Zuri Cosmetics customer`}
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-full border border-gold/30 object-cover"
                      />
                    )}
                    <div>
                      <p className="font-display text-lg text-ink">
                        {r.authorName}
                        {r.location ? (
                          <span className="text-plum">, {r.location}</span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[0.66rem] tracking-[0.18em] text-plum uppercase">
                        on{" "}
                        <Link href={`/product/${r.productSlug}`} className="link-sweep">
                          {r.productName}
                        </Link>
                      </p>
                      {r.isSample && (
                        <span className="mt-2 inline-block rounded-full bg-lavender px-3 py-1 text-[0.58rem] font-medium tracking-[0.2em] text-plum uppercase">
                          Sample content
                        </span>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* --------------------------- NEWSLETTER ---------------------------- */}
      <section id="subscribe" className="scroll-mt-28 px-4 pb-24 sm:px-6 lg:px-10">
        <Reveal className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-blush via-champagne/70 to-lavender px-6 py-16 shadow-soft sm:px-14">
            <LotusMark
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-8 h-40 w-72 text-gold/10"
            />
            <Newsletter />
          </div>
        </Reveal>
      </section>

      {/* -------------------------- WHATSAPP CTA --------------------------- */}
      <section className="border-t border-gold/15 bg-lavender/40 py-16">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift">
            <IconWhatsApp className="h-7 w-7" />
          </span>
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            Prefer to chat? <em className="gold-text italic">We’re here.</em>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-plum">
            Questions about shades, sizing, orders or application? Message Zuri Cosmetics
            on WhatsApp — {siteConfig.deliveryEstimate.toLowerCase()} support, with a real
            human on the other side.
          </p>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-lux btn-solid">
            <IconWhatsApp className="h-4 w-4" />
            Chat on WhatsApp
          </a>
          <p className="text-[0.62rem] tracking-[0.2em] text-plum/70 uppercase">
            Replies during business hours · Browsing is always free
          </p>
        </Reveal>
      </section>
    </>
  );
}
