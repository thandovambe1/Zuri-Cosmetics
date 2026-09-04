import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import NewsletterForm from "@/components/newsletter-form";
import {
  IconFacebook,
  IconInstagram,
  IconMail,
  IconPhone,
  IconTikTok,
  IconWhatsApp,
} from "@/components/icons";
import { Ornament } from "@/components/ui";

const SHOP_LINKS = [
  { label: "Lashes", href: "/lashes" },
  { label: "Nails", href: "/nails" },
  { label: "LipGloss", href: "/lipgloss" },
  { label: "Shop All", href: "/shop" },
];

const HELP_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "FAQs", href: "/faq" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Order Tracking", href: "/account" },
];

const COMPANY_LINKS = [
  { label: "About Zuri Cosmetics", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
  const year = new Date().getFullYear();
  const socials = [
    { label: "WhatsApp", href: whatsappHref, icon: <IconWhatsApp size={17} /> },
    { label: "Instagram", href: siteConfig.social.instagram, icon: <IconInstagram size={17} /> },
    { label: "Facebook", href: siteConfig.social.facebook, icon: <IconFacebook size={17} /> },
    { label: "TikTok", href: siteConfig.social.tiktok, icon: <IconTikTok size={17} /> },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 bg-gradient-to-b from-blush-50 to-blush-100/70">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        {/* Brand + newsletter band */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex flex-col leading-none">
              <span className="font-display text-4xl tracking-[0.06em] text-plum-deep">
                ZURI<span className="text-gold">.</span>
              </span>
              <span className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.55em] text-gold">Cosmetics</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/75">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-blush-200 bg-ivory text-plum transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div id="newsletter" className="card-luxe scroll-mt-28 bg-ivory p-6 sm:p-8">
            <p className="eyebrow">Join the Zuri Beauty List</p>
            <h3 className="font-display text-2xl text-plum-deep">A little more beauty in your inbox.</h3>
            <p className="mt-2 text-sm text-ink/75">
              Subscribe for new product drops, exclusive offers, beauty tips and special promotions from Zuri Cosmetics.
            </p>
            <NewsletterForm className="mt-5" />
            <p className="mt-3 text-[0.7rem] text-mauve">
              No spam, ever. Unsubscribe anytime. Your details stay with Zuri Cosmetics.
            </p>
          </div>
        </div>

        <Ornament className="my-10 justify-center" />

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-plum-deep">Shop</h4>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-ink/75 transition-colors hover:text-rose-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-plum-deep">Help</h4>
            <ul className="mt-4 space-y-2.5">
              {HELP_LINKS.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-ink/75 transition-colors hover:text-rose-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-plum-deep">Company</h4>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-ink/75 transition-colors hover:text-rose-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-plum-deep">Connect</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-ink/75 transition-colors hover:text-rose-deep">
                  <IconWhatsApp size={14} className="text-[#25D366]" /> WhatsApp Business
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 text-sm text-ink/75 transition-colors hover:text-rose-deep">
                  <IconMail size={14} className="text-gold" /> {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm text-ink/75 transition-colors hover:text-rose-deep">
                  <IconPhone size={14} className="text-gold" /> {siteConfig.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-blush-200 pt-6 text-[0.72rem] text-mauve sm:flex-row">
          <p>© {year} {siteConfig.legalName}. All rights reserved. Crafted with soft-luxury care.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-rose-deep">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-rose-deep">Terms</Link>
            <Link href="/admin" className="transition-colors hover:text-rose-deep">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
