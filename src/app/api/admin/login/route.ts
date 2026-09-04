import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => new FormData());
  const password = String(form.get("password") ?? "");

  const expected = process.env.ADMIN_PASSWORD || "zuri-admin-2026";
  const url = new URL(req.url);

  if (!password || password !== expected) {
    return NextResponse.redirect(new URL("/admin/login?error=1", url.origin));
  }

  const res = NextResponse.redirect(new URL("/admin", url.origin));
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
