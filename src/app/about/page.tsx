import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/reveal";
import { IconDrop, IconLashFan, IconSparkle, LotusMark } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Zuri Cosmetics | Soft Luxury Beauty, Made Effortless",
  description:
    "Zuri Cosmetics is a modern beauty brand focused on making beautiful, premium beauty products accessible, convenient and easy to use at home.",
  alternates: { canonical: "/about" },
};

const IMG_A = "/images/hero-lashes.jpg";
const IMG_B = "/images/hero-lips.jpg";
const IMG_C = "/images/cat-nails.jpg";

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50rem 34rem at 80% 15%, rgba(243,219,217,0.8), transparent 60%), radial-gradient(44rem 30rem at 10% 80%, rgba(231,225,241,0.7), transparent 62%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-14 text-center sm:px-6 lg:pt-24">
          <p className="eyebrow flex items-center justify-center gap-3">
            <LotusMark className="h-3 w-6 text-gold/80" />
            Our philosophy
            <LotusMark className="h-3 w-6 text-gold/80" />
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ink sm:text-7xl">
            Beauty should feel like{" "}
            <em className="gold-text italic">a soft ritual</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-plum">
            Zuri Cosmetics is a modern beauty brand focused on making beautiful, premium
            beauty products accessible, convenient and easy to use at home.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-gold/25 shadow-lift">
              <img
                src={IMG_A}
                alt="Black South African woman wearing dramatic Zuri Cosmetics lashes"
                className="aspect-[5/4] w-full object-cover transition-transform duration-[1.6s] hover:scale-105"
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <div className="overflow-hidden rounded-[1.4rem] border border-gold/25 shadow-soft">
                <img
                  src={IMG_B}
                  alt="Coloured South African woman wearing Zuri Cosmetics lip gloss"
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-[1.4s] hover:scale-105"
                />
              </div>
              <div className="overflow-hidden rounded-[1.4rem] border border-gold/25 shadow-soft">
                <img
                  src={IMG_C}
                  alt="White South African woman's hands wearing Zuri Cosmetics press-on nails"
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-[1.4s] hover:scale-105"
                />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-display text-4xl leading-[1.08] text-ink sm:text-5xl">
                Premium beauty, <em className="gold-text italic">without the fuss</em>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-base leading-relaxed text-plum">
                We believe beautiful beauty should not be complicated. Zuri Cosmetics
                exists to make premium lashes, salon-inspired nails and glossy lips
                simple enough for a Tuesday morning and special enough for a Saturday
                night.
              </p>
              <p className="mt-4 text-base leading-relaxed text-plum">
                Every collection is curated with one question in mind: does this make
                beauty easier, softer and more joyful? If the answer is yes, it earns a
                place in the Zuri edit.
              </p>
            </Reveal>

            <Reveal delay={220} className="mt-10 space-y-7">
              {[
                {
                  icon: IconLashFan,
                  title: "Beauty",
                  copy: "Considered products in soft-luxury shades — curated, never cluttered.",
                },
                {
                  icon: IconSparkle,
                  title: "Confidence & self-expression",
                  copy: "Looks that feel like you: subtle, bold, or anywhere in between.",
                },
                {
                  icon: IconDrop,
                  title: "Convenience & luxury",
                  copy: "Salon-quality results at home, with guidance every step of the way.",
                },
              ].map((v) => (
                <div key={v.title} className="flex gap-5 border-b border-gold/15 pb-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-white/70 text-gold-deep">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-ink">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-plum">{v.copy}</p>
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal delay={320} className="mt-10 rounded-[1.4rem] border border-gold/25 bg-blush/60 p-7">
              <p className="font-display text-2xl leading-snug text-ink italic">
                “Effortless beauty is not about doing less. It is about everything being
                exactly where you need it to be.”
              </p>
              <p className="mt-3 text-[0.66rem] tracking-[0.26em] text-plum uppercase">
                The Zuri Cosmetics promise
              </p>
            </Reveal>

            <Reveal delay={400} className="mt-9 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-lux btn-blush">
                Shop the collection
              </Link>
              <Link href="/tutorials" className="btn-lux btn-outline">
                Watch tutorials
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
