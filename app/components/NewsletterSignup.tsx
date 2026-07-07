"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const email = new FormData(form).get("email");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mt-16 grid grid-cols-1 items-center gap-8 rounded-[4px] bg-forest-deep p-9 text-cream md:grid-cols-[1fr_0.9fr] md:p-14">
      <div>
        <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">Grower&apos;s list</span>
        <h2 className="mt-3.5 max-w-[14em] text-[clamp(28px,3vw,38px)] text-cream">
          New guides, strain drops, and pre-order windows.
        </h2>
        <p className="mt-4 max-w-[30em] text-[16px] text-cream/70">
          No noise — just a note when there&apos;s something worth knowing from the lab.
        </p>
      </div>

      <div>
        {status === "success" ? (
          <div className="font-serif text-[22px] italic text-brass">You&apos;re on the list — talk soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
            <input
              type="email"
              name="email"
              required
              disabled={status === "submitting"}
              placeholder="name@email.com"
              className="min-w-[200px] flex-1 rounded-[2px] border border-white/20 bg-white/[.06] p-[14px] text-[15px] text-cream outline-none placeholder:text-cream/50 focus:border-brass disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center gap-[9px] rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Subscribe →"}
            </button>
            {status === "error" && (
              <p className="w-full text-sm font-medium text-red-300">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
