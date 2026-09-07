import { cn } from "@/lib/utils";
import { IconCheck } from "./icons";

export const ORDER_STATUSES = [
  "Pending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
] as const;

export default function OrderStatus({ status }: { status: string }) {
  if (status === "Cancelled") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#b0565e]/12 px-4 py-2 text-[0.66rem] font-medium tracking-[0.22em] text-[#b0565e] uppercase">
        Order cancelled
      </span>
    );
  }
  const currentIndex = ORDER_STATUSES.indexOf(
    status as (typeof ORDER_STATUSES)[number]
  );
  const idx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {ORDER_STATUSES.map((step, i) => {
        const done = i <= idx;
        return (
          <li key={step} className="flex items-center">
            <span className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-[0.6rem] transition-colors",
                  done
                    ? "border-gold bg-gold text-white"
                    : "border-mauve/40 bg-white/60 text-plum/60"
                )}
              >
                {done ? <IconCheck className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[0.58rem] tracking-[0.18em] uppercase",
                  done ? "text-gold-deep" : "text-plum/60"
                )}
              >
                {step}
              </span>
            </span>
            {i < ORDER_STATUSES.length - 1 && (
              <span
                className={cn(
                  "mx-2 mb-5 h-px w-6 sm:w-10",
                  i < idx ? "bg-gold" : "bg-mauve/30"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
