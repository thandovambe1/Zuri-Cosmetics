import { NextResponse } from "next/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, products, productVariants } from "@/db/schema";
import { ensureSeeded } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type IncomingItem = { productId?: number; variantId?: number; quantity?: number };

function clean(v: unknown): string {
  return String(v ?? "").trim();
}

export async function POST(req: Request) {
  try {
    await ensureSeeded();
    const body = (await req.json().catch(() => ({}))) as {
      customer?: { firstName?: string; lastName?: string; email?: string; phone?: string };
      delivery?: {
        address?: string;
        address2?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        country?: string;
        notes?: string;
      };
      items?: IncomingItem[];
      paymentMethod?: string;
    };

    const customer = body.customer ?? {};
    const delivery = body.delivery ?? {};
    const items = Array.isArray(body.items) ? body.items : [];
    const paymentMethod = body.paymentMethod === "card" ? "card" : "eft";

    // ── Validate customer & delivery ──
    const firstName = clean(customer.firstName).slice(0, 60);
    const lastName = clean(customer.lastName).slice(0, 60);
    const email = clean(customer.email).toLowerCase().slice(0, 254);
    const phone = clean(customer.phone).slice(0, 30);
    const address = clean(delivery.address).slice(0, 200);
    const address2 = clean(delivery.address2).slice(0, 200) || null;
    const city = clean(delivery.city).slice(0, 80);
    const province = clean(delivery.province).slice(0, 80);
    const postalCode = clean(delivery.postalCode).slice(0, 20);
    const country = clean(delivery.country).slice(0, 80);
    const notes = clean(delivery.notes).slice(0, 600) || null;

    const fail = (message: string, status = 400) => NextResponse.json({ ok: false, error: message }, { status });

    if (!firstName || !lastName) return fail("Please provide your first and last name.");
    if (!EMAIL_RE.test(email)) return fail("Please provide a valid email address.");
    if (phone && phone.replace(/\D/g, "").length < 7) return fail("Please provide a valid phone number.");
    if (!address || !city || !province || !postalCode || !country) {
      return fail("Please complete your delivery address.");
    }
    if (items.length === 0) return fail("Your bag is empty.");

    // ── Load products & variants from the database (never trust the client) ──
    const productIds = [...new Set(items.map((i) => Number(i.productId)).filter((n) => Number.isInteger(n) && n > 0))];
    if (productIds.length === 0) return fail("Your bag contains invalid items.");

    const productRows = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, productIds), eq(products.status, "active")));
    const productMap = new Map(productRows.map((p) => [p.id, p]));

    const variantIds = [...new Set(items.map((i) => Number(i.variantId)).filter((n) => Number.isInteger(n) && n > 0))];
    const variantRows = variantIds.length ? await db.select().from(productVariants).where(inArray(productVariants.id, variantIds)) : [];
    const variantMap = new Map(variantRows.map((v) => [v.id, v]));

    // ── Build validated lines & recompute totals server-side ──
    const lines: {
      productId: number;
      productName: string;
      variantId: number | null;
      variantLabel: string | null;
      sku: string | null;
      image: string | null;
      unitPriceCents: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const product = productMap.get(productId);
      if (!product) return fail("One of your items is no longer available.");

      const unit =
        product.salePriceCents && product.salePriceCents > 0 && product.salePriceCents < product.priceCents
          ? product.salePriceCents
          : product.priceCents;

      let variantId: number | null = null;
      let variantLabel: string | null = null;
      let variantSku: string | null = null;
      let variantImage: string | null = null;
      let maxStock = product.stock;

      if (item.variantId) {
        const variant = variantMap.get(Number(item.variantId));
        if (!variant || variant.productId !== productId) return fail(`Invalid option for ${product.name}.`);
        variantId = variant.id;
        variantLabel = variant.label ? `${variant.label}: ${variant.name}` : variant.name;
        variantSku = variant.sku;
        variantImage = variant.image;
        maxStock = Math.min(maxStock, variant.stock);
      }

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return fail(`Invalid quantity for ${product.name}.`);
      }
      if (maxStock < quantity) {
        return fail(`Sorry — only ${maxStock} of ${product.name} left in stock. Please adjust your bag.`, 409);
      }

      lines.push({
        productId,
        productName: product.name,
        variantId,
        variantLabel,
        sku: variantSku ?? product.sku,
        image: variantImage ?? product.images?.[0] ?? null,
        unitPriceCents: unit,
        quantity,
      });
    }

    const subtotalCents = lines.reduce((acc, l) => acc + l.unitPriceCents * l.quantity, 0);
    const deliveryCents =
      subtotalCents === 0 || subtotalCents >= siteConfig.delivery.freeOverCents ? 0 : siteConfig.delivery.feeCents;
    const totalCents = subtotalCents + deliveryCents;

    // ── Persist order + items in a transaction, decrementing stock ──
    let orderNumber = "";
    await db.transaction(async (tx) => {
      for (const line of lines) {
        const result = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${line.quantity}`, updatedAt: new Date() })
          .where(and(eq(products.id, line.productId), sql`${products.stock} >= ${line.quantity}`));
        if (result.rowCount === 0) throw new Error(`STOCK:${line.productName}`);

        if (line.variantId) {
          const vr = await tx
            .update(productVariants)
            .set({ stock: sql`${productVariants.stock} - ${line.quantity}` })
            .where(and(eq(productVariants.id, line.variantId), sql`${productVariants.stock} >= ${line.quantity}`));
          if (vr.rowCount === 0) throw new Error(`STOCK:${line.productName} (option)`);
        }
      }

      for (let attempt = 0; attempt < 6; attempt++) {
        const candidate = `ZC-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).toUpperCase().slice(2, 6)}`;
        const dup = await tx.select({ id: orders.id }).from(orders).where(eq(orders.orderNumber, candidate)).limit(1);
        if (dup.length === 0) {
          orderNumber = candidate;
          break;
        }
      }
      if (!orderNumber) throw new Error("Could not allocate an order number. Please retry.");

      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber,
          firstName,
          lastName,
          email,
          phone: phone || null,
          address,
          address2,
          city,
          province,
          postalCode,
          country,
          notes,
          subtotalCents,
          deliveryCents,
          totalCents,
          paymentMethod,
          paymentStatus: "pending",
          orderStatus: "pending",
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        lines.map((l) => ({
          orderId: order.id,
          productId: l.productId,
          productName: l.productName,
          variantLabel: l.variantLabel,
          unitPriceCents: l.unitPriceCents,
          quantity: l.quantity,
          image: l.image,
          sku: l.sku,
        }))
      );
    });

    return NextResponse.json({
      ok: true,
      orderNumber,
      totals: { subtotalCents, deliveryCents, totalCents },
      message: "Order received. Payment confirmation pending.",
    });
  } catch (err) {
    const message = (err as Error)?.message ?? "Unknown error";
    if (message.startsWith("STOCK:")) {
      const name = message.slice(6);
      return NextResponse.json(
        { ok: false, error: `Sorry — ${name} just sold out or has less stock than requested. Please update your bag.` },
        { status: 409 }
      );
    }
    console.error("order error", err);
    return NextResponse.json({ ok: false, error: "We couldn't place your order right now. Please try again." }, { status: 500 });
  }
}
