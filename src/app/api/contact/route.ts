import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { isEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = (typeof body.name === "string" ? body.name : "").trim().slice(0, 120);
    const email = (typeof body.email === "string" ? body.email : "").trim().toLowerCase().slice(0, 160);
    const subject = (typeof body.subject === "string" ? body.subject : "").trim().slice(0, 160);
    const message = (typeof body.message === "string" ? body.message : "").trim().slice(0, 3000);

    if (name.length < 2 || !isEmail(email) || message.length < 10) {
      return NextResponse.json(
        { ok: false, message: "Please provide your name, a valid email and a message." },
        { status: 400 }
      );
    }

    await db.insert(inquiries).values({ name, email, subject: subject || null, message });

    return NextResponse.json({
      ok: true,
      message:
        "Thank you — your message is with the Zuri Cosmetics team. We reply during business hours.",
    });
  } catch (error) {
    console.error("Contact failed:", error);
    return NextResponse.json(
      { ok: false, message: "Could not send your message. Please try again." },
      { status: 500 }
    );
  }
}
