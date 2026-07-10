"use client";

import { useState } from "react";
import Link from "next/link";

export default function InvoiceActions({ orderId, hasEmail }: { orderId: string; hasEmail: boolean }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleEmail() {
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/invoice/email`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not send the invoice.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-[3px] border border-line bg-paper p-6">
      <div className="font-serif text-[20px] text-ink">Invoice</div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/orders/${orderId}/invoice`}
          target="_blank"
          className="rounded-[2px] border border-forest px-[16px] py-[10px] text-[13.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
        >
          Print / save as PDF →
        </Link>
        {hasEmail && (
          <button
            type="button"
            onClick={handleEmail}
            disabled={sending || sent}
            className="rounded-[2px] bg-brass px-[16px] py-[10px] text-[13.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sent ? "Sent ✓" : sending ? "Sending…" : "Email invoice"}
          </button>
        )}
      </div>
      {!hasEmail && <p className="mt-3 text-[12.5px] text-muted">No email on file — print/save the PDF to hand it over instead.</p>}
      {error && <p className="mt-3 text-[13px] font-medium text-red-700">{error}</p>}
    </div>
  );
}
