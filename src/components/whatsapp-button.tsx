"use client";

import { siteConfig } from "@/lib/site-config";
import { IconWhatsApp } from "@/components/icons";

export default function WhatsAppButton() {
  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Zuri Cosmetics on WhatsApp"
      className="group fixed bottom-5 right-4 z-40 flex items-center gap-0 sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none mr-3 hidden max-w-0 items-center overflow-hidden whitespace-nowrap rounded-full bg-ivory/95 py-2 pl-4 text-xs font-medium text-plum shadow-soft backdrop-blur transition-all duration-500 group-hover:max-w-[220px] group-hover:pr-4 sm:flex">
        Need help? Chat with us ✨
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-ivory shadow-[0_12px_30px_-6px_rgb(37_211_102/0.55)] transition-transform duration-300 hover:scale-105 active:scale-95">
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.4s]" />
        <IconWhatsApp size={27} />
      </span>
    </a>
  );
}
