import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy — Zuri Cosmetics",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] text-plum-deep">Privacy Policy</h1>
      <p className="mt-2 text-sm text-mauve">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-[0.95rem] leading-relaxed text-ink/80">
        <section>
          <h2 className="font-display text-xl text-plum-deep">1. Who we are</h2>
          <p className="mt-2">
            {siteConfig.legalName} (&ldquo;Zuri Cosmetics&rdquo;, &ldquo;we&rdquo;) operates this website.
            This policy explains how we handle the personal information you share when shopping with us.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-plum-deep">2. What we collect</h2>
          <p className="mt-2">
            We collect only what we need to serve you: your name, email, phone number, delivery address,
            order history and — if you subscribe — your email address. We never collect or store card
            numbers on our servers.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-plum-deep">3. How we use it</h2>
          <p className="mt-2">
            To process and deliver your orders, provide order support, send order updates and — only if
            you opt in — share beauty news and offers. We do not sell your personal information to anyone.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-plum-deep">4. Your rights</h2>
          <p className="mt-2">
            You may request a copy of your data, ask us to correct it, or ask us to delete it (where the
            law allows). Just contact us on WhatsApp or email.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-plum-deep">5. Contact</h2>
          <p className="mt-2">
            Privacy questions? Email <a href={`mailto:${siteConfig.email}`} className="text-rose-deep underline underline-offset-2">{siteConfig.email}</a>.
          </p>
        </section>
      </div>
      <p className="mt-8">
        <Link href="/" className="text-sm text-gold-deep underline underline-offset-2">← Back to Zuri Cosmetics</Link>
      </p>
    </div>
  );
}
