import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const productId = Number(body.productId);
    const authorName = (typeof body.name === "string" ? body.name : "").trim().slice(0, 80);
    const title = (typeof body.title === "string" ? body.title : "").trim().slice(0, 120);
    const bodyText = (typeof body.body === "string" ? body.body : "").trim().slice(0, 2000);
    const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating))));

    if (!Number.isFinite(productId) || authorName.length < 2 || bodyText.length < 10) {
      return NextResponse.json(
        { ok: false, message: "Please add your name and a review of at least 10 characters." },
        { status: 400 }
      );
    }

    const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!product) {
      return NextResponse.json({ ok: false, message: "Product not found." }, { status: 404 });
    }

    /* Reviews enter moderation before appearing on the site. */
    await db.insert(reviews).values({
      productId,
      authorName,
      rating,
      title: title || null,
      body: bodyText,
      status: "pending",
      isSample: false,
    });

    return NextResponse.json({
      ok: true,
      message:
        "Thank you! Your review has been submitted and will appear once approved by our team.",
    });
  } catch (error) {
    console.error("Review failed:", error);
    return NextResponse.json(
      { ok: false, message: "Could not submit your review. Please try again." },
      { status: 500 }
    );
  }
}
