import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureSeeded } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await ensureSeeded();
    const body = (await req.json().catch(() => ({}))) as {
      productId?: number;
      name?: string;
      rating?: number;
      title?: string;
      content?: string;
    };
    const productId = Number(body.productId);
    const name = (body.name ?? "").trim().slice(0, 60);
    const title = (body.title ?? "").trim().slice(0, 90);
    const content = (body.content ?? "").trim().slice(0, 1000);
    const rating = Number(body.rating);

    if (!Number.isInteger(productId)) {
      return NextResponse.json({ ok: false, message: "Missing product." }, { status: 400 });
    }
    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, message: "Please tell us your name." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, message: "Please choose between 1 and 5 stars." }, { status: 400 });
    }
    if (content.length < 4) {
      return NextResponse.json({ ok: false, message: "Please share a few words about the product." }, { status: 400 });
    }

    const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
    if (!product) {
      return NextResponse.json({ ok: false, message: "That product no longer exists." }, { status: 404 });
    }

    await db.insert(reviews).values({ productId, name, rating, title: title || null, content, isSample: false });
    return NextResponse.json({
      ok: true,
      message: "Thank you — your review has been received and will appear after moderation. ✨",
    });
  } catch (err) {
    console.error("review error", err);
    return NextResponse.json({ ok: false, message: "Could not submit your review. Please try again." }, { status: 500 });
  }
}
