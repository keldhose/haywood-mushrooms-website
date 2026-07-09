"use client";

import { useState } from "react";
// Type-only: importing anything runtime from "@/lib/orders" here would pull
// the server-only firebase-admin module graph into the client bundle.
import type { Order, OrderItem } from "@/lib/orders";

type Rate = {
  id: string;
  provider: string;
  service: string;
  amountCents: number;
  estimatedDays?: number;
};

function defaultWeightLb(items: OrderItem[]): string {
  const totalOz = items.reduce((sum, item) => sum + (item.weightOz ?? 0) * item.qty, 0);
  return totalOz > 0 ? (totalOz / 16).toFixed(2) : "";
}

/** Whether a freshly-quoted rate is the same carrier + service the customer selected and paid for at checkout. */
function matchesCustomerChoice(rate: Rate, order: Order): boolean {
  return (
    rate.provider.toLowerCase() === order.shippingRate.provider.toLowerCase() &&
    rate.service.toLowerCase() === order.shippingRate.service.toLowerCase()
  );
}

export default function BuyShippingLabel({ order }: { order: Order }) {
  const [weightLb, setWeightLb] = useState(() => defaultWeightLb(order.items));
  const [rates, setRates] = useState<Rate[] | null>(null);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [purchased, setPurchased] = useState<{ trackingNumber: string; labelUrl: string } | null>(null);

  async function handleGetRates() {
    const lb = parseFloat(weightLb);
    if (!lb || lb <= 0) {
      setError("Enter a valid package weight.");
      return;
    }
    setLoadingRates(true);
    setError("");
    setRates(null);
    setSelectedRateId(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/shipping-rates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weightOz: lb * 16 }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not calculate shipping.");
      }

      // Surface the rate matching what the customer already paid for first,
      // and pre-select it — buying a different (cheaper/slower or pricier)
      // service than what was promised should be a deliberate override, not
      // the default.
      const sorted: Rate[] = [...data.rates].sort((a, b) => {
        const aMatch = matchesCustomerChoice(a, order);
        const bMatch = matchesCustomerChoice(b, order);
        if (aMatch !== bMatch) return aMatch ? -1 : 1;
        return a.amountCents - b.amountCents;
      });
      setRates(sorted);
      setSelectedRateId(sorted.find((r) => matchesCustomerChoice(r, order))?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoadingRates(false);
    }
  }

  async function handleBuyLabel() {
    const rate = rates?.find((r) => r.id === selectedRateId);
    if (!rate) return;
    if (
      !confirm(
        `Buy this ${rate.provider} ${rate.service} label for $${(rate.amountCents / 100).toFixed(2)}? This charges your Shippo balance.`
      )
    ) {
      return;
    }

    setBuying(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/buy-label`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rateId: rate.id, amountCents: rate.amountCents }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not purchase the label.");
      }
      setPurchased({ trackingNumber: data.trackingNumber, labelUrl: data.labelUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBuying(false);
    }
  }

  if (order.labelUrl && order.trackingNumber) {
    return (
      <div className="rounded-[3px] border border-line bg-paper p-6">
        <div className="font-serif text-[20px] text-ink">Shipping label</div>
        <div className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Tracking number</div>
        <div className="mt-1 text-[15px] text-ink">{order.trackingNumber}</div>
        {order.shippingLabelCostCents !== undefined && (
          <div className="mt-2 text-[13px] text-muted">Cost: ${(order.shippingLabelCostCents / 100).toFixed(2)}</div>
        )}
        <a
          href={order.labelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-[2px] border border-forest px-[16px] py-[10px] text-[13.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
        >
          Download label →
        </a>
      </div>
    );
  }

  if (purchased) {
    return (
      <div className="rounded-[3px] border border-forest bg-paper p-6">
        <div className="font-serif text-[20px] text-ink">Label purchased ✓</div>
        <div className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Tracking number</div>
        <div className="mt-1 text-[15px] text-ink">{purchased.trackingNumber}</div>
        <a
          href={purchased.labelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-[2px] border border-forest px-[16px] py-[10px] text-[13.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
        >
          Download label →
        </a>
        <p className="mt-3 text-[12.5px] text-muted">The customer has been emailed their tracking number.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[3px] border border-line bg-paper p-6">
      <div className="font-serif text-[20px] text-ink">Shipping label</div>
      <p className="mt-1.5 text-[13px] text-muted">
        Customer paid for <span className="font-medium text-ink">{order.shippingRate.provider} {order.shippingRate.service}</span> — $
        {(order.shippingRate.amountCents / 100).toFixed(2)}. Quotes a fresh rate (the original may have expired) and purchases a real
        label via Shippo.
      </p>

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Package weight (lb)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.1"
            value={weightLb}
            onChange={(e) => setWeightLb(e.target.value)}
            className="w-32 rounded-[2px] border border-line bg-cream p-[10px] text-[14px] outline-none focus:border-forest"
          />
          <button
            type="button"
            onClick={handleGetRates}
            disabled={loadingRates}
            className="rounded-[2px] border border-forest px-[16px] py-[10px] text-[13px] font-semibold text-forest transition hover:bg-forest hover:text-paper disabled:opacity-60"
          >
            {loadingRates ? "Getting rates…" : rates ? "Recalculate" : "Get rates"}
          </button>
        </div>
      </div>

      {rates && !rates.some((r) => matchesCustomerChoice(r, order)) && (
        <p className="mt-3 text-[12.5px] text-brass">
          None of these exactly match {order.shippingRate.provider} {order.shippingRate.service} (the option the customer
          selected) — pick the closest substitute.
        </p>
      )}

      {rates && (
        <div className="mt-4 flex flex-col gap-2">
          {rates.map((rate) => {
            const isMatch = matchesCustomerChoice(rate, order);
            return (
              <label
                key={rate.id}
                className={`flex cursor-pointer items-center justify-between rounded-[2px] border p-3 transition ${
                  selectedRateId === rate.id ? "border-forest bg-cream" : "border-line"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="admin-rate"
                    checked={selectedRateId === rate.id}
                    onChange={() => setSelectedRateId(rate.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2 text-[14px] font-medium text-ink">
                      {rate.provider} — {rate.service}
                      {isMatch && (
                        <span className="rounded-[2px] bg-forest px-[7px] py-[2px] font-mono text-[9px] uppercase tracking-[0.08em] text-cream">
                          Customer&apos;s choice
                        </span>
                      )}
                    </div>
                    {rate.estimatedDays && <div className="text-[12px] text-muted">~{rate.estimatedDays} business days</div>}
                  </div>
                </div>
                <div className="font-serif text-[16px] text-ink">${(rate.amountCents / 100).toFixed(2)}</div>
              </label>
            );
          })}
        </div>
      )}

      {error && <p className="mt-3 text-[13px] font-medium text-red-700">{error}</p>}

      {rates && (
        <button
          type="button"
          onClick={handleBuyLabel}
          disabled={!selectedRateId || buying}
          className="mt-4 w-full rounded-[2px] bg-brass px-[22px] py-[12px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {buying
            ? "Purchasing…"
            : selectedRateId
            ? `Buy label — $${(rates.find((r) => r.id === selectedRateId)!.amountCents / 100).toFixed(2)}`
            : "Select a rate"}
        </button>
      )}
    </div>
  );
}
