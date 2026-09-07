import { IconStar } from "./icons";
import { cn } from "@/lib/utils";

export default function Stars({
  average,
  count,
  className,
  size = "h-3.5 w-3.5",
}: {
  average: number;
  count?: number;
  className?: string;
  size?: string;
}) {
  const pct = Math.max(0, Math.min(100, (average / 5) * 100));
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex" aria-hidden>
        <span className="flex gap-0.5 text-mauve/40">
          {[0, 1, 2, 3, 4].map((i) => (
            <IconStar key={i} className={size} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold"
          style={{ width: `${pct}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <IconStar key={i} className={cn(size, "shrink-0")} />
          ))}
        </span>
      </span>
      {typeof count === "number" && (
        <span className="text-[0.68rem] tracking-[0.12em] text-plum">
          {count === 0 ? "New — no reviews yet" : `${average.toFixed(1)} (${count})`}
        </span>
      )}
      <span className="sr-only">
        Rated {average.toFixed(1)} out of 5{count ? ` from ${count} reviews` : ""}
      </span>
    </span>
  );
}
