/* ------------------------------------------------------------------ */
/*  ZURI COSMETICS — SEED DATA                                         */
/*  Catalogue, variants (shades), tutorials, FAQs and clearly-labelled */
/*  sample reviews. Prices / stock are editable later via admin.       */
/* ------------------------------------------------------------------ */
import { db } from "./index";
import {
  categories,
  products,
  productVariants,
  reviews,
  tutorials,
  faqs,
  orderItems,
  orders,
  subscribers,
  inquiries,
} from "./schema";

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

const IMG = {
  lashTweezers: px(8558545),
  lashFlatlay: px(8558539),
  lashApply: px(7755650),
  lashHand: px(7755524),
  lashBrush: px(8558522),
  lashPro: px(7755523),
  lashPink: px(8558535),
  lashTools: px(8558524),
  lashFlower: px(8558549),
  lashBox: px(8558547),
  nailsSmoothie: px(36655811),
  nailsPalette: px(29877722),
  nailsRing: px(34835287),
  nailsFloral: px(38901355),
  nailsDesk: px(5554868),
  nailsPolka: px(3557600),
  nailsMarsh: px(27913837),
  nailsGlitter: px(34835286),
  nailsLeaf: px(11124895),
  nailsFlower: px(20758448),
  glossTubes: px(28736967),
  glossSmile: px(3762404),
  glossClose: px(3762403),
  glossNude: px(36620282),
  glossChain: px(15327041),
  lipsPortrait: px(1204505),
  glossFace: px(4691454),
  glossSix: px(2547462),
  glossApply: px(29185844),
  glossApply2: px(29185845),
  beautyBrush: px(7256115),
  beautyBeige: px(7256160),
  beautyPowder: px(7256131),
  beautyCrush: px(7256074),
  beautyRound: px(7256109),
  beautyLips: px(7256118),
  beautyShadow: px(7256061),
  beautyBottle: px(8049849),
};

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000);

type ProductSeed = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  whatsIncluded: string[];
  specifications: Record<string, string>;
  ingredients?: string;
  price: string;
  salePrice?: string;
  stock: number;
  sku: string;
  featured?: boolean;
  bestSeller?: boolean;
  images: string[];
  tags: string[];
  soldUnits: number;
  createdDaysAgo: number;
  variants?: { name: string; hex: string }[];
};

const CATALOGUE: ProductSeed[] = [
  /* ----------------------------- LASHES ----------------------------- */
  {
    slug: "cluster-lashes-application-kit",
    name: "Cluster Lashes + Application Kit",
    category: "lashes",
    shortDescription:
      "A complete at-home lash set — soft cluster lashes with everything needed for a flawless, buildable application.",
    description:
      "The Zuri Cluster Lashes + Application Kit is your complete at-home lash ritual. Lightweight, feather-soft clusters are designed to be layered for a look that is entirely your own — from a whisper of volume to full evening glamour. The kit includes every tool required for a precise, comfortable application, so your first set looks like your tenth. Build your lash look, your way, in minutes.",
    whatsIncluded: [
      "Cluster lashes",
      "Lash glue",
      "Lash application tongs",
      "Spooly",
    ],
    specifications: {
      Style: "Buildable cluster lashes",
      Finish: "Soft matte silk",
      Uses: "Reusable with proper care",
      Kit: "4-piece application set",
    },
    price: "349.00",
    stock: 24,
    sku: "ZUR-LASH-001",
    featured: true,
    bestSeller: true,
    images: [IMG.lashTweezers, IMG.lashFlatlay, IMG.lashBox],
    tags: ["lashes", "kit"],
    soldUnits: 186,
    createdDaysAgo: 120,
  },
  {
    slug: "strip-lashes-application-kit",
    name: "Strip Lashes + Application Kit",
    category: "lashes",
    shortDescription:
      "One-swipe elegance. A full strip lash set with glue, tongs and spooly for an effortless polished finish.",
    description:
      "For days when you want instant, seamless polish, the Zuri Strip Lashes + Application Kit delivers a full lash line in a single placement. The flexible band melts into your natural lashes while the included glue, tongs and spooly keep your application precise from first try. Elegant, quick and beautifully simple.",
    whatsIncluded: [
      "Strip lashes",
      "Lash glue",
      "Lash application tongs",
      "Spooly",
    ],
    specifications: {
      Style: "Full strip lash",
      Band: "Flexible invisible band",
      Uses: "Reusable with proper care",
      Kit: "4-piece application set",
    },
    price: "299.00",
    stock: 18,
    sku: "ZUR-LASH-002",
    featured: true,
    images: [IMG.lashApply, IMG.lashPro, IMG.lashTools],
    tags: ["lashes", "kit"],
    soldUnits: 142,
    createdDaysAgo: 110,
  },
  {
    slug: "cluster-lashes",
    name: "Cluster Lashes",
    category: "lashes",
    shortDescription:
      "Feather-light lash clusters for a customisable, natural-to-dramatic lash look.",
    description:
      "Standalone Zuri Cluster Lashes for the lash lover who already owns her tools. Each cluster is hand-finished, feather-light and tapered to blend seamlessly with your natural lashes. Place a few for everyday softness, or build a full set for occasions that call for more.",
    whatsIncluded: ["Cluster lashes (full set)"],
    specifications: {
      Style: "Buildable cluster lashes",
      Finish: "Soft matte silk",
      Uses: "Reusable with proper care",
    },
    price: "229.00",
    stock: 30,
    sku: "ZUR-LASH-003",
    bestSeller: true,
    images: [IMG.lashPink, IMG.lashHand],
    tags: ["lashes"],
    soldUnits: 210,
    createdDaysAgo: 95,
  },
  {
    slug: "strip-lashes",
    name: "Strip Lashes",
    category: "lashes",
    shortDescription:
      "The classic full-strip lash — soft, wispy and designed to flatter every eye shape.",
    description:
      "Standalone Zuri Strip Lashes in our signature wispy silhouette. A thin, flexible band keeps wear comfortable from morning to midnight, while the tapered fibres add length and softness without heaviness.",
    whatsIncluded: ["Strip lashes (one pair)"],
    specifications: {
      Style: "Full strip lash",
      Band: "Flexible invisible band",
      Uses: "Reusable with proper care",
    },
    price: "189.00",
    stock: 26,
    sku: "ZUR-LASH-004",
    images: [IMG.lashFlower, IMG.lashBrush],
    tags: ["lashes"],
    soldUnits: 168,
    createdDaysAgo: 90,
  },
  {
    slug: "lash-glue-remover",
    name: "Lash Glue Remover",
    category: "lashes",
    shortDescription:
      "Gentle, precise remover that dissolves lash adhesive for safe, easy lash removal.",
    description:
      "Say goodbye to tugging. Zuri Lash Glue Remover softly dissolves adhesive so your lashes lift away cleanly — protecting both your natural lashes and your Zuri sets for reuse. A must-have step in every lash ritual.",
    whatsIncluded: ["Lash glue remover (precision applicator)"],
    specifications: {
      Use: "Dissolves lash adhesive",
      Application: "Precision brush tip",
      Suitable: "Cluster & strip lashes",
    },
    ingredients:
      "Full ingredient listing is printed on each product package and will be published here once confirmed by our supplier.",
    price: "129.00",
    stock: 40,
    sku: "ZUR-LASH-005",
    images: [IMG.lashTools, IMG.beautyBottle],
    tags: ["lashes", "care"],
    soldUnits: 240,
    createdDaysAgo: 80,
  },

  /* ------------------------------ NAILS ------------------------------ */
  {
    slug: "acrylic-press-on-nails",
    name: "Acrylic Press-On Nails",
    category: "nails",
    shortDescription:
      "Salon-shaped acrylic press-ons in a curated edit of soft luxury shades.",
    description:
      "Zuri Acrylic Press-On Nails give you a flawless salon set in minutes — no appointment, no drying time. Each set is pre-shaped and pre-finished in our soft-luxury shade edit, with a durable acrylic body that wears beautifully and removes gently.",
    whatsIncluded: ["Full press-on nail set", "Mini nail file", "Application guide"],
    specifications: {
      Material: "Premium acrylic",
      Finish: "Glossy salon shine",
      Wear: "Up to multiple wears with care",
      Sizing: "Multiple sizes per set",
    },
    price: "259.00",
    stock: 22,
    sku: "ZUR-NAIL-001",
    featured: true,
    bestSeller: true,
    images: [IMG.nailsRing, IMG.nailsFloral, IMG.nailsSmoothie],
    tags: ["nails"],
    soldUnits: 198,
    createdDaysAgo: 100,
    variants: [
      { name: "Blush Nude", hex: "#E5C3B4" },
      { name: "Soft Pink", hex: "#F2C4CD" },
      { name: "Lavender Mist", hex: "#D8CFEA" },
      { name: "Champagne", hex: "#EBD6AE" },
      { name: "Mauve Velvet", hex: "#B78A9E" },
      { name: "French Tip", hex: "#F6EEE8" },
    ],
  },
  {
    slug: "gel-press-on-nails",
    name: "Gel Press-On Nails",
    category: "nails",
    shortDescription:
      "Gel-finished press-ons with a cushioned, glass-like shine that lasts wear after wear.",
    description:
      "Our Gel Press-On Nails are cured with a plush gel top coat for a depth of shine that reads like a fresh salon gel manicure. Flexible, comfortable and endlessly re-wearable with proper care.",
    whatsIncluded: ["Full press-on nail set", "Mini nail file", "Application guide"],
    specifications: {
      Material: "Gel-coated acrylic",
      Finish: "High-shine gel",
      Wear: "Up to multiple wears with care",
      Sizing: "Multiple sizes per set",
    },
    price: "279.00",
    stock: 20,
    sku: "ZUR-NAIL-002",
    featured: true,
    images: [IMG.nailsGlitter, IMG.nailsMarsh, IMG.nailsPolka],
    tags: ["nails"],
    soldUnits: 154,
    createdDaysAgo: 70,
    variants: [
      { name: "Petal Pink", hex: "#F5D2DA" },
      { name: "Milky White", hex: "#F5F0EA" },
      { name: "Lilac Dream", hex: "#DBD2ED" },
      { name: "Rose Quartz", hex: "#EAC7CC" },
    ],
  },
  {
    slug: "nail-art-stickers",
    name: "Nail Art Stickers",
    category: "nails",
    shortDescription:
      "Delicate self-adhesive nail art — gold leaf, pearl dust and fine floral lines.",
    description:
      "Finish your Zuri set with a jewellery-like detail. Our Nail Art Stickers are ultra-thin, self-adhesive designs that settle smoothly under top coat for a painted-by-an-artist effect in seconds.",
    whatsIncluded: ["2 sheets of nail art stickers (24+ decals)"],
    specifications: {
      Type: "Self-adhesive nail decals",
      Sheets: "2 per pack",
      Finish: "Smooth under top coat",
    },
    price: "89.00",
    stock: 3,
    sku: "ZUR-NAIL-003",
    images: [IMG.nailsPalette, IMG.nailsDesk],
    tags: ["nails", "art"],
    soldUnits: 96,
    createdDaysAgo: 45,
    variants: [
      { name: "Gold Leaf", hex: "#C8A05D" },
      { name: "Pearl Dust", hex: "#EEE6DC" },
      { name: "Floral Line", hex: "#E2B6C3" },
    ],
  },
  {
    slug: "base-coat",
    name: "Base Coat",
    category: "nails",
    shortDescription:
      "A smoothing protective base that grips polish and guards your natural nail.",
    description:
      "The first step of every Zuri nail ritual. Our Base Coat creates a smooth, even canvas, improves adhesion for press-on adhesives and polishes, and helps prevent staining.",
    whatsIncluded: ["Base coat (brush applicator)"],
    specifications: { Use: "Prep & protection", Volume: "Confirmed on package", Dry: "Quick-dry formula" },
    ingredients:
      "Full ingredient listing is printed on each product package and will be published here once confirmed by our supplier.",
    price: "119.00",
    stock: 28,
    sku: "ZUR-NAIL-004",
    images: [IMG.beautyBottle, IMG.nailsPalette],
    tags: ["nails", "care"],
    soldUnits: 120,
    createdDaysAgo: 60,
  },
  {
    slug: "top-coat",
    name: "Top Coat",
    category: "nails",
    shortDescription:
      "A glass-shine top coat that seals your manicure and extends its wear.",
    description:
      "Lock in your look. Zuri Top Coat adds a cushioned, glass-like shine while sealing nail art and polish against everyday wear.",
    whatsIncluded: ["Top coat (brush applicator)"],
    specifications: { Use: "Seal & shine", Volume: "Confirmed on package", Finish: "High gloss" },
    ingredients:
      "Full ingredient listing is printed on each product package and will be published here once confirmed by our supplier.",
    price: "129.00",
    stock: 28,
    sku: "ZUR-NAIL-005",
    images: [IMG.nailsMarsh, IMG.beautyBottle],
    tags: ["nails", "care"],
    soldUnits: 115,
    createdDaysAgo: 60,
  },
  {
    slug: "cuticle-oil",
    name: "Cuticle Oil",
    category: "nails",
    shortDescription:
      "A lightweight nourishing oil that keeps cuticles soft and nails looking healthy.",
    description:
      "A drop a day keeps your manicure looking fresh. Zuri Cuticle Oil absorbs quickly without grease, conditioning cuticles and framing your nails beautifully — worn bare or pressed-on.",
    whatsIncluded: ["Cuticle oil (brush applicator)"],
    specifications: { Use: "Daily cuticle care", Texture: "Lightweight, fast-absorbing", Volume: "Confirmed on package" },
    ingredients:
      "Full ingredient listing is printed on each product package and will be published here once confirmed by our supplier.",
    price: "99.00",
    stock: 45,
    sku: "ZUR-NAIL-006",
    bestSeller: true,
    images: [IMG.nailsFlower, IMG.beautyRound],
    tags: ["nails", "care"],
    soldUnits: 232,
    createdDaysAgo: 85,
  },
  {
    slug: "nail-care-kit",
    name: "Nail Care Kit",
    category: "nails",
    shortDescription:
      "The complete at-home manicure prep set — every tool for salon-ready nails.",
    description:
      "Everything between you and a flawless press-on application. The Zuri Nail Care Kit gathers all six prep essentials in one soft-touch case, so your natural nails are perfectly prepped and pampered before every set.",
    whatsIncluded: [
      "Nail filer",
      "Buffer",
      "Cuticle cutter",
      "Nail brush",
      "Cuticle oil",
      "Moisturiser",
    ],
    specifications: { Pieces: "6-piece prep set", Case: "Soft-touch travel case", Use: "Manicure prep & aftercare" },
    price: "249.00",
    stock: 15,
    sku: "ZUR-NAIL-007",
    featured: true,
    images: [IMG.nailsDesk, IMG.beautyBrush, IMG.nailsLeaf],
    tags: ["nails", "care", "kit"],
    soldUnits: 88,
    createdDaysAgo: 40,
  },
  {
    slug: "cuticle-care-tools",
    name: "Cuticle Care Tools",
    category: "nails",
    shortDescription:
      "Precision stainless tools for tidy cuticles and a clean manicure canvas.",
    description:
      "A precision trio for gentle cuticle care. Stainless steel tools with fine, comfortable grips make at-home prep feel considered and calm.",
    whatsIncluded: ["Cuticle cutter", "Cuticle pusher", "Nail brush"],
    specifications: { Material: "Stainless steel", Pieces: "3-piece tool set", Use: "Cuticle prep" },
    price: "149.00",
    stock: 0,
    sku: "ZUR-NAIL-008",
    images: [IMG.beautyBrush, IMG.nailsDesk],
    tags: ["nails", "care"],
    soldUnits: 64,
    createdDaysAgo: 30,
  },

  /* ---------------------------- LIPGLOSS ----------------------------- */
  {
    slug: "plain-lip-gloss",
    name: "Plain Lip Gloss",
    category: "lipgloss",
    shortDescription:
      "Crystal clear, high-shine gloss for lips that catch the light.",
    description:
      "The Zuri Plain Lip Gloss is pure shine — a cushiony, non-sticky clear gloss that wears beautifully alone or layered over liner and lipstick. One swipe, glass lips.",
    whatsIncluded: ["Plain lip gloss with doe-foot applicator"],
    specifications: { Finish: "High shine", Texture: "Cushiony, non-sticky", Wear: "Layer or wear alone" },
    ingredients:
      "Full ingredient listing is printed on each product package and will be published here once confirmed by our supplier.",
    price: "109.00",
    stock: 32,
    sku: "ZUR-LIP-001",
    images: [IMG.glossChain, IMG.glossFace, IMG.glossTubes],
    tags: ["lips", "gloss"],
    soldUnits: 176,
    createdDaysAgo: 75,
    variants: [{ name: "Clear Crystal", hex: "#F2E8E2" }],
  },
  {
    slug: "colour-lip-gloss",
    name: "Colour Lip Gloss",
    category: "lipgloss",
    shortDescription:
      "A wash of soft colour with mirror shine — in a growing edit of Zuri shades.",
    description:
      "Gloss your way. Zuri Colour Lip Glosses blend a sheer wash of pigment with our signature mirror shine. Choose your mood from our soft-luxury shade edit — new shades are added to the collection as they arrive.",
    whatsIncluded: ["Colour lip gloss with doe-foot applicator"],
    specifications: { Finish: "Mirror shine, sheer colour", Texture: "Cushiony, non-sticky", Shades: "Growing edit" },
    ingredients:
      "Full ingredient listing is printed on each product package and will be published here once confirmed by our supplier.",
    price: "119.00",
    stock: 29,
    sku: "ZUR-LIP-002",
    featured: true,
    bestSeller: true,
    images: [IMG.glossSmile, IMG.glossClose, IMG.glossSix],
    tags: ["lips", "gloss"],
    soldUnits: 264,
    createdDaysAgo: 65,
    variants: [
      { name: "Clear", hex: "#F1E7E1" },
      { name: "Nude", hex: "#D8A78E" },
      { name: "Pink", hex: "#E799A7" },
      { name: "Mauve", hex: "#B77E94" },
      { name: "Brown", hex: "#996A51" },
      { name: "Berry", hex: "#9F516A" },
    ],
  },
  {
    slug: "lip-liner",
    name: "Lip Liner",
    category: "lipgloss",
    shortDescription:
      "A creamy precision liner to sculpt, define and set the stage for gloss.",
    description:
      "Define your canvas. Zuri Lip Liners glide on creamy, set softly and pair perfectly with our glosses — outline, fill, or blur for a soft-focus lip. Shade range grows with the collection.",
    whatsIncluded: ["Lip liner pencil (sharpenable)"],
    specifications: { Finish: "Soft matte", Texture: "Creamy glide", Shades: "Growing edit" },
    ingredients:
      "Full ingredient listing is printed on each product package and will be published here once confirmed by our supplier.",
    price: "95.00",
    stock: 31,
    sku: "ZUR-LIP-003",
    images: [IMG.beautyLips, IMG.glossNude, IMG.glossApply2],
    tags: ["lips", "liner"],
    soldUnits: 141,
    createdDaysAgo: 50,
    variants: [
      { name: "Nude", hex: "#C8917A" },
      { name: "Pink", hex: "#D88995" },
      { name: "Mauve", hex: "#A86F85" },
      { name: "Brown", hex: "#895943" },
      { name: "Berry", hex: "#8D495D" },
    ],
  },
];

const TUTORIALS = [
  {
    slug: "lash-prep",
    title: "Preparing Your Natural Lashes",
    category: "lashes",
    description:
      "Start with a clean, oil-free lash line. Curl, comb and prep so your Zuri lashes sit seamlessly and last longer.",
    videoUrl: "https://videos.pexels.com/video-files/3971913/3971913-hd_1920_1080_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/3971913/pexels-photo-3971913.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Cleanse the eye area and remove all oil-based makeup",
      "Curl natural lashes gently from the root",
      "Comb through with the Zuri spooly",
      "Ensure lashes are completely dry before application",
    ],
    durationLabel: "Short guide",
    sortOrder: 1,
  },
  {
    slug: "cluster-lash-application",
    title: "Applying Cluster Lashes",
    category: "lashes",
    description:
      "Build your lash look cluster by cluster — placement, spacing and blending for a custom finish.",
    videoUrl: "https://videos.pexels.com/video-files/7754495/7754495-hd_1920_1080_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/7754495/pexels-photo-7754495.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Pick up a cluster with the lash application tongs",
      "Dip the base lightly into lash glue",
      "Place under the natural lash line, outer corner first",
      "Work inwards, keeping clusters evenly spaced",
      "Blend with the spooly once dry",
    ],
    durationLabel: "Short guide",
    sortOrder: 2,
  },
  {
    slug: "strip-lash-application",
    title: "Applying Strip Lashes",
    category: "lashes",
    description:
      "Measure, glue and place a full strip lash in one confident move.",
    videoUrl: "https://videos.pexels.com/video-files/12322768/12322768-hd_1920_1080_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/12322768/pexels-photo-12322768.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Measure the strip against your lash line and trim if needed",
      "Apply a thin bead of glue along the band",
      "Wait until the glue turns tacky",
      "Place at the centre, then secure inner and outer corners",
    ],
    durationLabel: "Short guide",
    sortOrder: 3,
  },
  {
    slug: "lash-glue-and-tongs",
    title: "Using Lash Glue & Application Tongs",
    category: "lashes",
    description:
      "The two tools that make application effortless — how much glue to use and how to hold your tongs.",
    videoUrl: "https://videos.pexels.com/video-files/10491722/10491722-hd_1920_1080_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/10491722/pexels-photo-10491722.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Hold tongs at a comfortable angle, gripping the lash base",
      "Use a thin, even bead of glue — less is more",
      "Allow glue to become tacky before placing",
      "Clean tongs after every use",
    ],
    durationLabel: "Short guide",
    sortOrder: 4,
  },
  {
    slug: "safe-lash-removal",
    title: "Removing Lashes Safely",
    category: "lashes",
    description:
      "Protect your natural lashes and reuse your Zuri sets — removal the gentle way with Lash Glue Remover.",
    videoUrl: "https://videos.pexels.com/video-files/6961746/6961746-uhd_3840_2160_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/6961746/pexels-photo-6961746.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Apply Lash Glue Remover along the lash band",
      "Wait for the adhesive to soften",
      "Lift lashes away gently with tongs — never pull",
      "Clean and store your Zuri lashes for reuse",
    ],
    durationLabel: "Short guide",
    sortOrder: 5,
  },
  {
    slug: "nail-prep",
    title: "Preparing & Cleaning Natural Nails",
    category: "nails",
    description:
      "The secret to press-ons that last: clean, buffed, oil-free natural nails.",
    videoUrl: "https://videos.pexels.com/video-files/7820126/7820126-hd_1920_1080_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/7820126/adult-arts-and-crafts-bathroom-beauty-7820126.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Remove old polish and wash hands thoroughly",
      "Push back cuticles gently",
      "Buff the nail surface lightly",
      "Wipe each nail free of dust and oil",
    ],
    durationLabel: "Short guide",
    sortOrder: 6,
  },
  {
    slug: "nail-sizing",
    title: "Choosing Your Correct Nail Size",
    category: "nails",
    description:
      "Match each nail to the widest point of your natural nail for a seamless, comfortable fit.",
    videoUrl: "https://videos.pexels.com/video-files/3997856/3997856-uhd_4096_2160_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/3997856/pexels-photo-3997856.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Line up each press-on over your natural nail",
      "Choose the size that covers edge to edge",
      "Between sizes? Size up and file gently",
      "Lay your ten sizes out in order before applying",
    ],
    durationLabel: "Short guide",
    sortOrder: 7,
  },
  {
    slug: "press-on-application",
    title: "Applying Adhesive & Press-On Nails",
    category: "nails",
    description:
      "Adhesive tabs or glue — apply your full set in minutes with salon precision.",
    videoUrl: "https://videos.pexels.com/video-files/7754856/7754856-hd_1920_1080_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/7754856/adult-applying-beauty-beauty-salon-posters-7754856.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Apply adhesive to the natural nail, not the press-on",
      "Angle the press-on at 45° at the cuticle",
      "Press down firmly from cuticle to tip",
      "Hold for 15–20 seconds per nail",
    ],
    durationLabel: "Short guide",
    sortOrder: 8,
  },
  {
    slug: "press-on-positioning",
    title: "Correct Positioning & Making Press-Ons Last",
    category: "nails",
    description:
      "Positioning, pressure and aftercare — the habits that extend your wear.",
    videoUrl: "https://videos.pexels.com/video-files/7754857/7754857-hd_1920_1080_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/7754857/beauty-beauty-salon-posters-cosmetics-facial-7754857.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Keep a hairline gap at the cuticle — never overlap skin",
      "Avoid water for the first hour after application",
      "Massage cuticle oil around (not under) the nail daily",
      "Re-press any lifting edges gently",
    ],
    durationLabel: "Short guide",
    sortOrder: 9,
  },
  {
    slug: "press-on-removal",
    title: "Removing Press-On Nails Safely",
    category: "nails",
    description:
      "Never peel. Loosen, soak and lift — keeping natural nails healthy for the next set.",
    videoUrl: "https://videos.pexels.com/video-files/4783391/4783391-uhd_3840_2160_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/4783391/active-lifestyle-adult-adults-only-beautician-4783391.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    steps: [
      "Soak nails in warm, soapy water or oil",
      "Gently twist each press-on from the sides",
      "Never peel or force a nail that resists — soak longer",
      "Buff lightly and nourish with cuticle oil",
    ],
    durationLabel: "Short guide",
    sortOrder: 10,
  },
];

const FAQS = [
  {
    question: "How do I apply the lashes?",
    answer:
      "Start with clean, oil-free lashes. For cluster lashes, pick up each cluster with the application tongs, dip the base lightly in lash glue and place it under your natural lash line, working from the outer corner inwards. For strip lashes, apply a thin bead of glue to the band, wait until tacky, then place at the centre of your lash line and secure the corners. Every Zuri lash order includes an application guide, and our Tutorials page walks you through each step on video.",
    category: "lashes",
    sortOrder: 1,
  },
  {
    question: "How do I remove lashes?",
    answer:
      "Never pull. Apply Zuri Lash Glue Remover along the lash band, wait for the adhesive to soften, then lift the lashes away gently with your tongs. Clean the lashes and store them in their tray so they are ready for their next wear.",
    category: "lashes",
    sortOrder: 2,
  },
  {
    question: "How long do press-on nails last?",
    answer:
      "Wear time depends on your natural nails, prep and daily activities. With careful prep (clean, buffed, oil-free nails) and correct application, Zuri press-ons can last from several days up to a couple of weeks. Daily cuticle oil around the nail and avoiding prolonged water exposure in the first hour helps extend wear.",
    category: "nails",
    sortOrder: 3,
  },
  {
    question: "How do I choose my press-on nail size?",
    answer:
      "Match each press-on to the widest point of your natural nail, from sidewall to sidewall. If you fall between two sizes, choose the larger and file the sides gently for a custom fit. Each Zuri set includes multiple sizes and a sizing guide.",
    category: "nails",
    sortOrder: 4,
  },
  {
    question: "How do I remove press-on nails?",
    answer:
      "Soak your nails in warm soapy water or oil to loosen the adhesive, then gently twist each press-on from the sides. Never peel or force them — soak a little longer instead. Finish by buffing lightly and massaging in cuticle oil.",
    category: "nails",
    sortOrder: 5,
  },
  {
    question: "How long does delivery take?",
    answer:
      `Our current delivery estimate is ${process.env.NEXT_PUBLIC_DELIVERY_ESTIMATE || "2 – 5 working days across South Africa"}. You will receive an order confirmation with your order number as soon as your order is placed, and tracking details once your parcel ships.`,
    category: "delivery",
    sortOrder: 6,
  },
  {
    question: "What payment methods are available?",
    answer:
      "Zuri Cosmetics is integrating secure online payment providers (such as card payments and instant EFT). Until online payments go live, your order is recorded securely and our team confirms a secure payment method with you directly. We never store card details on our servers.",
    category: "payments",
    sortOrder: 7,
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "We understand plans change. Contact us on WhatsApp or email with your order number as soon as possible — if your order has not yet been prepared for dispatch, we will do our best to update or cancel it for you.",
    category: "orders",
    sortOrder: 8,
  },
  {
    question: "How can I contact Zuri Cosmetics?",
    answer:
      "The fastest way to reach us is the WhatsApp button in the corner of every page. You can also use our Contact page form or email us — full details are on the Contact page. Our team responds during business hours.",
    category: "general",
    sortOrder: 9,
  },
  {
    question: "What happens if I receive the wrong product?",
    answer:
      "We are sorry before we even begin — that is not the Zuri experience we want for you. Message us on WhatsApp with your order number and a photo of what arrived. We will arrange the correct product or a resolution as quickly as possible.",
    category: "orders",
    sortOrder: 10,
  },
];

async function main() {
  console.log("🌸 Seeding Zuri Cosmetics…");

  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(reviews);
  await db.delete(productVariants);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(tutorials);
  await db.delete(faqs);
  await db.delete(subscribers);
  await db.delete(inquiries);

  const cats = await db
    .insert(categories)
    .values([
      {
        slug: "lashes",
        name: "Lashes",
        tagline: "Your perfect lash look, made effortless.",
        description:
          "Feather-light cluster and strip lashes, plus every tool your lash ritual needs — glue, tongs, spoolies and gentle removal.",
        image: "/images/cat-lashes.jpg",
        sortOrder: 1,
      },
      {
        slug: "nails",
        name: "Nails",
        tagline: "Salon-inspired nails, from the comfort of home.",
        description:
          "Acrylic and gel press-on nails, delicate nail art and the complete care edit — base coats, top coats, cuticle love and prep kits.",
        image: "/images/cat-nails.jpg",
        sortOrder: 2,
      },
      {
        slug: "lipgloss",
        name: "LipGloss",
        tagline: "Gloss your way.",
        description:
          "High-shine plain gloss, sheer colour glosses and creamy lip liners in a soft-luxury shade edit that keeps on growing.",
        image: "/images/cat-lipgloss.jpg",
        sortOrder: 3,
      },
    ])
    .returning();

  const catBySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  for (const p of CATALOGUE) {
    const [inserted] = await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        categoryId: catBySlug[p.category],
        shortDescription: p.shortDescription,
        description: p.description,
        whatsIncluded: p.whatsIncluded,
        specifications: p.specifications,
        ingredients: p.ingredients ?? null,
        price: p.price,
        salePrice: p.salePrice ?? null,
        stock: p.stock,
        sku: p.sku,
        featured: p.featured ?? false,
        bestSeller: p.bestSeller ?? false,
        status: "active",
        images: p.images,
        tags: p.tags,
        soldUnits: p.soldUnits,
        sortOrder: 0,
        createdAt: daysAgo(p.createdDaysAgo),
      })
      .returning();

    if (p.variants?.length) {
      await db.insert(productVariants).values(
        p.variants.map((v, i) => ({
          productId: inserted.id,
          name: v.name,
          hex: v.hex,
          sortOrder: i,
        }))
      );
    }
  }

  const productBySlug = Object.fromEntries(
    (await db.select().from(products)).map((p) => [p.slug, p])
  );

  /* Sample reviews — clearly labelled as sample content in the UI.
     Portraits feature South African women (Black, Coloured, white). */
  await db.insert(reviews).values([
    {
      productId: productBySlug["cluster-lashes-application-kit"].id,
      authorName: "Amahle M.",
      avatar: "/images/review-amahle.jpg",
      location: "Johannesburg",
      rating: 5,
      title: "Sample review — design preview",
      body: "Sample content shown to preview the review layout. The clusters are feather-light and the kit makes application so easy. Real customer reviews will appear here once submissions are open.",
      status: "approved",
      isSample: true,
    },
    {
      productId: productBySlug["acrylic-press-on-nails"].id,
      authorName: "Chané P.",
      avatar: "/images/review-chane.jpg",
      location: "Cape Town",
      rating: 5,
      title: "Sample review — design preview",
      body: "Sample content shown to preview the review layout. Salon-perfect nails in minutes and the pastel shades are gorgeous. Real customer reviews will appear here once submissions are open.",
      status: "approved",
      isSample: true,
    },
    {
      productId: productBySlug["colour-lip-gloss"].id,
      authorName: "Emma van der Merwe",
      avatar: "/images/review-emma.jpg",
      location: "Durban",
      rating: 4,
      title: "Sample review — design preview",
      body: "Sample content shown to preview the review layout. Beautiful high-shine finish that isn't sticky at all. Real customer reviews will appear here once submissions are open.",
      status: "approved",
      isSample: true,
    },
  ]);

  await db.insert(tutorials).values(TUTORIALS);
  await db.insert(faqs).values(FAQS);

  console.log(
    `✅ Seeded ${CATALOGUE.length} products, ${cats.length} categories, ${TUTORIALS.length} tutorials, ${FAQS.length} FAQs.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
