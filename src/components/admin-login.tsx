"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { IconLock } from "./icons";

export default function AdminLogin({ passwordIsDefault }: { passwordIsDefault: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Incorrect admin password.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-28">
      <div className="card-lux p-8 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/35 bg-blush text-gold-deep">
          <IconLock className="h-6 w-6" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-ink">Zuri Admin</h1>
        <p className="mt-2 text-sm leading-relaxed text-plum">
          Product, order and review management is protected. Sign in with the admin
          password to continue.
        </p>
        <form onSubmit={submit} className="mt-7">
          <label className="block">
            <span className="text-[0.64rem] font-medium tracking-[0.22em] text-cocoa uppercase">
              Admin password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-lux mt-2"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="mt-3 text-xs text-[#b0565e]" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-lux btn-blush mt-6 w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {passwordIsDefault && (
          <p className="mt-5 rounded-xl bg-lavender/60 px-4 py-3 text-[0.66rem] leading-relaxed text-plum">
            Preview environment: the admin password is the development placeholder
            “zuri-admin-preview”. Set ADMIN_PASSWORD (and ADMIN_SECRET) in environment
            variables for production.
          </p>
        )}
      </div>
    </section>
  );
}
