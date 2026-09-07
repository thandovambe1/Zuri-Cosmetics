"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { siteConfig } from "@/lib/config";
import { formatPrice, isEmail } from "@/lib/utils";
import { IconLock, IconTruck, IconWhatsApp } from "@/components/icons";
import { whatsappLink } from "@/lib/config";

interface Fields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  notes: string;
}

const EMPTY: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  country: "South Africa",
  notes: "",
};

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

export default function CheckoutForm({ paymentsConfigured }: { paymentsConfigured: boolean }) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const delivery =
    items.length === 0
      ? 0
      : subtotal >= siteConfig.freeDeliveryOver
        ? 0
        : siteConfig.deliveryFee;
  const total = subtotal + delivery;

  const set = (key: keyof Fields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (fields.firstName.trim().length < 2) next.firstName = "Required";
    if (fields.lastName.trim().length < 2) next.lastName = "Required";
    if (!isEmail(fields.email)) next.email = "Valid email required";
    if (fields.phone.replace(/\D/g, "").length < 9) next.phone = "Valid phone required";
    if (fields.address.trim().length < 6) next.address = "Required";
    if (fields.city.trim().length < 2) next.city = "Required";
    if (!fields.province) next.province = "Required";
    if (fields.postalCode.trim().length < 3) next.postalCode = "Required";
    if (fields.country.trim().length < 2) next.country = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setState("error");
      setMessage("Your beauty bag is empty — add a product before checking out.");
      return;
    }
    if (!validate()) {
      setState("error");
      setMessage("Please complete the highlighted fields.");
      return;
    }
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          items: items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            shade: i.shade,
          })),
        }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string; orderNumber?: string };
      if (!res.ok || !data.ok || !data.orderNumber) {
        throw new Error(data.message ?? "Could not place your order.");
      }
      clear();
      router.push(`/order/${data.orderNumber}`);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const input = (
    key: keyof Fields,
    label: string,
    props: { type?: string; placeholder?: string; autoComplete?: string } = {}
  ) => (
    <label className="block">
      <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">
        {label}
      </span>
      <input
        type={props.type ?? "text"}
        value={fields[key]}
        onChange={(e) => set(key)(e.target.value)}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        className={`field-lux mt-2 ${errors[key] ? "!border-[#b0565e]" : ""}`}
        aria-invalid={Boolean(errors[key])}
      />
      {errors[key] && <span className="mt-1 block text-[0.66rem] text-[#b0565e]">{errors[key]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <div className="space-y-10">
        <section className="card-lux p-7 sm:p-9">
          <h2 className="font-display text-3xl text-ink">Customer details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {input("firstName", "First name", { autoComplete: "given-name", placeholder: "Amahle" })}
            {input("lastName", "Last name", { autoComplete: "family-name", placeholder: "Naidoo" })}
            {input("email", "Email", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
            {input("phone", "Phone number", { type: "tel", autoComplete: "tel", placeholder: "082 000 0000" })}
          </div>
        </section>

        <section className="card-lux p-7 sm:p-9">
          <h2 className="font-display text-3xl text-ink">Delivery details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              {input("address", "Address", {
                autoComplete: "street-address",
                placeholder: "Street address, apartment, suburb",
              })}
            </div>
            {input("city", "City", { autoComplete: "address-level2", placeholder: "Johannesburg" })}
            <label className="block">
              <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">
                Province
              </span>
              <select
                value={fields.province}
                onChange={(e) => set("province")(e.target.value)}
                className={`field-lux mt-2 ${errors.province ? "!border-[#b0565e]" : ""}`}
              >
                <option value="">Select province</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.province && (
                <span className="mt-1 block text-[0.66rem] text-[#b0565e]">{errors.province}</span>
              )}
            </label>
            {input("postalCode", "Postal code", { autoComplete: "postal-code", placeholder: "2000" })}
            {input("country", "Country", { autoComplete: "country-name" })}
            <div className="sm:col-span-2">
              <label className="block">
                <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">
                  Order notes <span className="normal-case">(optional)</span>
                </span>
                <textarea
                  value={fields.notes}
                  onChange={(e) => set("notes")(e.target.value)}
                  className="field-lux mt-2 min-h-24 resize-y"
                  placeholder="Delivery instructions, gift note…"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="card-lux p-7 sm:p-9">
          <h2 className="flex items-center gap-3 font-display text-3xl text-ink">
            <IconLock className="h-6 w-6 text-gold-deep" />
            Payment
          </h2>
          {paymentsConfigured ? (
            <p className="mt-4 text-sm leading-relaxed text-plum">
              You will be redirected to our secure payment provider to complete your
              purchase. Card details are handled entirely by the provider.
            </p>
          ) : (
            <div className="mt-5 rounded-[1rem] border border-gold/30 bg-blush/60 p-5">
              <p className="text-sm leading-relaxed text-cocoa">
                Secure online payments are being connected for Zuri Cosmetics. When you
                place this order, it is recorded safely as{" "}
                <strong className="font-medium">Pending Payment</strong> — our team will
                confirm a secure payment method with you by email or WhatsApp.{" "}
                <strong className="font-medium">
                  No card or payment details are collected or stored on this website.
                </strong>
              </p>
              <p className="mt-3 text-[0.68rem] leading-relaxed text-plum">
                A payment provider (Stripe, PayFast, Yoco or similar) can be enabled in
                site configuration without changes to this checkout.
              </p>
            </div>
          )}
        </section>

        {state === "error" && (
          <p className="rounded-[1rem] border border-[#b0565e]/40 bg-[#b0565e]/8 px-5 py-4 text-sm text-[#b0565e]" role="alert">
            {message}
          </p>
        )}

        <button type="submit" className="btn-lux btn-blush w-full" disabled={state === "loading"}>
          {state === "loading" ? "Placing your order…" : "Place order"}
        </button>
        <p className="text-center text-[0.66rem] leading-relaxed tracking-[0.14em] text-plum uppercase">
          By placing your order you agree to our terms & conditions
        </p>
      </div>

      {/* Order summary */}
      <aside className="h-fit lg:sticky lg:top-32">
        <div className="card-lux p-7 sm:p-8">
          <h2 className="font-display text-2xl text-ink">Order summary</h2>
          {items.length === 0 ? (
            <p className="mt-4 text-sm text-plum">
              Your bag is empty.{" "}
              <a href="/shop" className="link-sweep text-gold-deep">
                Shop Zuri Cosmetics
              </a>
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {items.map((i) => (
                <li key={`${i.productId}-${i.shade ?? ""}`} className="flex gap-3.5">
                  <span className="relative block w-14 shrink-0 overflow-hidden rounded-[0.7rem] border border-mauve/20">
                    <img src={i.image} alt={i.name} className="aspect-[4/5] w-full object-cover" />
                    <span className="absolute -top-0 -right-0 flex h-5 min-w-5 items-center justify-center rounded-bl-[0.6rem] bg-ink/80 px-1 text-[0.6rem] text-cream">
                      {i.qty}
                    </span>
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm leading-snug text-ink">{i.name}</span>
                    {i.shade && (
                      <span className="mt-0.5 block text-[0.62rem] tracking-[0.16em] text-plum uppercase">
                        {i.shade}
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-cocoa">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-6 space-y-3 border-t border-gold/25 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-plum">Subtotal</dt>
              <dd className="text-cocoa">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-plum">Delivery</dt>
              <dd className="text-cocoa">{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-gold/25 pt-3 font-display text-xl">
              <dt className="text-ink">Total</dt>
              <dd className="gold-text font-semibold">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-5 flex items-start gap-2.5 text-[0.68rem] leading-relaxed text-plum">
            <IconTruck className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
            {siteConfig.deliveryEstimate}
          </p>
          <a
            href={whatsappLink("Hi Zuri Cosmetics! I need help with my order/website.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2.5 text-[0.68rem] leading-relaxed text-plum transition-colors hover:text-whatsapp"
          >
            <IconWhatsApp className="h-4 w-4 shrink-0 text-whatsapp" />
            Need help? Chat with us on WhatsApp
          </a>
        </div>
      </aside>
    </form>
  );
}
