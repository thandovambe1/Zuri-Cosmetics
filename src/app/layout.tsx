import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { CartProvider } from "@/components/cart";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zuricosmetics.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zuri Cosmetics | Soft Luxury Beauty — Lashes, Nails & Lip Essentials",
    template: "%s | Zuri Cosmetics",
  },
  description: siteConfig.description,
  applicationName: siteConfig.legalName,
  keywords: [
    "Zuri Cosmetics",
    "luxury cosmetics South Africa",
    "cluster lashes",
    "strip lashes",
    "lash kits",
    "press-on nails",
    "acrylic nails",
    "nail care",
    "lip gloss",
    "lip liner",
    "beauty shop",
    "soft luxury beauty",
  ],
  authors: [{ name: siteConfig.legalName }],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    siteName: siteConfig.legalName,
    title: "Zuri Cosmetics | Soft Luxury Beauty — Lashes, Nails & Lip Essentials",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Zuri Cosmetics | Soft Luxury Beauty",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAF5EF",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.legalName,
  url: SITE_URL,
  description: siteConfig.description,
  email: siteConfig.email,
  sameAs: Object.values(siteConfig.social).filter(Boolean),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="flex min-h-screen flex-col bg-cream text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-plum focus:px-5 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>
        <CartProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
