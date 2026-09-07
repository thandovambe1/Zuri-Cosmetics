import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email = (typeof body.email === "string" ? body.email : "").trim().toLowerCase().slice(0, 160);
    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({
        ok: true,
        message:
          "You're already on the Zuri Beauty List — thank you for loving Zuri Cosmetics.",
      });
    }

    await db.insert(subscribers).values({ email, status: "pending" });

    /*
      The subscriber is stored safely. Once an email-marketing service
      (Mailchimp, Brevo, Klaviyo…) is configured, sync this record there and
      send the double-opt-in confirmation from that service.
    */
    return NextResponse.json({
      ok: true,
      message:
        "Welcome to the Zuri Beauty List! Your email is saved — a confirmation note will follow once our mailing service is connected.",
    });
  } catch (error) {
    console.error("Subscribe failed:", error);
    return NextResponse.json(
      { ok: false, message: "Could not save your email. Please try again." },
      { status: 500 }
    );
  }
}
