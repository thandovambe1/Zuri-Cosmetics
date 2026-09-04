"use client";

import { siteConfig } from "@/lib/site-config";
import { IconWhatsApp } from "@/components/icons";

export default function ContactForm() {
  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("name") ?? "");
        const topic = String(data.get("topic") ?? "");
        const message = String(data.get("message") ?? "");
        const text = `Hi Zuri Cosmetics! My name is ${name}. Topic: ${topic}. ${message}`;
        window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
      }}
    >
      <input name="name" required placeholder="Your name" className="input-luxe" maxLength={60} />
      <select name="topic" required defaultValue="I need help with my order/website." className="input-luxe cursor-pointer">
        <option value="I need help with my order/website.">I need help with my order/website.</option>
        <option value="I need help with a tutorial.">I need help with a tutorial.</option>
        <option value="I have a product question.">I have a product question.</option>
        <option value="Something else.">Something else.</option>
      </select>
      <textarea name="message" required placeholder="Your message…" className="input-luxe min-h-32 resize-y" maxLength={800} />
      <button type="submit" className="btn btn-gold w-full">
        <IconWhatsApp size={16} /> Send via WhatsApp
      </button>
      <p className="text-center text-[0.7rem] text-mauve">
        Opens WhatsApp with your message pre-filled — nothing is sent until you press send.
      </p>
    </form>
  );
}
