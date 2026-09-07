"use client";

import { useState, type FormEvent } from "react";
import { isEmail } from "@/lib/utils";
import { IconCheck, IconMail } from "./icons";

export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      if (!res.ok || !data.ok) throw new Error(data.message);
      setState("success");
      setMessage(data.message);
      setEmail("");
    } catch {
      setState("error");
      setMessage("Something went wrong saving your email. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      {!compact && (
        <div className="mb-6 text-center">
          <p className="eyebrow">The Zuri Beauty List</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
            A little more beauty
            <br />
            <span className="italic text-gold-deep">in your inbox.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-plum">
            Subscribe for new product drops, exclusive offers, beauty tips and special
            promotions from Zuri Cosmetics.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Enter your email address</span>
          <IconMail className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-gold-deep/70" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setState("idle");
            }}
            placeholder="Enter your email address"
            className="field-lux !pl-11"
            disabled={state === "loading"}
          />
        </label>
        <button type="submit" className="btn-lux btn-blush shrink-0" disabled={state === "loading"}>
          {state === "loading" ? "Saving…" : "Subscribe"}
        </button>
      </div>
      {state === "success" && (
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-whatsapp">
          <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {message}
        </p>
      )}
      {state === "error" && (
        <p className="mt-3 text-xs leading-relaxed text-[#b0565e]" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
