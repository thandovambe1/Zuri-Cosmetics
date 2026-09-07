"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconExpand,
  IconMute,
  IconPause,
  IconPlay,
  IconVolume,
} from "./icons";

function fmt(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string | null;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const seek = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setTime(value);
  };

  const fullscreen = () => {
    const node = wrapRef.current;
    if (!node) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void node.requestFullscreen();
  };

  return (
    <div
      ref={wrapRef}
      className="group/player relative overflow-hidden rounded-[1.4rem] border border-gold/25 bg-ink shadow-lift"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={toggle}
        className="aspect-video w-full cursor-pointer object-cover"
        aria-label={title}
      />
      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors hover:bg-ink/15"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-soft/70 bg-cream/90 text-gold-deep shadow-lift transition-transform duration-300 hover:scale-110">
            <IconPlay className="ml-1 h-6 w-6" />
          </span>
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-ink/85 to-transparent px-4 pt-10 pb-3 opacity-0 transition-opacity duration-300 group-hover/player:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="text-cream transition-colors hover:text-gold-soft"
        >
          {playing ? <IconPause className="h-4.5 w-4.5" /> : <IconPlay className="h-4.5 w-4.5" />}
        </button>
        <span className="text-[0.65rem] tracking-wider text-cream/80 tabular-nums">
          {fmt(time)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek video"
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-cream/30 accent-gold-soft"
        />
        <span className="text-[0.65rem] tracking-wider text-cream/80 tabular-nums">
          {fmt(duration)}
        </span>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="text-cream transition-colors hover:text-gold-soft"
        >
          {muted ? <IconMute className="h-4.5 w-4.5" /> : <IconVolume className="h-4.5 w-4.5" />}
        </button>
        <button
          type="button"
          onClick={fullscreen}
          aria-label="Fullscreen"
          className="text-cream transition-colors hover:text-gold-soft"
        >
          <IconExpand className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
