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

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  shade: string | null;
  qty: number;
  stock: number;
}

interface CartContextValue {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  toast: { id: number; message: string } | null;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const cartKey = (productId: number, shade?: string | null) =>
  `${productId}::${shade ?? ""}`;

const STORAGE_KEY = "zuri-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items, ready]);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    const id = Date.now();
    setToast({ id, message });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const add = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1) => {
      setItems((prev) => {
        const key = cartKey(item.productId, item.shade);
        const existing = prev.find((i) => cartKey(i.productId, i.shade) === key);
        if (existing) {
          return prev.map((i) =>
            cartKey(i.productId, i.shade) === key
              ? { ...i, qty: Math.min(i.qty + qty, i.stock || 99) }
              : i
          );
        }
        return [...prev, { ...item, qty: Math.min(qty, item.stock || 99) }];
      });
      showToast(`${item.name} added to your beauty bag`);
    },
    [showToast]
  );

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          cartKey(i.productId, i.shade) === key
            ? { ...i, qty: Math.max(0, Math.min(qty, i.stock || 99)) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => cartKey(i.productId, i.shade) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, ready, count, subtotal, toast, add, setQty, remove, clear }),
    [items, ready, count, subtotal, toast, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
