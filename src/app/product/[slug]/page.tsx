import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BuyBox from "@/components/buy-box";
import ProductCard from "@/components/product-card";
import ProductReviews from "@/components/product-reviews";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { IconCheck, LotusMark } from "@/components/icons";
import { getProductBySlug, getRelated, getReviews } from "@/lib/queries";
import { siteConfig } from "@/lib/config";
import { effectivePrice } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${product.categoryName}`,
    description: product.shortDescription ?? product.name,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} | Zuri Cosmetics`,
      description: product.shortDescription ?? product.name,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviews(product.id),
    getRelated(product, 4),
  ]);

  const price = effectivePrice(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? "",
    image: product.images,
    sku: product.sku ?? undefined,
    brand: { "@type": "Brand", name: "Zuri Cosmetics" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ZAR",
      price: price.toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/product/${product.slug}`,
      seller: { "@type": "Organization", name: "Zuri Cosmetics" },
    },
    ...(product.rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating.average.toFixed(1),
            reviewCount: product.rating.count,
          },
        }
      : {}),
  };

  const specEntries = Object.entries(product.specifications ?? {});

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 lg:px-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-[0.64rem] tracking-[0.2em] text-plum uppercase">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="link-sweep hover:text-gold-deep">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/${product.categorySlug}`} className="link-sweep hover:text-gold-deep">
                {product.categoryName}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-gold-deep">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal className="overflow-hidden rounded-[1.8rem] border border-gold/25 shadow-lift">
              <img
                src={product.images[0]}
                alt={`${product.name} by Zuri Cosmetics`}
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1.6s] hover:scale-[1.06]"
              />
            </Reveal>
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <div
                    key={img + i}
                    className="overflow-hidden rounded-[1rem] border border-mauve/20"
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <Reveal delay={120}>
            <BuyBox
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                salePrice: product.salePrice,
                stock: product.stock,
                image: product.images[0] ?? "",
                categoryName: product.categoryName,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  hex: v.hex,
                })),
                rating: product.rating,
                sku: product.sku,
              }}
            />
          </Reveal>
        </div>

        {/* Details */}
        <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-3xl text-ink">The full story</h2>
            <p className="mt-4 text-sm leading-relaxed text-plum sm:text-base">
              {product.description}
            </p>
          </Reveal>
          <Reveal delay={120} className="space-y-4">
            <details className="group card-lux open:pb-5" open>
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
                What’s included
                <LotusMark className="h-3 w-6 text-gold/70 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <ul className="space-y-2.5 px-6">
                {product.whatsIncluded.length ? (
                  product.whatsIncluded.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-cocoa">
                      <IconCheck className="h-4 w-4 shrink-0 text-gold-deep" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-plum">Single product.</li>
                )}
              </ul>
            </details>

            {specEntries.length > 0 && (
              <details className="group card-lux open:pb-5">
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
                  Specifications
                  <LotusMark className="h-3 w-6 text-gold/70 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <dl className="space-y-2.5 px-6">
                  {specEntries.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-6 text-sm">
                      <dt className="text-plum">{key}</dt>
                      <dd className="text-right text-cocoa">{value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}

            {product.ingredients && (
              <details className="group card-lux open:pb-5">
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
                  Ingredients & materials
                  <LotusMark className="h-3 w-6 text-gold/70 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="px-6 text-sm leading-relaxed text-plum">{product.ingredients}</p>
              </details>
            )}

            {product.variants.length > 0 && (
              <details className="group card-lux open:pb-5">
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
                  Available shades
                  <LotusMark className="h-3 w-6 text-gold/70 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="flex flex-wrap gap-2.5 px-6">
                  {product.variants.map((v) => (
                    <span
                      key={v.id}
                      className="flex items-center gap-2 rounded-full border border-mauve/25 bg-white/60 py-1.5 pr-4 pl-1.5 text-[0.7rem] text-plum"
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-white/70"
                        style={{ background: v.hex ?? "#e9d8cb" }}
                      />
                      {v.name}
                    </span>
                  ))}
                </div>
              </details>
            )}
          </Reveal>
        </div>

        {/* Reviews */}
        <div className="mt-24">
          <ProductReviews
            productId={product.id}
            reviews={reviews.map((r) => ({
              id: r.id,
              authorName: r.authorName,
              avatar: r.avatar,
              location: r.location,
              rating: r.rating,
              title: r.title,
              body: r.body,
              isSample: r.isSample,
              createdAt: r.createdAt.toISOString(),
            }))}
          />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <SectionHeading
                eyebrow="Complete the ritual"
                title="You may also like"
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
