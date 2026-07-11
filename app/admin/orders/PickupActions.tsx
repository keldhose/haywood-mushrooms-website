"use client";

import { useState } from "react";
// Type-only: importing anything runtime from "@/lib/orders" here would pull
// the server-only firebase-admin module graph into the client bundle.
import type { Order } from "@/lib/orders";

const DEFAULT_INSTRUCTIONS = "Available Mon–Fri, 10am–5pm — text us when you're on your way.";

export default function PickupActions({ order }: { order: Order }) {
  const [instructions, setInstructions] = useState(order.pickupInstructions ?? DEFAULT_INSTRUCTIONS);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleNotify() {
    if (!instructions.trim()) return;
    setSending(true);
    setError("");
    setSent(false);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/ready-for-pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions: instructions.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not notify the customer.");
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
      <div className="font-serif text-[20px] text-ink">Pickup</div>

      {order.readyForPickupAt && (
        <p className="mt-2 text-[13px] text-forest">
          Marked ready {order.readyForPickupAt.toLocaleString()} — customer was emailed.
        </p>
      )}

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          Pickup window / instructions
        </label>
        <textarea
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full resize-y rounded-[2px] border border-line bg-cream p-[12px] text-[14px] outline-none focus:border-forest"
        />
      </div>

      {error && <p className="mt-3 text-[13px] font-medium text-red-700">{error}</p>}

      <button
        type="button"
        onClick={handleNotify}
        disabled={sending || !instructions.trim()}
        className="mt-4 rounded-[2px] bg-brass px-[18px] py-[11px] text-[13.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending
          ? "Sending…"
          : sent || order.readyForPickupAt
          ? "Update & resend notification"
          : "Notify customer — ready for pickup"}
      </button>
      {sent && <p className="mt-2.5 text-[12.5px] text-muted">Email sent.</p>}
    </div>
  );
}
