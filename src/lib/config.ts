/* ------------------------------------------------------------------ */
/*  ZURI COSMETICS — SITE CONFIGURATION                                */
/*  Every business detail below is configurable through environment    */
/*  variables. Placeholder values are used until real details are      */
/*  supplied — nothing is invented as "real" business information.     */
/* ------------------------------------------------------------------ */

const env = (key: string, fallback: string) => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : fallback;
};

export const siteConfig = {
  name: "Zuri Cosmetics",
  tagline: "Beauty, made effortless.",
  url: env("NEXT_PUBLIC_SITE_URL", "https://www.zuricosmetics.co.za"),
  currency: "ZAR",

  /** WhatsApp Business — configurable number (international format, digits only). */
  whatsappNumber: env("NEXT_PUBLIC_WHATSAPP_NUMBER", "27000000000"),
  whatsappNumberIsPlaceholder: !process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  whatsappMessage: env(
    "NEXT_PUBLIC_WHATSAPP_MESSAGE",
    "Hi Zuri Cosmetics! I need help with my order/website."
  ),

  /** Contact details — configurable placeholders. */
  email: env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@zuricosmetics.co.za"),
  emailIsPlaceholder: !process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  address: env("NEXT_PUBLIC_BUSINESS_ADDRESS", "South Africa (address to be confirmed)"),
  hours: env("NEXT_PUBLIC_BUSINESS_HOURS", "Mon – Fri, 09:00 – 17:00 (SAST)"),

  /** Social handles — configurable placeholders. */
  instagram: env("NEXT_PUBLIC_INSTAGRAM_HANDLE", "https://instagram.com/zuricosmetics"),
  facebook: env("NEXT_PUBLIC_FACEBOOK_HANDLE", "https://facebook.com/zuricosmetics"),
  tiktok: env("NEXT_PUBLIC_TIKTOK_HANDLE", "https://tiktok.com/@zuricosmetics"),

  /** Delivery — configurable fees & estimates. */
  deliveryFee: Number(env("NEXT_PUBLIC_DELIVERY_FEE", "85")),
  freeDeliveryOver: Number(env("NEXT_PUBLIC_FREE_DELIVERY_OVER", "750")),
  deliveryEstimate: env("NEXT_PUBLIC_DELIVERY_ESTIMATE", "2 – 5 working days across South Africa"),

  /** Payments — a real provider (Stripe / PayFast / Yoco…) plugs in here later. */
  paymentProvider: process.env.PAYMENT_PROVIDER ?? null,
  paymentsConfigured: Boolean(process.env.PAYMENT_PROVIDER && process.env.PAYMENT_SECRET_KEY),
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    message ?? siteConfig.whatsappMessage
  )}`;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Lashes", href: "/lashes" },
  { label: "Nails", href: "/nails" },
  { label: "LipGloss", href: "/lipgloss" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
