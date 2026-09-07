import Link from "next/link";
import Logo from "./logo";
import Newsletter from "./newsletter";
import { siteConfig, whatsappLink } from "@/lib/config";
import {
  IconFacebook,
  IconInstagram,
  IconTikTok,
  IconWhatsApp,
  LotusMark,
} from "./icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Lashes", href: "/lashes" },
      { label: "Nails", href: "/nails" },
      { label: "LipGloss", href: "/lipgloss" },
      { label: "All Products", href: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping", href: "/policies/shipping" },
      { label: "Returns", href: "/policies/returns" },
      { label: "Order Tracking", href: "/account" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Zuri Cosmetics", href: "/about" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms & Conditions", href: "/policies/terms" },
    ],
  },
];

const SOCIALS = [
  { label: "WhatsApp", href: whatsappLink(), icon: IconWhatsApp },
  { label: "Instagram", href: siteConfig.instagram, icon: IconInstagram },
  { label: "Facebook", href: siteConfig.facebook, icon: IconFacebook },
  { label: "TikTok", href: siteConfig.tiktok, icon: IconTikTok },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-gold/25 bg-shell">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-plum">
              A curated collection of lashes, press-on nails and lip essentials —
              designed to elevate your everyday beauty routine.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="rounded-full border border-mauve/30 bg-white/60 p-2.5 text-cocoa transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:text-gold-deep"
                >
                  <s.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow flex items-center gap-2">
                  <LotusMark className="h-2.5 w-5 text-gold/70" />
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="link-sweep text-sm text-plum transition-colors hover:text-gold-deep"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-[1.5rem] border border-gold/25 bg-gradient-to-br from-blush via-shell to-lavender/60 p-8 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h3 className="font-display text-3xl text-ink sm:text-4xl">
                Join the Zuri Beauty List
              </h3>
              <p className="mt-2 text-sm text-plum">
                New drops, exclusive offers and beauty tips — softly, never spammy.
              </p>
            </div>
            <Newsletter compact />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-mauve/20 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-[0.68rem] tracking-[0.22em] text-plum uppercase">
            © {new Date().getFullYear()} Zuri Cosmetics · Beauty, made effortless
          </p>
          <p className="max-w-md text-[0.68rem] leading-relaxed tracking-[0.08em] text-plum/80">
            Secure checkout · Card & payment details are never stored on our servers ·
            Business contact details configurable in site settings
          </p>
        </div>
      </div>
    </footer>
  );
}
