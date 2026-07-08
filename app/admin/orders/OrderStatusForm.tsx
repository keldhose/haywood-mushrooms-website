"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/orders";

export default function OrderStatusForm({
  orderId,
  status,
  trackingNumber,
}: {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
}) {
  const router = useRouter();
  const [newStatus, setNewStatus] = useState<OrderStatus>(status);
  const [tracking, setTracking] = useState(trackingNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, trackingNumber: tracking }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update order.");
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[3px] border border-line bg-paper p-6">
      <div className="font-serif text-[20px] text-ink">Fulfillment</div>

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Status</label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
          className="w-full rounded-[2px] border border-line bg-cream p-[12px] text-[15px] outline-none focus:border-forest"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          Tracking number <span className="normal-case text-muted/70">(optional)</span>
        </label>
        <input
          type="text"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="w-full rounded-[2px] border border-line bg-cream p-[12px] text-[15px] outline-none focus:border-forest"
        />
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {saved && !error && <p className="mt-4 text-sm font-medium text-forest">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 rounded-[2px] bg-brass px-[22px] py-[12px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Update order"}
      </button>
    </form>
  );
}
