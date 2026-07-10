"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadCapture() {
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

  return (
    <section id="request" className="bg-forest-deep py-[76px] text-cream md:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-start gap-11 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <div>
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">
              Request spawn · pre-orders open
            </span>
            <h2 className="mt-[18px] text-[clamp(30px,3.6vw,46px)] text-cream">
              Tell us what you&apos;re growing.
            </h2>
            <p className="mt-[22px] max-w-[26em] text-[17px] leading-[1.6] text-cream/70">
              We&apos;re scaling production in Moncure and taking early inquiries now. Send a note about your operation and we&apos;ll follow up with availability, timelines, and pricing.
            </p>

            <div className="mt-10 flex flex-col gap-0">
              <div className="flex gap-3.5" style={{ alignItems: "baseline" }}>
                <span className="w-[120px] flex-none font-mono text-[11px] uppercase tracking-[0.14em] text-brass">Inquiries</span>
                <span className="min-w-0 break-words text-[16px] text-cream">info@haywoodmushrooms.com</span>
              </div>
              <div className="mt-[14px] flex gap-3.5" style={{ alignItems: "baseline" }}>
                <span className="w-[120px] flex-none font-mono text-[11px] uppercase tracking-[0.14em] text-brass">Research lab</span>
                <span className="min-w-0 break-words text-[16px] text-cream">Cary, North Carolina</span>
              </div>
              <div className="mt-[14px] flex gap-3.5" style={{ alignItems: "baseline" }}>
                <span className="w-[120px] flex-none font-mono text-[11px] uppercase tracking-[0.14em] text-brass">Production</span>
                <span className="min-w-0 break-words text-[16px] text-cream">Moncure, North Carolina</span>
              </div>
            </div>
          </div>

          <div className="rounded-[4px] bg-cream p-10 text-ink">
            {status === "success" ? (
              <div className="py-6">
                <div className="font-serif text-[24px] text-forest">Thank you — your inquiry is in.</div>
                <p className="mt-[10px] text-muted">
                  We&apos;ve received your note and will be in touch shortly with next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="font-serif text-[26px]">Inquiry form</div>

                <div className="mt-[18px] grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={status === "submitting"}
                      placeholder="Your full name"
                      className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
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
                      className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="mt-[18px]">
                  <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Inquiry type</label>
                  <select
                    name="inquiryType"
                    disabled={status === "submitting"}
                    className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
                  >
                    <option>Gourmet spawn pre-order</option>
                    <option>Research cultures</option>
                    <option>Bulk substrate</option>
                    <option>General question</option>
                  </select>
                </div>

                <div className="mt-[18px]">
                  <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    disabled={status === "submitting"}
                    placeholder="Tell us about your growing operation…"
                    className="min-h-[104px] w-full resize-y rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
                  />
                </div>

                {status === "error" && (
                  <p className="mt-3 text-sm font-medium text-red-700">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-5 w-full justify-center rounded-[2px] bg-brass py-[15px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "Sending…" : "Submit inquiry →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
