import { createHmac, timingSafeEqual } from "crypto";

/**
 * Minimal admin gate for Zuri Cosmetics.
 * Configure ADMIN_PASSWORD / ADMIN_SECRET in the environment (server-side only).
 */
export const ADMIN_COOKIE = "zuri_admin";

function secret(): string {
  return process.env.ADMIN_SECRET || "zuri-cosmetics-admin-secret-change-me";
}

export function adminToken(): string {
  const password = process.env.ADMIN_PASSWORD || "zuri-admin-2026";
  return createHmac("sha256", secret()).update(password).digest("hex");
}

export function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = adminToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
