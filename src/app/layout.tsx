import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { siteConfig } from "@/lib/config";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";
import CartToast from "@/components/cart-toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "Zuri Cosmetics — Beauty, Made Effortless | Lashes, Press-On Nails & Lip Gloss",
    template: "%s | Zuri Cosmetics",
  },
  description:
    "Discover Zuri Cosmetics — a curated collection of lashes, press-on nails and lip essentials designed to elevate your everyday beauty routine. Soft luxury beauty, delivered across South Africa.",
  keywords: [
    "Zuri Cosmetics",
    "luxury lashes",
    "cluster lashes",
    "strip lashes",
    "press-on nails",
    "gel press-on nails",
    "lip gloss",
    "lip liner",
    "nail care",
    "South African beauty brand",
  ],
  authors: [{ name: "Zuri Cosmetics" }],
  creator: "Zuri Cosmetics",
  publisher: "Zuri Cosmetics",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteConfig.url,
    siteName: "Zuri Cosmetics",
    title: "Zuri Cosmetics — Beauty, Made Effortless",
    description:
      "A curated collection of lashes, press-on nails and lip essentials designed to elevate your everyday beauty routine.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Zuri Cosmetics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zuri Cosmetics — Beauty, Made Effortless",
    description:
      "Lashes, press-on nails and lip essentials. Soft luxury beauty from Zuri Cosmetics.",
    images: ["/logo.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6e7e3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-cream text-ink font-body antialiased">
        <CartProvider>
          <div className="noise-overlay" aria-hidden />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
