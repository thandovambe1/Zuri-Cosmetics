import Link from "next/link";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";

export const metadata = { title: "Admin Studio | Zuri Cosmetics", robots: { index: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const store = await cookies();
  const authed = isValidAdminToken(store.get(ADMIN_COOKIE)?.value);
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-blush-200/70 bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-display text-xl text-plum-deep">
              ZURI<span className="text-gold">.</span>
            </span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-gold">Admin Studio</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/admin" className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-plum transition hover:bg-blush-100">
              Orders
            </Link>
            <Link href="/admin/products" className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-plum transition hover:bg-blush-100">
              Products
            </Link>
            <Link href="/" className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-mauve transition hover:bg-blush-100">
              View site ↗
            </Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="btn btn-soft !px-4 !py-2 !text-[0.62rem]">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
