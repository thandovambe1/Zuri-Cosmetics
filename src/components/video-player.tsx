"use client";

import { useState } from "react";
import { IconPlay } from "@/components/icons";

function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export default function VideoPlayer({
  src,
  poster,
  title,
  className = "",
}: {
  src: string;
  poster?: string | null;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const embed = toYouTubeEmbed(src);

  if (embed) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-plum-deep shadow-soft ${className}`}>
        {playing ? (
          <iframe
            src={`${embed}?autoplay=1&rel=0`}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster ?? ""} alt={title} className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-plum-deep/25 transition group-hover:bg-plum-deep/10" />
            <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory/95 pl-1 text-plum shadow-lift transition-transform duration-300 group-hover:scale-110">
              <IconPlay size={22} />
            </span>
          </button>
        )}
      </div>
    );
  }

  return (
    <video
      className={`aspect-video w-full rounded-2xl bg-plum-deep object-cover shadow-soft ${className}`}
      controls
      preload="metadata"
      poster={poster ?? undefined}
      playsInline
      title={title}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
