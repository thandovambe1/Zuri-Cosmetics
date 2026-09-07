import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LotusMark } from "./icons";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow flex items-center gap-3",
            align === "center" && "justify-center"
          )}
        >
          <LotusMark className="h-3 w-6 text-gold/80" />
          {eyebrow}
          <LotusMark className="h-3 w-6 text-gold/80" />
        </p>
      )}
      <h2 className="mt-4 font-display text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-[3.4rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-sm leading-relaxed text-plum sm:text-base">{description}</p>
      )}
    </div>
  );
}
