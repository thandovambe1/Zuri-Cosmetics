"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { zar } from "@/lib/format";
import { IconBag, IconCheck, IconClose, IconMinus, IconPlus, IconTrash } from "@/components/icons";

/* ───────────────────────── Types ───────────────────────── */

export type CartInput = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
  maxQty: number;
  variantId?: number;
  variantLabel?: string;
};

export type CartLine = CartInput & { key: string; qty: number };

type CartCtx = {
  items: CartLine[];
  count: number;
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  freeOverCents: number;
  isOpen: boolean;
  mounted: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: CartInput, qty?: number) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "zuri_cart_v1";

function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function lineKey(input: CartInput) {
  return `${input.productId}:${input.variantId ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    setItems(loadCart());
    hydrated.current = true;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / private mode — ignore */
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((input: CartInput, qty = 1) => {
    setItems((prev) => {
      const key = lineKey(input);
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: Math.min(i.qty + qty, Math.max(1, i.maxQty)) } : i
        );
      }
      return [...prev, { ...input, key, qty: Math.max(1, Math.min(qty, Math.max(1, input.maxQty))) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, Math.max(1, i.maxQty))) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { subtotalCents, deliveryCents, totalCents, count } = useMemo(() => {
    const sub = items.reduce((acc, i) => acc + i.priceCents * i.qty, 0);
    const free = siteConfig.delivery.freeOverCents;
    const fee = sub === 0 || sub >= free ? 0 : siteConfig.delivery.feeCents;
    return { subtotalCents: sub, deliveryCents: fee, totalCents: sub + fee, count: items.reduce((a, i) => a + i.qty, 0) };
  }, [items]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const value: CartCtx = {
    items,
    count,
    subtotalCents,
    deliveryCents,
    totalCents,
    freeOverCents: siteConfig.delivery.freeOverCents,
    isOpen,
    mounted,
    openCart,
    closeCart,
    addItem,
    removeItem,
    setQty,
    clearCart,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/* ───────────────────────── Quantity stepper ───────────────────────── */

export function QuantityStepper({
  value,
  onChange,
  max = 99,
  min = 1,
  size = "md",
  className = "",
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  min?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const pad = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const disabledMin = value <= min;
  const disabledMax = value >= max;
  return (
    <span
      className={`inline-flex items-center overflow-hidden rounded-full border border-blush-200 bg-ivory ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabledMin}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${pad} grid place-items-center text-plum transition hover:bg-blush-100 disabled:opacity-30`}
      >
        <IconMinus size={14} />
      </button>
      <span className="min-w-8 text-center text-sm font-medium text-plum-deep tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabledMax}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${pad} grid place-items-center text-plum transition hover:bg-blush-100 disabled:opacity-30`}
      >
        <IconPlus size={14} />
      </button>
    </span>
  );
}

/* ───────────────────────── Add / Buy buttons ───────────────────────── */

export type BuyableProduct = {
  id: number;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
  salePriceCents?: number | null;
  stock: number;
};

export function AddToCartButton({
  product,
  variantId,
  variantLabel,
  qty = 1,
  label = "Add to Cart",
  className = "",
  ghost = false,
}: {
  product: BuyableProduct;
  variantId?: number;
  variantLabel?: string;
  qty?: number;
  label?: string;
  className?: string;
  ghost?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const out = product.stock <= 0;

  const effective = product.salePriceCents && product.salePriceCents > 0 ? product.salePriceCents : product.priceCents;

  const handle = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        priceCents: effective,
        maxQty: product.stock,
        variantId,
        variantLabel,
      },
      qty
    );
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      type="button"
      disabled={out || added}
      onClick={handle}
      className={`${ghost ? "btn btn-soft" : "btn btn-gold"} ${added ? "!bg-blush-200 !text-plum !shadow-none" : ""} ${className}`}
      aria-label={out ? "Out of stock" : `Add ${product.name} to bag`}
    >
      {added ? (
        <>
          <IconCheck size={15} /> Added to Bag
        </>
      ) : out ? (
        "Out of Stock"
      ) : (
        <>
          <IconBag size={15} /> {label}
        </>
      )}
    </button>
  );
}

export function BuyNowButton({
  product,
  variantId,
  variantLabel,
  qty = 1,
  className = "",
}: {
  product: BuyableProduct;
  variantId?: number;
  variantLabel?: string;
  qty?: number;
  className?: string;
}) {
  const { addItem, closeCart } = useCart();
  const router = useRouter();
  const out = product.stock <= 0;
  const effective = product.salePriceCents && product.salePriceCents > 0 ? product.salePriceCents : product.priceCents;

  return (
    <button
      type="button"
      disabled={out}
      onClick={() => {
        addItem(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            priceCents: effective,
            maxQty: product.stock,
            variantId,
            variantLabel,
          },
          qty
        );
        closeCart();
        router.push("/checkout");
      }}
      className={`btn btn-plum ${className}`}
    >
      Buy Now
    </button>
  );
}

/* ───────────────────────── Cart drawer ───────────────────────── */

export function CartItemRow({
  item,
  compact = false,
}: {
  item: CartLine;
  compact?: boolean;
}) {
  const { setQty, removeItem } = useCart();
  return (
    <div className="flex gap-4 py-4">
      <Link href={`/product/${item.slug}`} className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-blush-100 bg-blush-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-medium text-plum-deep hover:text-rose-deep">
              {item.name}
            </Link>
            {item.variantLabel && <p className="mt-0.5 text-xs text-mauve">{item.variantLabel}</p>}
          </div>
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => removeItem(item.key)}
            className="rounded-full p-1.5 text-mauve transition hover:bg-blush-100 hover:text-rose-deep"
          >
            <IconTrash size={15} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          {compact ? (
            <QuantityStepper size="sm" value={item.qty} onChange={(n) => setQty(item.key, n)} max={item.maxQty} />
          ) : (
            <QuantityStepper value={item.qty} onChange={(n) => setQty(item.key, n)} max={item.maxQty} />
          )}
          <p className="text-sm font-medium text-plum-deep tabular-nums">{zar(item.priceCents * item.qty)}</p>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotalCents, deliveryCents, totalCents, freeOverCents, mounted } = useCart();

  const remainingFree = freeOverCents - subtotalCents;

  return (
    <div aria-hidden={!isOpen} className={isOpen ? "" : "pointer-events-none"}>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-plum-deep/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-ivory shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping bag"
      >
        <header className="flex items-center justify-between border-b border-blush-100 px-6 py-5">
          <div>
            <p className="eyebrow">Your bag</p>
            <h2 className="font-display text-xl text-plum-deep">
              Shopping Bag{" "}
              {mounted && items.length > 0 && (
                <span className="text-sm text-mauve">({items.length})</span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="rounded-full border border-blush-200 p-2 text-plum transition hover:bg-blush-100"
          >
            <IconClose size={17} />
          </button>
        </header>

        {mounted && items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="anim-float text-5xl">🛍️</span>
            <h3 className="font-display text-2xl text-plum-deep">Your beauty bag is waiting...</h3>
            <p className="text-sm text-ink/70">Fill it with lashes, nails and lip essentials you&apos;ll adore.</p>
            <Link href="/shop" onClick={closeCart} className="btn btn-gold">
              Shop Zuri Cosmetics
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-blush-100 overflow-y-auto px-6">
              {items.map((item) => (
                <CartItemRow key={item.key} item={item} compact />
              ))}
              {mounted && remainingFree > 0 && subtotalCents > 0 && (
                <p className="flex items-center gap-2 rounded-xl bg-blush-50 px-4 py-3 text-xs text-plum">
                  ✨ You&apos;re {zar(remainingFree)} away from <strong>free delivery</strong>.
                </p>
              )}
            </div>
            <footer className="space-y-4 border-t border-blush-100 px-6 py-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink/80">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{zar(subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-ink/80">
                  <span>Delivery</span>
                  <span className="tabular-nums">{deliveryCents === 0 ? "Free" : zar(deliveryCents)}</span>
                </div>
                <div className="flex justify-between border-t border-blush-100 pt-2 text-base font-semibold text-plum-deep">
                  <span>Total</span>
                  <span className="tabular-nums">{zar(totalCents)}</span>
                </div>
              </div>
              <div className="grid gap-2.5">
                <Link href="/checkout" onClick={closeCart} className="btn btn-gold w-full">
                  Proceed to Checkout
                </Link>
                <button type="button" onClick={closeCart} className="btn btn-ghost w-full">
                  Continue Shopping
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

/* Small badge used by the navbar — renders count once hydrated */
export function CartCountBadge() {
  const { count, openCart } = useCart();
  return (
    <button
      type="button"
      aria-label={`Open shopping bag, ${count} items`}
      onClick={openCart}
      className="relative rounded-full p-2.5 text-plum transition hover:bg-blush-100"
    >
      <IconBag size={21} />
      {count > 0 && (
        <span className="anim-pop absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-deep px-1 text-[0.65rem] font-semibold text-ivory">
          {count}
        </span>
      )}
    </button>
  );
}
