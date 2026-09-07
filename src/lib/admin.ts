import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/*
  Admin protection — session cookie signed with a server-side secret.
  Configure ADMIN_PASSWORD and ADMIN_SECRET in environment variables.
  The values below are clearly-labelled development placeholders only.
*/
const SECRET = process.env.ADMIN_SECRET || "zuri-cosmetics-dev-secret-change-me";
const COOKIE = "zuri_admin_session";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "zuri-admin-preview";
}

export function adminPasswordIsDefault() {
  return !process.env.ADMIN_PASSWORD;
}

function tokenFor(password: string) {
  return createHmac("sha256", SECRET).update(password).digest("hex");
}

export async function verifyAdminLogin(password: string) {
  const expected = adminPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createAdminSession() {
  const store = await cookies();
  store.set(COOKIE, tokenFor(adminPassword()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function isAdmin() {
  const store = await cookies();
  const value = store.get(COOKIE)?.value;
  if (!value) return false;
  return value === tokenFor(adminPassword());
}
