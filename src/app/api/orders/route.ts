import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { ensureDatabase } from "@/db/bootstrap";
import { eq, inArray, sql } from "drizzle-orm";
import { siteConfig } from "@/lib/config";
import { isEmail, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface OrderItemInput {
  productId: number;
  qty: number;
  shade: string | null;
}

function clean(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function makeOrderNumber() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `ZC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
    const existing = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.orderNumber, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
  }
  return `ZC-${Date.now()}`;
}

export async function POST(request: Request) {
  try {
    await ensureDatabase();
    const body = (await request.json()) as Record<string, unknown>;

    const firstName = clean(body.firstName, 80);
    const lastName = clean(body.lastName, 80);
    const email = clean(body.email, 160).toLowerCase();
    const phone = clean(body.phone, 40);
    const address = clean(body.address, 300);
    const city = clean(body.city, 120);
    const province = clean(body.province, 120);
    const postalCode = clean(body.postalCode, 20);
    const country = clean(body.country, 120);
    const notes = clean(body.notes, 600);

    if (
      firstName.length < 2 ||
      lastName.length < 2 ||
      !isEmail(email) ||
      phone.replace(/\D/g, "").length < 9 ||
      address.length < 6 ||
      city.length < 2 ||
      province.length < 2 ||
      postalCode.length < 3 ||
      country.length < 2
    ) {
      return NextResponse.json(
        { ok: false, message: "Please provide complete and valid customer & delivery details." },
        { status: 400 }
      );
    }

    const rawItems = Array.isArray(body.items) ? (body.items as OrderItemInput[]) : [];
    if (rawItems.length === 0 || rawItems.length > 40) {
      return NextResponse.json(
        { ok: false, message: "Your beauty bag is empty." },
        { status: 400 }
      );
    }

    const items = rawItems
      .map((i) => ({
        productId: Number(i.productId),
        qty: Math.min(99, Math.max(1, Math.floor(Number(i.qty)))),
        shade: typeof i.shade === "string" ? i.shade.slice(0, 80) : null,
      }))
      .filter((i) => Number.isFinite(i.productId) && Number.isFinite(i.qty));

    if (items.length === 0) {
      return NextResponse.json({ ok: false, message: "Invalid cart." }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(products)
      .where(inArray(products.id, items.map((i) => i.productId)));

    const byId = new Map(rows.map((r) => [r.id, r]));
    for (const item of items) {
      const product = byId.get(item.productId);
      if (!product || product.status !== "active") {
        return NextResponse.json(
          { ok: false, message: "A product in your bag is no longer available." },
          { status: 400 }
        );
      }
      if (product.stock < item.qty) {
        return NextResponse.json(
          { ok: false, message: `Only ${product.stock} left of ${product.name}.` },
          { status: 400 }
        );
      }
    }

    let subtotal = 0;
    const pricedItems = items.map((item) => {
      const product = byId.get(item.productId)!;
      const unit = toNumber(product.salePrice ?? product.price);
      subtotal += unit * item.qty;
      return { item, product, unit };
    });

    const deliveryFee = subtotal >= siteConfig.freeDeliveryOver ? 0 : siteConfig.deliveryFee;
    const total = subtotal + deliveryFee;
    const orderNumber = await makeOrderNumber();

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        province,
        postalCode,
        country,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: total.toFixed(2),
        paymentStatus: "pending",
        paymentProvider: siteConfig.paymentProvider,
        status: "Pending",
        notes: notes || null,
      })
      .returning();

    await db.insert(orderItems).values(
      pricedItems.map(({ item, product, unit }) => ({
        orderId: order.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        shade: item.shade,
        quantity: item.qty,
        unitPrice: unit.toFixed(2),
        image: (product.images ?? [])[0] ?? null,
      }))
    );

    /* Inventory update */
    for (const { item, product } of pricedItems) {
      await db
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.qty}`,
          soldUnits: sql`${products.soldUnits} + ${item.qty}`,
        })
        .where(eq(products.id, product.id));
    }

    /*
      NOTE: order confirmation emails will be dispatched here once an email
      service is configured (see site config). Payment session creation for a
      real provider (Stripe / PayFast / Yoco) plugs in here as well.
    */

    return NextResponse.json({ ok: true, orderNumber });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong placing your order. Please try again." },
      { status: 500 }
    );
  }
}
