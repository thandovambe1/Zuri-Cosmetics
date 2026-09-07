"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { IconBag, IconCheck } from "./icons";

export default function CartToast() {
  const { toast } = useCart();
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      className="fixed right-4 bottom-24 z-50 sm:right-6 sm:bottom-24"
      role="status"
      aria-live="polite"
    >
      <div className="card-lux flex animate-toast-in items-center gap-3 py-3.5 pr-5 pl-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush text-gold-deep">
          <IconCheck className="h-4.5 w-4.5" />
        </span>
        <p className="max-w-[14rem] text-xs leading-snug text-cocoa">{toast.message}</p>
        <Link
          href="/cart"
          className="ml-2 flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1.5 text-[0.6rem] font-medium tracking-[0.18em] text-gold-deep uppercase transition-colors hover:bg-gold hover:text-white"
        >
          <IconBag className="h-3.5 w-3.5" />
          View bag
        </Link>
      </div>
    </div>
  );
}
