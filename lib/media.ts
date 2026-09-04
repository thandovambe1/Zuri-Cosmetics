/**
 * Central media asset map for Zuri Cosmetics.
 * Swap these URLs to replace imagery anywhere in the store.
 */
const px = (id: number, w = 940, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const IMG = {
  // Hero & lifestyle
  heroFlatlay: px(5632324, 1400, 1000),
  aboutPortrait: px(5240242, 900, 1200),
  aboutFlatlay: px(5492852, 1200, 900),
  glamPortrait: px(5240241, 900, 1200),
  pastelProducts: px(5632404, 1200, 900),
  serumPink: px(15930068, 900, 1100),

  // Categories
  catLashes: px(8558524, 1200, 1500),
  catNails: px(6135680, 1200, 1500),
  catLipgloss: px(7256139, 1200, 1500),

  // Lashes
  lashKitCluster: px(8558536),
  lashKitStrip: px(8558535),
  lashCluster: px(8558545),
  lashStrip: px(8558519),
  lashGlue: px(8558524),
  lashRemover: px(7755650),
  lashHeroEyes: px(8558545, 1200, 1400),

  // Nails
  nailAcrylic: px(28712961),
  nailGel: px(34835286),
  nailStickers: px(361754),
  nailBase: px(973405),
  nailTop: px(20758448),
  nailCuticleOil: px(15930068),
  nailCareKit: px(5632335, 1200, 1500),
  nailTools: px(6135675),
  nailAlt1: px(36655811),
  nailAlt2: px(31206346),
  nailAlt3: px(14396082),

  // Lips
  lipPlainGloss: px(29185844),
  lipShades: px(7256139, 1200, 1500),
  lipSwatches: px(4938200),
  lipLiners: px(28399080),
  lipLinersAlt: px(4889706),
  lipGlossApp: px(29185844, 900, 1200),
};

export const VIDEO_THUMBS = {
  lash1: "https://images.pexels.com/videos/7754495/pexels-photo-7754495.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  lash2: "https://images.pexels.com/videos/12322768/pexels-photo-12322768.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  lash3: "https://images.pexels.com/videos/6961746/pexels-photo-6961746.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  lash4: "https://images.pexels.com/videos/3971913/pexels-photo-3971913.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  nail1: "https://images.pexels.com/videos/30706938/aesthetic-beauty-beauty-beauty-industry-fashion-30706938.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  nail2: "https://images.pexels.com/videos/7754856/adult-applying-beauty-beauty-salon-posters-7754856.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
  nail3: "https://images.pexels.com/videos/16117268/fingernails-hydration-manicure-pedicure-16117268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
};
