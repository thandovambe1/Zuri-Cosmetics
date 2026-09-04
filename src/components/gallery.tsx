"use client";

import { useState } from "react";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length > 0 && images[0] ? images : [];
  const [index, setIndex] = useState(0);
  const main = list.length > 0 ? list[Math.min(index, list.length - 1)] : null;

  return (
    <div>
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-blush-200/70 bg-gradient-to-br from-blush-100 to-lavender/40 shadow-soft">
        {main ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={main}
              alt={`${alt} — product image ${index + 1} of ${list.length}`}
              className="img-zoom h-full w-full object-cover"
            />
            {list.length > 1 && (
              <div className="absolute bottom-4 right-4 rounded-full bg-ivory/90 px-3 py-1.5 text-[0.68rem] font-medium text-plum backdrop-blur">
                {index + 1} / {list.length}
              </div>
            )}
          </>
        ) : (
          <div className="grid h-full w-full place-items-center text-center text-sm text-mauve">
            <span>
              ✨ {alt}
              <br />
              Image coming soon
            </span>
          </div>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {list.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                i === index ? "border-gold shadow-glow" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
