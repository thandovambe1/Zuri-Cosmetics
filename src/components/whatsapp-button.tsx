"use client";

import { useEffect, useState } from "react";
import { siteConfig, whatsappLink } from "@/lib/config";
import { IconWhatsApp } from "./icons";

export default function WhatsAppButton() {
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHint(true), 3500);
    const t2 = setTimeout(() => setHint(false), 10500);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Zuri Cosmetics on WhatsApp"
      className="group fixed right-4 bottom-4 z-50 flex items-center gap-3 sm:right-6 sm:bottom-6"
    >
      <span
        className={`hidden max-w-[13rem] rounded-2xl rounded-br-sm border border-gold/25 bg-white/95 px-4 py-2.5 text-xs leading-snug text-cocoa shadow-soft transition-all duration-500 sm:block ${
          hint ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-3 opacity-0"
        } group-hover:translate-x-0 group-hover:opacity-100`}
      >
        Need help with an order or the website? Message us on WhatsApp.
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-300 group-hover:scale-110">
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.8s]" />
        <IconWhatsApp className="h-7 w-7" />
      </span>
      <span className="sr-only">{siteConfig.whatsappMessage}</span>
    </a>
  );
}
