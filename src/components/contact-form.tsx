"use client";

import { useState, type FormEvent } from "react";
import { isEmail } from "@/lib/utils";
import { IconCheck } from "./icons";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || !isEmail(email) || message.trim().length < 10) {
      setState("error");
      setFeedback("Please add your name, a valid email and a message of at least 10 characters.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      if (!res.ok || !data.ok) throw new Error(data.message);
      setState("success");
      setFeedback(data.message);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setState("error");
      setFeedback("Could not send your message. Please try again or reach us on WhatsApp.");
    }
  };

  return (
    <form onSubmit={submit} className="card-lux p-7 sm:p-9" noValidate>
      <h2 className="font-display text-3xl text-ink">Send us a message</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field-lux mt-2" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-lux mt-2" placeholder="you@example.com" />
        </label>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">
              Subject <span className="normal-case">(optional)</span>
            </span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="field-lux mt-2" placeholder="Order help, shade advice…" />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">Message</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="field-lux mt-2 min-h-32 resize-y" placeholder="How can we help?" />
          </label>
        </div>
      </div>
      <button type="submit" className="btn-lux btn-blush mt-7 w-full" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Send message"}
      </button>
      {state === "success" && (
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-whatsapp">
          <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {feedback}
        </p>
      )}
      {state === "error" && (
        <p className="mt-4 text-xs leading-relaxed text-[#b0565e]" role="alert">
          {feedback}
        </p>
      )}
    </form>
  );
}
