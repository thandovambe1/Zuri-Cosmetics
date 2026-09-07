import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import VideoPlayer from "@/components/video-player";
import { IconCheck, LotusMark } from "@/components/icons";
import { whatsappLink } from "@/lib/config";
import { getTutorials } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Zuri Beauty Tutorials | Lash & Press-On Nail Application Guides",
  description:
    "Watch Zuri Beauty Tutorials — step-by-step video guides for applying cluster lashes, strip lashes, press-on nails and safe removal.",
  alternates: { canonical: "/tutorials" },
};

export const dynamic = "force-dynamic";

export default async function TutorialsPage() {
  const tutorials = await getTutorials();
  const lashTutorials = tutorials.filter((t) => t.category === "lashes");
  const nailTutorials = tutorials.filter((t) => t.category === "nails");

  const section = (
    title: string,
    subtitle: string,
    items: typeof tutorials,
    id: string
  ) => (
    <section id={id} className="scroll-mt-28">
      <Reveal>
        <SectionHeading align="left" eyebrow={title} title={subtitle} />
      </Reveal>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {items.map((t, i) => (
          <Reveal key={t.id} delay={(i % 2) * 120}>
            <article className="flex h-full flex-col">
              <VideoPlayer src={t.videoUrl} poster={t.posterUrl} title={t.title} />
              <div className="card-lux mt-5 flex-1 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-ink">{t.title}</h3>
                  {t.durationLabel && (
                    <span className="shrink-0 rounded-full bg-blush px-3 py-1 text-[0.58rem] font-medium tracking-[0.2em] text-plum uppercase">
                      {t.durationLabel}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-plum">{t.description}</p>
                <ol className="mt-5 space-y-2.5">
                  {t.steps.map((step, si) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed text-cocoa">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[0.6rem] font-semibold text-gold-deep">
                        {si + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(46rem 30rem at 15% 20%, rgba(231,225,241,0.7), transparent 60%), radial-gradient(40rem 28rem at 85% 70%, rgba(246,231,227,0.85), transparent 62%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 lg:pt-24">
          <p className="eyebrow flex items-center justify-center gap-3">
            <LotusMark className="h-3 w-6 text-gold/80" />
            Watch & learn
            <LotusMark className="h-3 w-6 text-gold/80" />
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ink sm:text-7xl">
            Zuri Beauty <em className="gold-text italic">Tutorials</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-plum sm:text-base">
            Short, beautiful video guides that make every Zuri ritual effortless — from
            preparing your lashes to making your press-ons last, and removing everything
            safely.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#lash-application" className="btn-lux btn-blush">
              Lash application
            </a>
            <a href="#press-on-nails" className="btn-lux btn-outline">
              Press-on nail application
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-4 pb-24 sm:px-6 lg:px-10">
        {section(
          "Lash application",
          "Lash application, mastered",
          lashTutorials,
          "lash-application"
        )}
        {section(
          "Press-on nail application",
          "Press-on nails, perfected",
          nailTutorials,
          "press-on-nails"
        )}

        <Reveal className="card-lux mx-auto max-w-3xl p-8 text-center sm:p-10">
          <LotusMark className="mx-auto h-5 w-10 text-gold/80" />
          <h2 className="mt-4 font-display text-3xl text-ink">Still need a hand?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-plum">
            Send us a photo or a question on WhatsApp — we love helping you get the
            perfect application. Tutorial videos are updated regularly and can be
            swapped in site settings.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={whatsappLink("Hi Zuri Cosmetics! I need help applying my lashes/nails.")} target="_blank" rel="noopener noreferrer" className="btn-lux btn-blush">
              Ask on WhatsApp
            </a>
            <Link href="/shop" className="btn-lux btn-outline">
              Shop the tools
            </Link>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-[0.62rem] tracking-[0.2em] text-plum/70 uppercase">
            <IconCheck className="h-3.5 w-3.5 text-gold-deep" />
            Video library managed from the tutorial database
          </p>
        </Reveal>
      </div>
    </>
  );
}
