import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, getReviewsForProduct } from "@/lib/data";
import { zar } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import Gallery from "@/components/gallery";
import PdpPanel from "@/components/pdp-panel";
import ProductCard from "@/components/product-card";
import ReviewForm from "@/components/review-form";
import Reveal from "@/components/reveal";
import { SectionHeading, Stars, StockBadge } from "@/components/ui";
import { IconCheck, IconShield, IconSparkles } from "@/components/icons";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const image = product.images?.[0];
  return {
    title: `${product.name} — ${product.category.name}`,
    description: product.tagline || product.description?.slice(0, 155),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} | Zuri Cosmetics`,
      description: product.tagline || undefined,
      type: "website",
      url: `/product/${product.slug}`,
      images: image ? [{ url: image, alt: `${product.name} — Zuri Cosmetics` }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product, 4),
    getReviewsForProduct(product.id),
  ]);

  const image = product.images?.[0] ?? "";
  const onSale = product.salePriceCents && product.salePriceCents > 0;
  const discount = onSale ? Math.round(((product.priceCents - product.salePriceCents!) / product.priceCents) * 100) : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku ?? undefined,
    brand: { "@type": "Brand", name: siteConfig.legalName },
    offers: {
      "@type": "Offer",
      url: `https://zuricosmetics.example/product/${product.slug}`,
      priceCurrency: "ZAR",
      price: ((onSale ? product.salePriceCents! : product.priceCents) / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.ratingAvg
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingAvg,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-8 text-[0.7rem] uppercase tracking-[0.2em] text-mauve">
        <Link href="/" className="hover:text-rose-deep">Home</Link>
        <span className="mx-2 text-gold">/</span>
        <Link href={`/${product.category.slug}`} className="hover:text-rose-deep">{product.category.name}</Link>
        <span className="mx-2 text-gold">/</span>
        <span className="text-plum">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div>
          <Gallery images={product.images} alt={product.name} />
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">Zuri Cosmetics · {product.category.name}</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.08] text-plum-deep">{product.name}</h1>
          <p className="mt-3 font-display text-lg italic text-rose-deep">{product.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="font-display text-3xl text-gold-deep">{zar(onSale ? product.salePriceCents! : product.priceCents)}</span>
            {onSale && (
              <>
                <span className="text-lg text-mauve line-through">{zar(product.priceCents)}</span>
                <span className="rounded-full bg-rose-deep/10 px-3 py-1 text-xs font-semibold text-rose-deep">Save {discount}%</span>
              </>
            )}
          </div>

          {product.ratingAvg ? (
            <div className="mt-4 flex items-center gap-2">
              <Stars value={product.ratingAvg} />
              <span className="text-sm text-mauve">
                {product.ratingAvg.toFixed(1)} · {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-sm text-mauve">
              <IconSparkles size={15} className="text-gold" /> Be the first to review this Zuri product
            </div>
          )}

          <p className="mt-5 text-[0.95rem] leading-relaxed text-ink/85">{product.description}</p>

          <div className="mt-8">
            <PdpPanel
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                image,
                priceCents: product.priceCents,
                salePriceCents: product.salePriceCents,
                stock: product.stock,
              }}
              variants={product.variants}
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {product.included.length > 0 && (
          <Reveal className="card-luxe p-7">
            <h2 className="font-display text-xl text-plum-deep">What&apos;s included</h2>
            <ul className="mt-4 space-y-2.5">
              {product.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <IconCheck size={16} className="mt-0.5 shrink-0 text-gold-deep" /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {Object.keys(product.specs ?? {}).length > 0 && (
          <Reveal delay={80} className="card-luxe p-7">
            <h2 className="font-display text-xl text-plum-deep">Specifications</h2>
            <dl className="mt-4 divide-y divide-blush-100">
              {Object.entries(product.specs ?? {}).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-mauve">{k}</dt>
                  <dd className="text-right font-medium text-plum-deep">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        <Reveal delay={160} className="card-luxe p-7">
          <h2 className="font-display text-xl text-plum-deep">The Zuri details</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
            {product.ingredients && (
              <p>
                <span className="font-semibold text-plum-deep">Ingredients / formula:</span> {product.ingredients}
              </p>
            )}
            {product.material && (
              <p>
                <span className="font-semibold text-plum-deep">Material:</span> {product.material}
              </p>
            )}
            <p className="flex items-start gap-2 text-[0.85rem] text-mauve">
              <IconShield size={16} className="mt-0.5 shrink-0" />
              SKU: {product.sku ?? "—"} · Quality-checked before dispatch. Colours may vary slightly between screens.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <SectionHeading eyebrow="Community love" title="Customer Reviews" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-sm text-ink/70">No reviews yet — be the first to share your Zuri experience.</p>
            )}
            {reviews.map((r) => (
              <Reveal key={r.id}>
                <article className="card-luxe p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose to-mauve font-display text-sm text-ivory">
                        {r.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-plum-deep">{r.name}</p>
                        <p className="text-[0.66rem] uppercase tracking-[0.14em] text-mauve">Zuri shopper</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stars value={r.rating} />
                      {r.isSample && (
                        <span className="rounded-full bg-blush-100 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-rose-deep">
                          Sample
                        </span>
                      )}
                    </div>
                  </div>
                  {r.title && <h3 className="mt-3 font-display text-lg text-plum-deep">{r.title}</h3>}
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{r.content}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <ReviewForm productId={product.id} productName={product.name} />
        </div>
      </section>

      {/* You may also like */}
      {related.length > 0 && (
        <section className="mt-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Complete the look" title="You May Also Like" sub="Pair your Zuri favourites for the full soft-luxury edit." />
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
