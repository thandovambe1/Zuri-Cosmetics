import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { ensureSeeded } from "@/lib/data";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    await ensureSeeded();
    const body = (await req.json().catch(() => ({}))) as { email?: string; source?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ ok: false, message: "Please enter a valid email address." }, { status: 400 });
    }
    const source = (body.source ?? "newsletter").slice(0, 60);

    const existing = await db.select({ id: subscribers.id }).from(subscribers).where(eq(subscribers.email, email)).limit(1);

    if (existing.length === 0) {
      await db.insert(subscribers).values({ email, source }).onConflictDoNothing();
    }

    // Honest response: the address is stored in our own database. Real
    // email-marketing delivery (Mailchimp etc.) can be wired in later via env vars.
    return NextResponse.json({
      ok: true,
      message: "You're on the Zuri Beauty List ✨ We'll be in touch with beauty first.",
    });
  } catch (err) {
    console.error("subscribe error", err);
    return NextResponse.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
