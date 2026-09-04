/**
 * ZURI COSMETICS — central brand & store configuration.
 *
 * Everything here is a CONFIGURABLE PLACEHOLDER. Replace values with real
 * business information (WhatsApp number, email, socials, shipping fee, etc.)
 * when available — no code changes required elsewhere.
 */

export const siteConfig = {
  name: "Zuri Cosmetics",
  legalName: "ZURI COSMETICS",
  tagline: "Soft Luxury Beauty",
  description:
    "Zuri Cosmetics is a curated luxury beauty brand offering premium lashes, press-on nails, nail care and lip essentials designed to make beautiful, effortless beauty accessible at home.",

  // ── Contact / commerce placeholders (configure me!) ──────────────────────
  // WhatsApp number in international format, digits only (e.g. "27741234567")
  whatsappNumber: "27740000000",
  whatsappMessage:
    "Hi Zuri Cosmetics! I need help with my order/website.",
  email: "hello@zuricosmetics.co.za",
  supportEmail: "support@zuricosmetics.co.za",
  phoneDisplay: "+27 74 000 0000",

  // Social media — leave "" to hide the icon until real handles exist.
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },

  // ── Delivery (configurable placeholders) ─────────────────────────────────
  delivery: {
    feeCents: 6000, // R 60.00 standard delivery
    freeOverCents: 120000, // free delivery over R 1,200.00
    estimate: "2 – 5 working days within South Africa",
  },

  // ── Payments ─────────────────────────────────────────────────────────────
  // Payment is intentionally NOT faked. Order totals & status are persisted;
  // a real provider (PayFast / PayGate / Stripe etc.) can be wired in later by
  // reading PAYMENT_PROVIDER / PAYMENT_* secrets from the environment.
  payment: {
    provider: process.env.PAYMENT_PROVIDER || "eft", // "eft" | "card" | "payfast" ...
    providerName: process.env.PAYMENT_PROVIDER_NAME || "Bank transfer (EFT)",
  },

  // ── Currency ─────────────────────────────────────────────────────────────
  currency: "ZAR",
  currencySymbol: "R",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Lashes", href: "/lashes" },
  { label: "Nails", href: "/nails" },
  { label: "LipGloss", href: "/lipgloss" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Editable FAQ content (manage here or via future admin tooling). */
export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "How do I apply the lashes?",
    a: "We recommend starting with clean, dry natural lashes. Gently curl your natural lashes, apply a thin layer of lash glue to the band (or cluster base), wait 20–30 seconds until tacky, then press the lash onto your lash line using the application tongs. Visit our Zuri Beauty Tutorials page for step-by-step video guides.",
  },
  {
    q: "How do I remove lashes?",
    a: "Soak a cotton pad with our Lash Glue Remover and hold it over your closed eye for a few seconds, then gently peel the lash away from the outer corner. Never pull lashes off dry, as this can damage your natural lashes.",
  },
  {
    q: "How long do press-on nails last?",
    a: "With correct preparation and application, Zuri press-on nails typically last 7–14 days. Avoid soaking your nails in water for long periods and wear gloves for cleaning to extend wear.",
  },
  {
    q: "How do I choose my press-on nail size?",
    a: "Every Zuri set includes 24 nails in 12 sizes. Match each press-on to your natural nail — it should cover the full nail bed without touching the cuticle or skin at the sides. Follow the size chart shown in the press-on nail tutorial for the best fit.",
  },
  {
    q: "How do I remove press-on nails?",
    a: "Use the included cuticle stick to gently lift the edge, then soak nails in warm, soapy water (or use our Cuticle Oil) and ease each nail off slowly. Avoid prying or twisting, which can damage natural nails.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 2–5 working days within South Africa. Orders are dispatched from our studio within 24–48 hours of payment confirmation.",
  },
  {
    q: "What payment methods are available?",
    a: "We currently accept secure bank transfer (EFT). Card and instant payment options are being added — once a payment provider is configured you will see them here automatically.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Yes — if your order has not yet been dispatched, contact us on WhatsApp or email within 24 hours and we will happily update or cancel your order.",
  },
  {
    q: "How can I contact Zuri Cosmetics?",
    a: "The quickest way is our WhatsApp button (bottom-right of every page). You can also email us — our details are on the Contact page and in the footer.",
  },
  {
    q: "What happens if I receive the wrong product?",
    a: "We are so sorry! Contact us on WhatsApp or email within 7 days of receiving your order with your order number and a photo, and we will arrange a replacement or refund as quickly as possible.",
  },
];

/** Order statuses used across the platform. */
export const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

/** Allowed filters on the Shop page. */
export const PRICE_BANDS: { id: string; label: string; min?: number; max?: number }[] = [
  { id: "any", label: "Any price" },
  { id: "under150", label: "Under R 150", max: 15000 },
  { id: "150-250", label: "R 150 – R 250", min: 15000, max: 25000 },
  { id: "250-400", label: "R 250 – R 400", min: 25000, max: 40000 },
  { id: "over400", label: "Over R 400", min: 40000 },
];

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "bestselling", label: "Best Selling" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
] as const;
