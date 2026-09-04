import Link from "next/link";
import type { Metadata } from "next";
import { getTutorials } from "@/lib/data";
import VideoPlayer from "@/components/video-player";
import Reveal from "@/components/reveal";
import { SectionHeading, Ornament } from "@/components/ui";
import { IconPlay, IconWhatsApp } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Zuri Beauty Tutorials — Lashes & Press-On Nail Guides",
  description:
    "Watch Zuri Cosmetics tutorials: preparing and applying cluster lashes, strip lashes, lash glue and tongs, safe removal, press-on nail sizing, application and removal.",
  alternates: { canonical: "/tutorials" },
};

export default async function TutorialsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const active = cat === "nails" || cat === "lashes" ? cat : "all";
  const tutorials = await getTutorials(active === "all" ? undefined : active);

  const lashCount = (await getTutorials("lashes")).length;
  const nailCount = (await getTutorials("nails")).length;

  const tabs = [
    { id: "all", label: "All videos", count: lashCount + nailCount },
    { id: "lashes", label: "Lash Application", count: lashCount },
    { id: "nails", label: "Press-On Nail Application", count: nailCount },
  ];

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
        <Link href="/" className="hover:text-rose-deep">Home</Link>
        <span className="mx-2 text-gold">/</span>
        <span className="text-plum">Tutorials</span>
      </nav>

      <Reveal className="mt-6 text-center">
        <p className="eyebrow">Learn with Zuri</p>
        <h1 className="mt-3 font-display text-[clamp(2.3rem,5vw,3.8rem)] text-plum-deep">Zuri Beauty Tutorials</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink/80">
          Step-by-step video guides for lash application and press-on nail application — beautiful,
          professional results, from the comfort of home. Videos are managed from the Zuri platform
          so new lessons can be added at any time.
        </p>
      </Reveal>

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={t.id === "all" ? "/tutorials" : `/tutorials?cat=${t.id}`}
            className={`rounded-full border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
              active === t.id
                ? "border-gold bg-gold text-ivory shadow-glow"
                : "border-blush-200 bg-ivory text-plum hover:border-gold"
            }`}
          >
            {t.label} <span className="ml-1 opacity-70">({t.count})</span>
          </Link>
        ))}
      </div>

      {/* Video grid */}
      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {tutorials.map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 90}>
            <article className="group">
              <VideoPlayer src={t.videoUrl} poster={t.poster} title={t.title} />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gold">
                    {t.category === "lashes" ? "Lash tutorial" : "Nail tutorial"}
                  </p>
                  <h2 className="mt-1.5 font-display text-xl leading-snug text-plum-deep transition-colors group-hover:text-rose-deep">
                    {t.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{t.description}</p>
                </div>
                {t.durationLabel && (
                  <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-blush-100 px-3 py-1 text-[0.65rem] font-medium text-plum">
                    <IconPlay size={10} /> {t.durationLabel}
                  </span>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 text-center">
        <Ornament className="justify-center" />
        <SectionHeading
          center
          className="mt-8"
          eyebrow="Still learning?"
          title="Ask us anything"
          sub="Our team is happy to guide you through your first lash or press-on application."
        />
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-plum mt-6">
          <IconWhatsApp size={16} /> Chat with Zuri on WhatsApp
        </a>
      </Reveal>
    </div>
  );
}
