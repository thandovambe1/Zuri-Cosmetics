import { IMG } from "@/lib/media";

/**
 * ZURI COSMETICS — initial (demo) catalogue.
 *
 * Prices & imagery are sample placeholders that are easy to replace from the
 * admin area (/admin) or this file. Nothing here pretends to be a real
 * business claim.
 */

export const CATEGORY_SEED = [
  {
    name: "Lashes",
    slug: "lashes",
    tagline: "Your perfect lash look, made effortless.",
    description:
      "Cluster lashes, strip lashes and complete application kits — everything you need for fluttery, effortless lashes at home.",
    image: IMG.catLashes,
    sortOrder: 1,
  },
  {
    name: "Nails",
    slug: "nails",
    tagline: "Salon-inspired nails, from the comfort of home.",
    description:
      "Premium press-on nails and nail-care essentials for a flawless, salon-quality finish in minutes.",
    image: IMG.catNails,
    sortOrder: 2,
  },
  {
    name: "LipGloss",
    slug: "lipgloss",
    tagline: "Gloss your way.",
    description:
      "High-shine glosses and defining lip liners in a curated range of wearable shades.",
    image: IMG.catLipgloss,
    sortOrder: 3,
  },
] as const;

type SeedProduct = {
  category: string;
  name: string;
  priceCents: number;
  stock: number;
  tagline?: string;
  description?: string;
  salePriceCents?: number;
  sku?: string;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  images?: string[];
  included?: string[];
  specs?: Record<string, string>;
  ingredients?: string;
  variants?: { label: string; name: string; value: string; stock?: number; sku?: string }[];
};

const L = (name: string, priceCents: number, salePriceCents: number | undefined, stock: number, extra: Partial<SeedProduct>): SeedProduct => ({
  category: "lashes",
  name,
  priceCents,
  salePriceCents,
  stock,
  ...extra,
});

export const PRODUCT_SEED: SeedProduct[] = [
  // ─────────────────────────── LASHES ───────────────────────────
  L("Cluster Lashes + Application Kit", 24900, 19900, 42, {
    tagline: "Everything you need for a soft, wispy lash look in one kit.",
    description:
      "Our signature Cluster Lashes + Application Kit pairs feather-light cluster lashes with professional-grade lash glue, precision application tongs and a spooly — so you can create a beautiful, customised lash look in minutes. Perfect for beginners and lash lovers alike.",
    sku: "ZR-LASH-KIT-CL",
    featured: true,
    bestSeller: true,
    images: [IMG.lashKitCluster, IMG.lashCluster, IMG.lashGlue],
    included: [
      "1 set of wispy cluster lashes (multi-length)",
      "Clear lash glue (5 ml)",
      "Lash application tongs",
      "Lash spooly brush",
      "Step-by-step application guide",
    ],
    specs: {
      "Lash type": "Cluster (wispy, multi-length)",
      "Includes": "Lashes, glue, tongs, spooly",
      "Reusable": "Yes — up to 10 wears with care",
      "Removal": "Use Lash Glue Remover",
    },
  }),
  L("Strip Lashes + Application Kit", 26900, undefined, 30, {
    tagline: "Classic strip lashes with everything you need to apply them.",
    description:
      "A full, glamorous strip lash paired with gentle lash glue, precision application tongs and a spooly. One seamless sweep and your eyes are transformed — elegant, defined and utterly effortless.",
    sku: "ZR-LASH-KIT-ST",
    bestSeller: true,
    isNew: true,
    images: [IMG.lashKitStrip, IMG.lashStrip, IMG.lashGlue],
    included: [
      "1 pair of premium strip lashes",
      "Clear lash glue (5 ml)",
      "Lash application tongs",
      "Lash spooly brush",
    ],
    specs: {
      "Lash type": "Strip (full volume)",
      "Band": "Soft, flexible invisible band",
      "Reusable": "Yes — up to 15 wears with care",
      "Removal": "Use Lash Glue Remover",
    },
  }),
  L("Cluster Lashes", 12900, undefined, 80, {
    tagline: "Feather-light cluster lashes for a customised flutter.",
    description:
      "Standalone wispy cluster lashes in a soft, natural curl. Layer a few clusters for a subtle enhancement or build up for full glam — the choice is yours. Sold separately for refills and custom lash looks.",
    sku: "ZR-LASH-CL",
    featured: true,
    images: [IMG.lashCluster, IMG.lashKitCluster],
    included: ["1 set of wispy cluster lashes", "Mini spooly"],
    specs: {
      "Lash type": "Cluster (wispy)",
      "Length": "8–14 mm mixed",
      "Curl": "Soft D curl",
      "Reusable": "Yes — with proper care",
    },
  }),
  L("Strip Lashes", 13900, undefined, 60, {
    tagline: "Statement strip lashes, ready to sweep on.",
    description:
      "Our reusable strip lashes feature a feather-soft invisible band and a beautiful natural-to-dramatic volume. Standalone pair — ideal for refills or gifting with our lash glue.",
    sku: "ZR-LASH-ST",
    bestSeller: true,
    images: [IMG.lashStrip, IMG.lashKitStrip],
    included: ["1 pair of premium strip lashes"],
    specs: {
      "Lash type": "Strip",
      "Length": "Full length, trimmable",
      "Band": "Invisible, flexible",
      "Reusable": "Yes — with proper care",
    },
  }),
  L("Lash Glue Remover", 8900, undefined, 90, {
    tagline: "Safe, gentle removal in seconds.",
    description:
      "A gentle, oil-free lash glue remover that dissolves adhesive safely and quickly — no pulling, no tugging, no damage to your natural lashes. Keep your lash routine kind to your eyes.",
    sku: "ZR-LASH-REM",
    featured: true,
    images: [IMG.lashRemover, IMG.lashKitCluster],
    included: ["Lash glue remover (10 ml)", "Foam applicator tips"],
    specs: {
      "Format": "Liquid remover",
      "Volume": "10 ml",
      "Skin type": "Suitable for sensitive eyes",
      "Usage": "Apply, wait a few seconds, gently remove",
    },
    ingredients: "Isododecane, cyclopentasiloxane, dimethicone, fragrance-free formula.",
  }),
  L("Clear Lash Glue", 7900, undefined, 120, {
    tagline: "Long-wear, crystal-clear adhesive.",
    description:
      "A fast-drying, crystal-clear latex-free lash adhesive with a comfortable hold that lasts all day. Designed for both cluster and strip lashes.",
    sku: "ZR-LASH-GLUE",
    images: [IMG.lashGlue, IMG.lashKitCluster],
    included: ["Clear lash glue (5 ml)"],
    specs: {
      "Format": "Liquid adhesive",
      "Volume": "5 ml",
      "Finish": "Crystal clear",
      "Wear": "Up to 12 hours",
    },
    ingredients: "Latex-free acrylic copolymer formula.",
  }),

  // ─────────────────────────── NAILS ───────────────────────────
  {
    category: "nails",
    name: "Acrylic Press-On Nails",
    tagline: "Sculpted acrylic look — no salon visit needed.",
    description:
      "Gorgeous, salon-sculpted acrylic press-on nails in a curated design. Each set includes 24 nails in 12 sizes so you get a flawless, personalised fit. Apply in minutes and wear for up to two weeks.",
    priceCents: 18900,
    sku: "ZR-NAIL-ACR",
    stock: 65,
    featured: true,
    bestSeller: true,
    isNew: true,
    images: [IMG.nailAcrylic, IMG.nailAlt2, IMG.nailAlt3],
    included: [
      "24 press-on nails (12 sizes)",
      "Adhesive tabs",
      "Mini file & cuticle stick",
      "Application guide",
    ],
    specs: {
      "Style": "Acrylic sculpted",
      "Nails per set": "24 (12 sizes)",
      "Wear time": "7–14 days",
      "Removal": "Soak & gentle lift",
    },
    variants: [
      { label: "Style", name: "Glitter Accent", value: "#E8B4C8" },
      { label: "Style", name: "Soft Blush", value: "#F2C6CF" },
    ],
  },
  {
    category: "nails",
    name: "Gel Press-On Nails",
    tagline: "High-shine gel finish, applied in minutes.",
    description:
      "Mirror-gloss gel press-on nails with a lightweight, flexible fit that feels like a professional gel manicure. Long-lasting shine, zero drying time, effortless removal.",
    priceCents: 19900,
    salePriceCents: 16900,
    sku: "ZR-NAIL-GEL",
    stock: 55,
    featured: true,
    images: [IMG.nailGel, IMG.nailAlt1, IMG.nailAcrylic],
    included: ["24 gel press-on nails (12 sizes)", "Gel adhesive tabs", "Mini file", "Cuticle stick"],
    specs: {
      "Style": "Gel finish",
      "Nails per set": "24 (12 sizes)",
      "Finish": "High-shine gel",
      "Wear time": "7–14 days",
    },
    variants: [
      { label: "Style", name: "Pink Glitter", value: "#E79BB0" },
      { label: "Style", name: "Champagne Shimmer", value: "#E7C9A0" },
      { label: "Style", name: "Lavender Veil", value: "#C7B8E0" },
    ],
  },
  {
    category: "nails",
    name: "Nail Art Stickers",
    tagline: "Instant art for your tips.",
    description:
      "A delicate sheet of premium nail art stickers — florals, foils and fine details that elevate any manicure in seconds. Layer over polish or press-ons for a designer finish.",
    priceCents: 7900,
    sku: "ZR-NAIL-ART",
    stock: 110,
    isNew: true,
    images: [IMG.nailStickers, IMG.nailAcrylic],
    included: ["1 sheet of nail art stickers", "Tweezer for precise placement"],
    specs: {
      "Designs per sheet": "18+",
      "Application": "Over dry polish / gel / press-ons",
      "Seal": "Optional top coat for longer wear",
    },
  },
  {
    category: "nails",
    name: "Base Coat",
    tagline: "The perfect foundation for every manicure.",
    description:
      "A smooth, ridge-filling base coat that preps your natural nail and helps your manicure — or press-ons — last longer. Clear, quick-dry and gentle on nails.",
    priceCents: 9900,
    sku: "ZR-NAIL-BASE",
    stock: 95,
    images: [IMG.nailBase, IMG.nailTop],
    included: ["Base coat (12 ml)"],
    specs: {
      "Volume": "12 ml",
      "Finish": "Clear",
      "Role": "Prep, adhesion & ridge fill",
    },
  },
  {
    category: "nails",
    name: "Top Coat",
    tagline: "Glossy, protective shine that lasts.",
    description:
      "A high-gloss, quick-dry top coat that seals colour and locks in shine — the final step to a chip-resistant, salon-smooth finish at home.",
    priceCents: 9900,
    sku: "ZR-NAIL-TOP",
    stock: 95,
    bestSeller: true,
    images: [IMG.nailTop, IMG.nailBase],
    included: ["Top coat (12 ml)"],
    specs: {
      "Volume": "12 ml",
      "Finish": "High gloss",
      "Drying": "Quick-dry",
    },
  },
  {
    category: "nails",
    name: "Cuticle Oil",
    tagline: "Nourish, soften, glow.",
    description:
      "A silky blend of jojoba and vitamin E that hydrates cuticles and keeps nails healthy and luminous. Use daily for stronger, happier nails.",
    priceCents: 11900,
    sku: "ZR-NAIL-OIL",
    stock: 85,
    featured: true,
    images: [IMG.nailCuticleOil, IMG.nailTools],
    included: ["Cuticle oil (10 ml) with precision dropper"],
    specs: {
      "Volume": "10 ml",
      "Key ingredients": "Jojoba oil, vitamin E",
      "Usage": "Massage into cuticles 1–2× daily",
    },
    ingredients: "Jojoba oil, sweet almond oil, vitamin E, fragrance.",
  },
  {
    category: "nails",
    name: "Nail Care Kit",
    tagline: "The complete at-home nail spa.",
    description:
      "Everything you need for a professional at-home manicure: file, buffer, cuticle cutter, nail brush, cuticle oil and moisturiser — beautifully boxed and ready to gift or keep.",
    priceCents: 34900,
    salePriceCents: 29900,
    sku: "ZR-NAIL-KIT",
    stock: 40,
    featured: true,
    bestSeller: true,
    images: [IMG.nailCareKit, IMG.nailTools, IMG.nailCuticleOil],
    included: [
      "Nail filer",
      "Buffer",
      "Cuticle cutter",
      "Nail brush",
      "Cuticle oil",
      "Hand moisturiser",
      "Premium storage box",
    ],
    specs: {
      "Pieces": "6 tools + box",
      "Contains": "Filer, buffer, cutter, brush, oil, moisturiser",
      "Use": "At-home manicure prep & care",
    },
  },
  {
    category: "nails",
    name: "Cuticle Care Tools",
    tagline: "Precision tools for a clean, tidy nail bed.",
    description:
      "A refined set of stainless-steel cuticle tools — pusher and precision nippers — for neatly groomed cuticles and flawless nail-prep before press-ons or polish.",
    priceCents: 15900,
    sku: "ZR-NAIL-TOOLS",
    stock: 70,
    images: [IMG.nailTools, IMG.nailCareKit],
    included: ["Cuticle pusher", "Precision nippers", "Protective pouch"],
    specs: {
      "Material": "Stainless steel",
      "Includes": "Pusher, nippers, pouch",
      "Care": "Clean with alcohol after use",
    },
  },

  // ─────────────────────────── LIPGLOSS ───────────────────────────
  {
    category: "lipgloss",
    name: "Plain Lip Gloss",
    tagline: "Crystal-clear, high-shine gloss.",
    description:
      "The original Zuri gloss — a crystal-clear, non-sticky formula that delivers a mirror-like high shine with a cushiony, hydrating feel. Wear alone for effortless shine or over lip liner for definition.",
    priceCents: 11900,
    sku: "ZR-LIP-CLEAR",
    stock: 130,
    featured: true,
    bestSeller: true,
    images: [IMG.lipPlainGloss, IMG.lipGlossApp],
    included: ["Plain lip gloss (5 ml)"],
    specs: {
      "Finish": "Crystal high-shine",
      "Volume": "5 ml",
      "Texture": "Non-sticky cushion",
      "Shades": "Clear",
    },
    ingredients: "Polybutene, diisostearyl malate, vitamin E, natural mint oil.",
    variants: [
      { label: "Shade", name: "Clear", value: "#F7E9E1", stock: 130 },
    ],
  },
  {
    category: "lipgloss",
    name: "Colour Lip Glosses",
    tagline: "Sheer, juicy colour in your favourite shades.",
    description:
      "Our signature gloss, now in colour. Sheer-to-medium buildable pigment, the same cushiony non-sticky shine, and a shade for every mood — from barely-there nudes to rich berries. New shades are added regularly.",
    priceCents: 13900,
    sku: "ZR-LIP-COLOUR",
    stock: 200,
    featured: true,
    bestSeller: true,
    images: [IMG.lipShades, IMG.lipSwatches],
    included: ["Colour lip gloss (5 ml)"],
    specs: {
      "Finish": "Glossy with sheer colour",
      "Volume": "5 ml",
      "Texture": "Non-sticky cushion",
      "Buildable": "Yes — sheer to medium",
    },
    ingredients: "Polybutene, diisostearyl malate, mica, vitamin E, natural mint oil.",
    variants: [
      { label: "Shade", name: "Clear", value: "#F7E9E1", stock: 40, sku: "ZR-LIP-CL" },
      { label: "Shade", name: "Nude", value: "#D9A98C", stock: 35, sku: "ZR-LIP-NU" },
      { label: "Shade", name: "Pink", value: "#E79BB0", stock: 30, sku: "ZR-LIP-PK" },
      { label: "Shade", name: "Mauve", value: "#B38A9E", stock: 28, sku: "ZR-LIP-MV" },
      { label: "Shade", name: "Brown", value: "#8A5A3B", stock: 25, sku: "ZR-LIP-BR" },
      { label: "Shade", name: "Rose", value: "#E26D8A", stock: 30, sku: "ZR-LIP-RO" },
      { label: "Shade", name: "Champagne", value: "#E7C9A0", stock: 26, sku: "ZR-LIP-CH" },
    ],
  },
  {
    category: "lipgloss",
    name: "Lip Liners",
    tagline: "Define, line and perfect your pout.",
    description:
      "Creamy, long-wearing lip liners that define, fill and perfect your lips — the secret to a polished gloss look that stays in place. Available in a curated range of shades.",
    priceCents: 9900,
    sku: "ZR-LIP-LINER",
    stock: 150,
    featured: true,
    images: [IMG.lipLiners, IMG.lipLinersAlt, IMG.lipSwatches],
    included: ["Lip liner pencil (1.2 g)"],
    specs: {
      "Finish": "Matte, creamy",
      "Weight": "1.2 g",
      "Wear": "Long-wearing, smudge-resistant",
      "Tip": "Retractable, no sharpening needed",
    },
    ingredients: "Hydrogenated vegetable oil, carnauba wax, candelilla wax, mineral pigments.",
    variants: [
      { label: "Shade", name: "Nude", value: "#C89B7B", stock: 35, sku: "ZR-LIN-NU" },
      { label: "Shade", name: "Mauve", value: "#A97E95", stock: 32, sku: "ZR-LIN-MV" },
      { label: "Shade", name: "Rose", value: "#C96A80", stock: 30, sku: "ZR-LIN-RO" },
      { label: "Shade", name: "Brown", value: "#7A4E33", stock: 30, sku: "ZR-LIN-BR" },
      { label: "Shade", name: "Berry", value: "#8E2F55", stock: 26, sku: "ZR-LIN-BE" },
    ],
  },
];

export const TUTORIAL_SEED = [
  {
    title: "How to Prepare Your Natural Lashes",
    category: "lashes",
    description: "Clean, curl and prime your natural lashes before application for the longest-lasting look.",
    videoUrl: "https://videos.pexels.com/video-files/7754495/7754495-hd_1920_1080_30fps.mp4",
    poster: "https://images.pexels.com/videos/7754495/pexels-photo-7754495.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "02:14",
    sortOrder: 1,
  },
  {
    title: "Applying Cluster Lashes Step by Step",
    category: "lashes",
    description: "How to place, press and blend wispy clusters for a seamless custom lash look.",
    videoUrl: "https://videos.pexels.com/video-files/12322768/12322768-hd_1920_1080_30fps.mp4",
    poster: "https://images.pexels.com/videos/12322768/pexels-photo-12322768.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "03:05",
    sortOrder: 2,
  },
  {
    title: "Applying Strip Lashes Like a Pro",
    category: "lashes",
    description: "Measure, trim and sweep on a full strip lash — the effortless glam routine.",
    videoUrl: "https://videos.pexels.com/video-files/6961746/6961746-uhd_3840_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/6961746/pexels-photo-6961746.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "02:48",
    sortOrder: 3,
  },
  {
    title: "Using Lash Glue & Application Tongs",
    category: "lashes",
    description: "Get the perfect glue consistency and master the tongs for precise placement.",
    videoUrl: "https://videos.pexels.com/video-files/3971913/3971913-hd_1920_1080_25fps.mp4",
    poster: "https://images.pexels.com/videos/3971913/pexels-photo-3971913.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "02:31",
    sortOrder: 4,
  },
  {
    title: "Removing Lashes Safely",
    category: "lashes",
    description: "Gentle, damage-free removal using Lash Glue Remover — never pull, always dissolve.",
    videoUrl: "https://videos.pexels.com/video-files/6980769/6980769-uhd_4096_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/6980769/pexels-photo-6980769.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "02:20",
    sortOrder: 5,
  },
  {
    title: "Prepare & Clean Your Natural Nails",
    category: "nails",
    description: "Shape, buff and cleanse your nail beds so press-ons bond beautifully and last.",
    videoUrl: "https://videos.pexels.com/video-files/30706938/13138131_1920_1080_30fps.mp4",
    poster: "https://images.pexels.com/videos/30706938/aesthetic-beauty-beauty-beauty-industry-fashion-30706938.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "01:58",
    sortOrder: 6,
  },
  {
    title: "Choosing the Correct Press-On Size",
    category: "nails",
    description: "Match each nail to your natural nail bed for a flawless, comfortable fit.",
    videoUrl: "https://videos.pexels.com/video-files/7754856/7754856-hd_1920_1080_30fps.mp4",
    poster: "https://images.pexels.com/videos/7754856/adult-applying-beauty-beauty-salon-posters-7754856.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "02:12",
    sortOrder: 7,
  },
  {
    title: "Applying & Positioning Press-On Nails",
    category: "nails",
    description: "Adhesive application, correct positioning and pressing for a secure, lasting bond.",
    videoUrl: "https://videos.pexels.com/video-files/16117268/16117268-hd_1920_1080_30fps.mp4",
    poster: "https://images.pexels.com/videos/16117268/fingernails-hydration-manicure-pedicure-16117268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "02:40",
    sortOrder: 8,
  },
  {
    title: "Making Press-Ons Last Longer & Safe Removal",
    category: "nails",
    description: "Daily care tips to extend wear — plus gentle removal that protects natural nails.",
    videoUrl: "https://videos.pexels.com/video-files/3997858/3997858-uhd_4096_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/3997858/pexels-photo-3997858.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    durationLabel: "03:18",
    sortOrder: 9,
  },
];

/** Sample reviews — clearly flagged as sample content in the UI (isSample). */
export const REVIEW_SEED: { productSlug: string; name: string; rating: number; title: string; content: string }[] = [
  {
    productSlug: "cluster-lashes-application-kit",
    name: "Amahle D.",
    rating: 5,
    title: "So easy, so gorgeous",
    content: "Sample review — the kit has everything and my lashes looked flawless on the first try. Obsessed with the tongs!",
  },
  {
    productSlug: "cluster-lashes-application-kit",
    name: "Lerato M.",
    rating: 5,
    title: "My new everyday look",
    content: "Sample review — light, comfortable and reusable. Delivery was quick and the packaging feels so premium.",
  },
  {
    productSlug: "acrylic-press-on-nails",
    name: "Naledi K.",
    rating: 5,
    title: "Salon nails at home",
    content: "Sample review — nobody believes these are press-ons. Sizing guide made it so simple.",
  },
  {
    productSlug: "colour-lip-glosses",
    name: "Thandi S.",
    rating: 4,
    title: "Beautiful shades",
    content: "Sample review — Nude and Mauve are stunning. Non-sticky and lasts through coffee.",
  },
];
