"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      inquiryType: formData.get("inquiryType"),
      operationSize: formData.get("operationSize"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  if (status === "success") {
    return (
      <div className="max-w-[560px] rounded-[4px] border border-line bg-paper p-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-brass">Inquiry received</div>
        <div className="mt-3 font-serif text-[30px] text-forest">Thank you — we&apos;ve got it.</div>
        <p className="mt-3.5 text-[16px] leading-[1.6] text-muted">
          Your note is with our team. We&apos;ll be in touch shortly with next steps, availability, and anything else you asked about. In the meantime, feel free to browse the{" "}
          <Link href="/strains" className="text-forest hover:text-brass">strains</Link> or{" "}
          <Link href="/blog" className="text-forest hover:text-brass">grow guides</Link>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[560px]">
      <div className="font-serif text-[30px] text-ink">Inquiry form</div>
      <p className="mt-2.5 max-w-[32em] text-[15px] text-muted">
        The more you tell us about your setup and goals, the more useful our reply.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Name</label>
          <input
            type="text"
            name="name"
            required
            disabled={status === "submitting"}
            placeholder="Your full name"
            className="w-full rounded-[2px] border border-line bg-paper p-[14px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Email</label>
          <input
            type="email"
            name="email"
            required
            disabled={status === "submitting"}
            placeholder="name@email.com"
            className="w-full rounded-[2px] border border-line bg-paper p-[14px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Inquiry type</label>
          <select
            name="inquiryType"
            disabled={status === "submitting"}
            className="w-full rounded-[2px] border border-line bg-paper p-[14px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
          >
            <option>Gourmet spawn pre-order</option>
            <option>Research cultures</option>
            <option>Bulk substrate</option>
            <option>Wholesale / farm supply</option>
            <option>General question</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Operation size</label>
          <select
            name="operationSize"
            disabled={status === "submitting"}
            className="w-full rounded-[2px] border border-line bg-paper p-[14px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
          >
            <option>Hobby / home grow</option>
            <option>Small farm</option>
            <option>Commercial production</option>
            <option>Research lab</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Message</label>
        <textarea
          name="message"
          rows={5}
          required
          disabled={status === "submitting"}
          placeholder="Which strains interest you, your timeline, and anything about your growing operation…"
          className="min-h-[130px] w-full resize-y rounded-[2px] border border-line bg-paper p-[14px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
        />
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm font-medium text-red-700">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-[22px] w-full justify-center rounded-[2px] bg-brass py-4 text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Send inquiry →"}
      </button>

      <p className="mt-[18px] text-[12.5px] leading-[1.5] text-muted">
        By submitting, you agree we may contact you about your inquiry. We don&apos;t share your information.
      </p>
    </form>
  );
}
