"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconChevronDown } from "./icons";

export interface FaqRow {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function FaqList({ faqs }: { faqs: FaqRow[] }) {
  const [open, setOpen] = useState<number | null>(faqs[0]?.id ?? null);

  return (
    <ul className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <li key={faq.id} className="card-lux overflow-hidden transition-shadow duration-300 hover:shadow-lift">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left sm:px-8"
            >
              <span className="font-display text-xl leading-snug text-ink sm:text-2xl">
                {faq.question}
              </span>
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/35 text-gold-deep transition-transform duration-400",
                  isOpen && "rotate-180 bg-gold text-white"
                )}
              >
                <IconChevronDown className="h-4 w-4" />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-plum sm:px-8 sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
