"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Logo from "./logo";
import { navigation } from "@/lib/config";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import {
  IconBag,
  IconClose,
  IconMenu,
  IconSearch,
  IconUser,
  LotusMark,
} from "./icons";

const MARQUEE_ITEMS = [
  "Zuri Cosmetics",
  "Lashes",
  "Press-On Nails",
  "Lip Gloss",
  "Lip Liner",
  "Nail Care",
  "Beauty, Made Effortless",
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready && count !== prevCount.current) {
      prevCount.current = count;
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      return () => clearTimeout(t);
    }
  }, [count, ready]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <>
      {/* Announcement marquee */}
      <div className="relative overflow-hidden border-b border-gold/15 bg-blush">
        <div className="flex w-max animate-marquee items-center gap-10 py-2 pr-10">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-10 text-[0.62rem] font-medium tracking-[0.32em] text-plum uppercase"
                >
                  {item}
                  <LotusMark className="h-2.5 w-5 text-gold/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-mauve/15 bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-cocoa transition-colors hover:bg-blush hover:text-ink lg:hidden"
            >
              <IconMenu className="h-6 w-6" />
            </button>
            <Logo className="shrink-0" />
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={pathname === item.href}
                className={cn(
                  "link-sweep text-[0.68rem] font-medium tracking-[0.24em] uppercase transition-colors",
                  pathname === item.href ? "text-gold-deep" : "text-cocoa hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Zuri Cosmetics"
              className="rounded-full p-2.5 text-cocoa transition-all hover:bg-blush hover:text-ink"
            >
              <IconSearch className="h-5 w-5" />
            </button>
            <Link
              href="/account"
              aria-label="Your account & order tracking"
              className="hidden rounded-full p-2.5 text-cocoa transition-all hover:bg-blush hover:text-ink sm:block"
            >
              <IconUser className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${count} items`}
              className="relative rounded-full p-2.5 text-cocoa transition-all hover:bg-blush hover:text-ink"
            >
              <IconBag className={cn("h-5 w-5", bump && "animate-pop text-gold-deep")} />
              {ready && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold px-1 text-[0.58rem] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link
              href="/#subscribe"
              className="btn-lux btn-outline ml-1 hidden !px-5 !py-2.5 md:inline-flex"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/35 px-4 pt-28 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <form
            onSubmit={submitSearch}
            onClick={(e) => e.stopPropagation()}
            className="card-lux w-full max-w-xl animate-toast-in p-6 sm:p-8"
            role="search"
          >
            <p className="eyebrow mb-4">Search Zuri Cosmetics</p>
            <div className="flex items-center gap-3 border-b border-gold/40 pb-3">
              <IconSearch className="h-5 w-5 shrink-0 text-gold-deep" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Lashes, press-on nails, lip gloss, liner…"
                className="w-full bg-transparent font-display text-xl text-ink outline-none placeholder:text-plum/50 sm:text-2xl"
                aria-label="Search products"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="rounded-full p-1.5 text-plum hover:bg-blush"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Cluster lashes", "Strip lashes", "Press-on nails", "Cuticle oil", "Lip gloss", "Lip liner"].map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-mauve/30 bg-white/60 px-3.5 py-1.5 text-[0.68rem] tracking-[0.14em] text-plum uppercase transition-colors hover:border-gold/60 hover:text-gold-deep"
                  >
                    {s}
                  </button>
                )
              )}
            </div>
            <button type="submit" className="btn-lux btn-blush mt-6 w-full">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-blush px-8 py-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <Logo compact />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2 text-cocoa hover:bg-white/50"
            >
              <IconClose className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile">
            {navigation.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ transitionDelay: menuOpen ? `${120 + i * 55}ms` : "0ms" }}
                className={cn(
                  "border-b border-gold/15 py-4 font-display text-3xl transition-all duration-500",
                  menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
                  pathname === item.href ? "text-gold-deep italic" : "text-ink hover:text-gold-deep"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/account" className="btn-lux btn-outline w-full">
              Account & Orders
            </Link>
            <Link href="/#subscribe" className="btn-lux btn-blush w-full">
              Subscribe
            </Link>
          </div>
          <p className="mt-auto pt-10 text-[0.62rem] tracking-[0.3em] text-plum uppercase">
            Beauty, made effortless
          </p>
        </div>
      </div>
    </>
  );
}
