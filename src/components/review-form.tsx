"use client";

import { useState } from "react";
import { IconCheck, IconStar } from "@/components/icons";

export default function ReviewForm({ productId, productName }: { productId: number; productName: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setState("error");
      setMessage("Please choose a star rating.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name: name.trim(), rating, title: title.trim(), content: content.trim() }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      if (res.ok && data.ok) {
        setState("done");
        setMessage("Thank you — your review has been received and will appear after moderation. ✨");
        setName("");
        setTitle("");
        setContent("");
        setRating(0);
      } else {
        setState("error");
        setMessage(data.message || "Could not submit your review. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Could not submit your review. Please try again.");
    }
  }

  return (
    <div className="card-luxe p-6 sm:p-8">
      <h3 className="font-display text-xl text-plum-deep">Write a review</h3>
      <p className="mt-1 text-sm text-ink/70">Tell others what you think of {productName}.</p>

      {state === "done" ? (
        <div className="anim-pop mt-5 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold-light/50 px-5 py-4 text-sm text-plum-deep">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep">
            <IconCheck size={16} />
          </span>
          <p>{message}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  className={`transition-transform hover:scale-125 ${(hoverRating || rating) >= n ? "text-gold" : "text-blush-300"}`}
                >
                  <IconStar size={26} filled />
                </button>
              ))}
            </div>
            <label className="flex-1">
              <span className="sr-only">Your name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-luxe"
                maxLength={60}
              />
            </label>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review title (optional)"
            className="input-luxe"
            maxLength={90}
          />
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience…"
            className="input-luxe min-h-28 resize-y"
            maxLength={1000}
          />
          {state === "error" && <p className="text-sm text-rose-deep">{message}</p>}
          <button type="submit" disabled={state === "loading"} className="btn btn-gold">
            {state === "loading" ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
