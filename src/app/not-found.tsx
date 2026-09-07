import Link from "next/link";
import { LotusMark } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <LotusMark className="h-6 w-12 text-gold/70" />
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-4 font-display text-5xl leading-tight text-ink sm:text-6xl">
        This page slipped <em className="gold-text italic">out of the bag</em>
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-plum">
        The page you are looking for doesn’t exist or has moved. Let’s get you back to
        the beautiful part.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-lux btn-blush">
          Back home
        </Link>
        <Link href="/shop" className="btn-lux btn-outline">
          Shop Zuri Cosmetics
        </Link>
      </div>
    </section>
  );
}
