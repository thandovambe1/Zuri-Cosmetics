import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * ZURI COSMETICS wordmark — elegant typographic treatment echoing the
 * brand logo: gold-foil serif "ZURI", lotus-crown mark and a spaced
 * "COSMETICS" rule line.
 */
export default function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const gradientId = useId();
  return (
    <Link
      href="/"
      aria-label="Zuri Cosmetics — home"
      className={cn("group inline-flex flex-col items-center select-none", className)}
    >
      <svg
        viewBox="0 0 64 30"
        aria-hidden
        className={cn(
          "mb-0.5 transition-transform duration-500 group-hover:-translate-y-0.5",
          compact ? "h-3 w-8" : "h-4 w-10"
        )}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#96703f" />
            <stop offset="45%" stopColor="#d6bc94" />
            <stop offset="100%" stopColor="#b48a5c" />
          </linearGradient>
        </defs>
        <g fill={`url(#${gradientId})`}>
          <path d="M32 0c1.4 3.8 2.6 7 2.6 10.6 0 4-1.2 7.4-2.6 10-1.4-2.6-2.6-6-2.6-10C29.4 7 30.6 3.8 32 0Z" />
          <path d="M20.5 6.5c3.5 2.2 6.4 4.8 8.1 7.9 1.5 2.6 2 5.2 2 7.4-3-1-6-2.9-8-5.8-1.7-2.6-2.2-6-2.1-9.5Z" />
          <path d="M43.5 6.5c.1 3.5-.4 6.9-2.1 9.5-2 2.9-5 4.8-8 5.8 0-2.2.5-4.8 2-7.4 1.7-3.1 4.6-5.7 8.1-7.9Z" />
          <path d="M10 13.5c4.1.5 8 1.7 10.9 3.9 2.4 1.8 3.9 3.9 4.8 5.9-3.1.2-6.7-.4-9.7-2.2-2.7-1.6-4.6-4.5-6-7.6Z" />
          <path d="M54 13.5c-1.4 3.1-3.3 6-6 7.6-3 1.8-6.6 2.4-9.7 2.2.9-2 2.4-4.1 4.8-5.9 2.9-2.2 6.8-3.4 10.9-3.9Z" />
        </g>
      </svg>
      <span
        className={cn(
          "gold-text font-display leading-none font-semibold",
          compact ? "text-xl tracking-[0.16em]" : "text-2xl tracking-[0.18em] md:text-3xl"
        )}
      >
        ZURI
      </span>
      <span className="mt-1 flex items-center gap-2">
        <span className="h-px w-6 bg-gold/60 transition-all duration-500 group-hover:w-9" />
        <span
          className={cn(
            "text-plum font-body",
            compact ? "text-[0.5rem] tracking-[0.38em]" : "text-[0.58rem] tracking-[0.44em]"
          )}
        >
          COSMETICS
        </span>
        <span className="h-px w-6 bg-gold/60 transition-all duration-500 group-hover:w-9" />
      </span>
    </Link>
  );
}
