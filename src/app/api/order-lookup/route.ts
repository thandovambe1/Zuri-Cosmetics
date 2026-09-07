import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const number = (url.searchParams.get("number") ?? "").trim().toUpperCase();
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();

  if (!number || !email) {
    return NextResponse.json(
      { ok: false, message: "Order number and email are required." },
      { status: 400 }
    );
  }

  const result = await getOrderByNumber(number);
  if (!result || result.order.email.toLowerCase() !== email) {
    return NextResponse.json(
      { ok: false, message: "We couldn't find an order matching those details." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, order: result.order, items: result.items });
}
