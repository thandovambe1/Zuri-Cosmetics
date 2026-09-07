"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LotusMark } from "@/components/icons";

/**
 * Branded error boundary — replaces the platform's generic
 * "A server error occurred" screen with a graceful Zuri Cosmetics page,
 * while the real error (with digest) is logged server-side.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[zuri] Page error:", error.message, error.digest ?? "");
  }, [error]);

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <LotusMark className="h-6 w-12 text-gold/70" />
      <p className="eyebrow mt-6">Something went wrong</p>
      <h1 className="mt-4 font-display text-5xl leading-tight text-ink sm:text-6xl">
        A moment of <em className="gold-text italic">imperfection</em>
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-plum">
        We couldn’t load this page right now. Please try again — if it keeps
        happening, our team would love to know.
      </p>
      {error.digest && (
        <p className="mt-3 text-[0.62rem] tracking-[0.22em] text-plum/60 uppercase">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={reset} className="btn-lux btn-blush">
          Try again
        </button>
        <Link href="/" className="btn-lux btn-outline">
          Back home
        </Link>
      </div>
    </section>
  );
}
