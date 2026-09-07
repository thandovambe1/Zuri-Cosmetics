"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatDate } from "@/lib/utils";
import Stars from "./stars";
import { IconCheck, IconStar } from "./icons";

export interface ReviewRow {
  id: number;
  authorName: string;
  avatar: string | null;
  location: string | null;
  rating: number;
  title: string | null;
  body: string;
  isSample: boolean;
  createdAt: string;
}

export default function ProductReviews({
  productId,
  reviews,
}: {
  productId: number;
  reviews: ReviewRow[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || body.trim().length < 10) {
      setState("error");
      setMessage("Please add your name and a review of at least 10 characters.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, title, body }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      if (!res.ok || !data.ok) throw new Error(data.message);
      setState("success");
      setMessage(data.message);
      setName("");
      setTitle("");
      setBody("");
      router.refresh();
    } catch {
      setState("error");
      setMessage("Could not submit your review. Please try again.");
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div>
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Customer reviews</h2>
        {reviews.length === 0 ? (
          <div className="mt-6 rounded-[1.4rem] border border-dashed border-mauve/40 bg-white/50 p-8 text-center">
            <p className="font-display text-2xl text-ink">No reviews yet</p>
            <p className="mt-2 text-sm text-plum">
              Be the first to share your experience with this product.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-6">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-gold/15 pb-6">
                <div className="flex items-center gap-3">
                  {r.avatar && (
                    <img
                      src={r.avatar}
                      alt={`${r.authorName}, Zuri Cosmetics customer`}
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-full border border-gold/30 object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                    <Stars average={r.rating} />
                    <span className="text-[0.62rem] tracking-[0.18em] text-plum/70 uppercase">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                </div>
                {r.title && (
                  <p className="mt-3 font-display text-xl text-ink">{r.title}</p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-cocoa">{r.body}</p>
                <p className="mt-3 text-[0.68rem] tracking-[0.2em] text-plum uppercase">
                  — {r.authorName}
                  {r.location ? `, ${r.location}` : ""}
                </p>
                {r.isSample && (
                  <span className="mt-2 inline-block rounded-full bg-lavender px-3 py-1 text-[0.56rem] font-medium tracking-[0.2em] text-plum uppercase">
                    Sample content
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={submit} className="card-lux h-fit p-7 sm:p-9" noValidate>
        <h3 className="font-display text-2xl text-ink">Write a review</h3>
        <p className="mt-1 text-xs text-plum">
          Reviews are moderated before publishing. Thank you for keeping Zuri beautiful.
        </p>

        <label className="mt-6 block">
          <span className="text-[0.66rem] font-medium tracking-[0.22em] text-cocoa uppercase">
            Your rating
          </span>
          <span className="mt-2 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`Rate ${value} stars`}
                className="transition-transform hover:scale-110"
              >
                <IconStar
                  className={
                    value <= rating ? "h-6 w-6 text-gold" : "h-6 w-6 text-mauve/35"
                  }
                />
              </button>
            ))}
          </span>
        </label>

        <label className="mt-5 block">
          <span className="text-[0.66rem] font-medium tracking-[0.22em] text-cocoa uppercase">
            Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-lux mt-2"
            placeholder="Your name"
            maxLength={60}
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[0.66rem] font-medium tracking-[0.22em] text-cocoa uppercase">
            Title <span className="normal-case">(optional)</span>
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="field-lux mt-2"
            placeholder="Sum up your experience"
            maxLength={90}
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[0.66rem] font-medium tracking-[0.22em] text-cocoa uppercase">
            Your review
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="field-lux mt-2 min-h-28 resize-y"
            placeholder="How did the product feel, wear and look?"
            maxLength={1200}
          />
        </label>

        <button type="submit" className="btn-lux btn-blush mt-6 w-full" disabled={state === "loading"}>
          {state === "loading" ? "Submitting…" : "Submit review"}
        </button>
        {state === "success" && (
          <p className="mt-3 flex items-start gap-2 text-xs text-whatsapp">
            <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {message}
          </p>
        )}
        {state === "error" && (
          <p className="mt-3 text-xs text-[#b0565e]" role="alert">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
