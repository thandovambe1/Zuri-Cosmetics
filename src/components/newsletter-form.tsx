"use client";

import { useState } from "react";
import { IconCheck, IconMail } from "@/components/icons";

export default function NewsletterForm({
  source = "newsletter",
  compact = false,
  className = "",
}: {
  source?: string;
  compact?: boolean;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      if (res.ok && data.ok) {
        setState("done");
        setMessage(data.message);
        setEmail("");
      } else {
        setState("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className={`anim-pop flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold-light/50 px-5 py-4 text-sm text-plum-deep ${compact ? "" : "max-w-md"} ${className}`}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep">
          <IconCheck size={16} />
        </span>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`flex w-full flex-col gap-2.5 sm:flex-row ${compact ? "max-w-md" : "max-w-lg"} ${className}`}>
      <label className="relative flex-1">
        <span className="sr-only">Email address</span>
        <IconMail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mauve" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="input-luxe !pl-11"
          autoComplete="email"
        />
      </label>
      <button type="submit" disabled={state === "loading"} className="btn btn-gold shrink-0 !px-8">
        {state === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
