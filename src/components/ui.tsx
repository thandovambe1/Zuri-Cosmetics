import Link from "next/link";
import type { ReactNode } from "react";
import { zar } from "@/lib/format";
import { IconStar } from "@/components/icons";

/* ── Star rating (average display) ─────────────────────────────────── */
export function Stars({ value, className = "" }: { value: number | null; className?: string }) {
  const pct = Math.max(0, Math.min(100, ((value ?? 0) / 5) * 100));
  const row = (
    <span className="flex w-max">
      {[0, 1, 2, 3, 4].map((i) => (
        <IconStar key={i} size={15} className="shrink-0" />
      ))}
    </span>
  );
  return (
    <span className={`relative inline-flex ${className}`} aria-label={`Rated ${value ?? 0} out of 5`}>
      <span className="flex text-blush-300">{row}</span>
      <span className="absolute inset-y-0 left-0 overflow-hidden text-gold" style={{ width: `${pct}%` }}>
        {row}
      </span>
    </span>
  );
}

export function RatingLine({ avg, count, className = "" }: { avg: number | null; count: number; className?: string }) {
  if (!avg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-mauve ${className}`}>
      <Stars value={avg} />
      <span>
        {avg.toFixed(1)} · {count} review{count === 1 ? "" : "s"}
      </span>
    </span>
  );
}

/* ── Price ─────────────────────────────────────────────────────────── */
export function Price({
  cents,
  saleCents,
  size = "md",
  className = "",
}: {
  cents: number;
  saleCents?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const onSale = !!saleCents && saleCents > 0 && saleCents < cents;
  const sizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {onSale && <span className={`${sizes[size]} text-mauve/70 line-through`}>{zar(cents)}</span>}
      <span className={`${sizes[size]} font-medium text-plum-deep`}>{zar(onSale ? saleCents : cents)}</span>
    </span>
  );
}

/* ── Stock badge ───────────────────────────────────────────────────── */
export function StockBadge({ stock, className = "" }: { stock: number; className?: string }) {
  const tone =
    stock <= 0
      ? "bg-rose/10 text-rose-deep"
      : stock <= 15
        ? "bg-champagne/60 text-gold-deep"
        : "bg-blush-100 text-plum";
  const label = stock <= 0 ? "Out of stock" : stock <= 15 ? `Low stock · ${stock} left` : "In stock";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${tone} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${stock <= 0 ? "bg-rose-deep" : stock <= 15 ? "bg-gold-deep" : "bg-gold"}`} />
      {label}
    </span>
  );
}

/* ── Section heading ───────────────────────────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.12] text-plum-deep">{title}</h2>
      {sub && <p className={`mt-4 text-[0.95rem] leading-relaxed text-ink/80 ${center ? "mx-auto" : ""}`}>{sub}</p>}
    </div>
  );
}

/* ── Buttons / CTAs ────────────────────────────────────────────────── */
const btnVariants = { gold: "btn btn-gold", plum: "btn btn-plum", soft: "btn btn-soft", outline: "btn btn-outline", ghost: "btn btn-ghost" } as const;

export function CtaLink({
  href,
  variant = "gold",
  className = "",
  children,
  onClick,
}: {
  href: string;
  variant?: keyof typeof btnVariants;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={`${btnVariants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function CtaButton({
  variant = "gold",
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof btnVariants }) {
  return (
    <button className={`${btnVariants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/* ── Ornament divider ──────────────────────────────────────────────── */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden>
      <span className="h-px w-10 bg-gold/50" />
      <span className="text-gold/80 text-[0.6rem] tracking-[0.3em]">✦</span>
      <span className="h-px w-10 bg-gold/50" />
    </div>
  );
}

/* ── Empty state ───────────────────────────────────────────────────── */
export function EmptyState({
  icon,
  title,
  text,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-luxe mx-auto flex max-w-md flex-col items-center gap-4 px-8 py-14 text-center ${className}`}>
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-100 text-rose-deep">{icon}</div>
      )}
      <h3 className="font-display text-2xl text-plum-deep">{title}</h3>
      {text && <p className="text-sm leading-relaxed text-ink/70">{text}</p>}
      {action}
    </div>
  );
}
