"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig, NAV_LINKS } from "@/lib/site-config";
import { CartCountBadge } from "@/components/cart";
import { IconClose, IconMenu, IconSearch, IconUser, IconWhatsApp } from "@/components/icons";
import { Ornament } from "@/components/ui";

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group flex flex-col items-center leading-none" aria-label="Zuri Cosmetics home">
      <span className="font-display text-[1.75rem] tracking-[0.08em] text-plum-deep transition-colors sm:text-[2rem]">
        ZURI<span className="text-gold">.</span>
      </span>
      <span className="mt-1.5 text-[0.56rem] font-medium uppercase tracking-[0.55em] text-gold">Cosmetics</span>
    </Link>
  );
}

function NavLinks({ onNavigate, tight = false }: { onNavigate?: () => void; tight?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-1" aria-label="Main navigation">
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`relative whitespace-nowrap px-2.5 py-2 text-[0.8rem] font-medium uppercase tracking-[0.14em] transition-colors after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:text-rose-deep hover:after:scale-x-100 ${
              tight ? "!px-1.5 text-[0.72rem] tracking-[0.1em]" : ""
            } ${
              active ? "text-rose-deep after:scale-x-100" : "text-plum"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <>
      {/* Announcement */}
      <div className="bg-gradient-to-r from-blush-100 via-champagne/70 to-blush-100 px-4 py-2 text-center text-[0.66rem] font-medium uppercase tracking-[0.22em] text-plum">
        ✦ Free delivery on orders over R 1,200 · {siteConfig.tagline} ✦
      </div>

      <header
        className={`sticky top-0 z-50 border-b border-blush-200/70 bg-cream/90 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "shadow-soft" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Primary row */}
          <div className="grid h-[4.6rem] grid-cols-[1fr_auto_1fr] items-center">
            <div className="justify-self-start">
              <button
                type="button"
                className="rounded-full p-2.5 text-plum transition hover:bg-blush-100 lg:hidden"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <IconMenu size={22} />
              </button>
            </div>

            <div className="justify-self-center">
              <Logo />
            </div>

            <div className="flex items-center justify-self-end">
              <button
                type="button"
                aria-label="Search products"
                onClick={() => setSearchOpen((v) => !v)}
                className="rounded-full p-2.5 text-plum transition hover:bg-blush-100"
              >
                <IconSearch size={21} />
              </button>
              <Link href="/account" aria-label="Your account" className="hidden rounded-full p-2.5 text-plum transition hover:bg-blush-100 sm:block">
                <IconUser size={21} />
              </Link>
              <CartCountBadge />
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 hidden rounded-full p-2.5 text-[#25D366] transition hover:bg-blush-100 md:block"
                aria-label="Chat with Zuri Cosmetics on WhatsApp"
              >
                <IconWhatsApp size={21} />
              </a>
              <Link href="/#newsletter" className="btn btn-gold ml-2 hidden !px-5 !py-2.5 !text-[0.62rem] xl:inline-flex">
                Subscribe
              </Link>
            </div>
          </div>

          {/* Secondary nav row — desktop only */}
          <div className="hidden items-center justify-center border-t border-blush-100 pb-1 lg:flex">
            <NavLinks tight />
          </div>

          {/* Search expand */}
          {searchOpen && (
            <form onSubmit={submitSearch} className="anim-fade-up border-t border-blush-100 py-3">
              <div className="flex items-center gap-3">
                <IconSearch size={19} className="shrink-0 text-gold" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lashes, cluster lashes, press-on nails, lip gloss, lip liner…"
                  className="w-full bg-transparent py-1.5 text-sm text-plum placeholder:text-mauve/70 focus:outline-none"
                  aria-label="Search Zuri Cosmetics"
                />
                <button type="submit" className="btn btn-plum !px-5 !py-2 !text-[0.65rem]">
                  Search
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="rounded-full p-1.5 text-mauve hover:bg-blush-100">
                  <IconClose size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <div aria-hidden={!menuOpen} className={menuOpen ? "" : "pointer-events-none"}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-0 z-[80] bg-plum-deep/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`fixed left-0 top-0 z-[90] flex h-full w-[86%] max-w-sm flex-col bg-ivory shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between border-b border-blush-100 px-6 py-5">
            <Logo onClick={() => setMenuOpen(false)} />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-full border border-blush-200 p-2 text-plum">
              <IconClose size={18} />
            </button>
          </div>

          <form onSubmit={submitSearch} className="border-b border-blush-100 px-6 py-4">
            <div className="flex items-center gap-2 rounded-full border border-blush-200 bg-blush-50 px-4 py-2.5">
              <IconSearch size={16} className="text-mauve" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Zuri Cosmetics…"
                className="w-full bg-transparent text-sm focus:outline-none"
                aria-label="Search"
              />
            </div>
          </form>

          <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: `${i * 30}ms` }}
                className={`flex items-center justify-between border-b border-blush-100/70 px-4 py-3.5 font-display text-lg text-plum-deep transition-colors hover:text-rose-deep ${
                  menuOpen ? "anim-fade-up" : ""
                }`}
              >
                {link.label}
                <span className="text-gold">→</span>
              </Link>
            ))}
          </nav>

          <div className="space-y-3 border-t border-blush-100 px-6 py-5">
            <Ornament className="justify-center" />
            <Link href="/#newsletter" onClick={() => setMenuOpen(false)} className="btn btn-gold w-full">
              Subscribe
            </Link>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-soft w-full">
              <IconWhatsApp size={16} /> Chat on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
