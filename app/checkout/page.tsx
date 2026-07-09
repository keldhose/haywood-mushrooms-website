"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type Rate = {
  id: string;
  provider: string;
  service: string;
  amountCents: number;
  estimatedDays?: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents } = useCart();

  const [name, setName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [rates, setRates] = useState<Rate[] | null>(null);
  const [shipmentId, setShipmentId] = useState<string | null>(null);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [payingNow, setPayingNow] = useState(false);
  const [error, setError] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [promoChecking, setPromoChecking] = useState(false);
  const [promoApplied, setPromoApplied] = useState<{ code: string; description: string } | null>(null);
  const [promoError, setPromoError] = useState("");

  async function handleApplyPromo() {
    if (!promoCode.trim()) return;
    setPromoChecking(true);
    setPromoError("");
    setPromoApplied(null);

    try {
      const res = await fetch("/api/promo-code/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "That code isn't valid.");
      }
      setPromoApplied({ code: data.code, description: data.description });
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPromoChecking(false);
    }
  }

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  async function handleGetRates(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingRates(true);
    setError("");
    setRates(null);
    setShipmentId(null);
    setSelectedRateId(null);

    try {
      const res = await fetch("/api/cart/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty })),
          address: { name, street1, street2, city, state, zip },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not calculate shipping.");
      }

      setRates(data.rates);
      setShipmentId(data.shipmentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoadingRates(false);
    }
  }

  async function handlePay() {
    if (!selectedRateId || !shipmentId) return;
    setPayingNow(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty })),
          address: { name, street1, street2, city, state, zip },
          rateId: selectedRateId,
          shipmentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPayingNow(false);
    }
  }

  if (items.length === 0) {
    return null;
  }

  const selectedRate = rates?.find((r) => r.id === selectedRateId) ?? null;
  const totalCents = subtotalCents + (selectedRate?.amountCents ?? 0);

  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[900px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Haywood Mushrooms / Checkout
        </div>
        <h1 className="mt-4 font-serif text-[36px] text-ink">Checkout</h1>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <form onSubmit={handleGetRates}>
              <div className="font-serif text-[22px] text-ink">Shipping address</div>
              <p className="mt-1.5 text-[13px] text-muted">Currently shipping within the United States only.</p>

              <div className="mt-5">
                <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Street address</label>
                <input
                  type="text"
                  required
                  value={street1}
                  onChange={(e) => setStreet1(e.target.value)}
                  className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                  Apt / suite <span className="normal-case text-muted/70">(optional)</span>
                </label>
                <input
                  type="text"
                  value={street2}
                  onChange={(e) => setStreet2(e.target.value)}
                  className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">State</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="NC"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] uppercase outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">ZIP</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingRates}
                className="mt-6 rounded-[2px] border border-forest px-[22px] py-[13px] text-[14.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper disabled:opacity-60"
              >
                {loadingRates ? "Calculating…" : rates ? "Recalculate shipping" : "Calculate shipping"}
              </button>
            </form>

            {rates && (
              <div className="mt-8">
                <div className="font-serif text-[22px] text-ink">Shipping options</div>
                <div className="mt-4 flex flex-col gap-3">
                  {rates.map((rate) => (
                    <label
                      key={rate.id}
                      className={`flex cursor-pointer items-center justify-between rounded-[2px] border p-4 transition ${
                        selectedRateId === rate.id ? "border-forest bg-paper" : "border-line"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="rate"
                          checked={selectedRateId === rate.id}
                          onChange={() => setSelectedRateId(rate.id)}
                        />
                        <div>
                          <div className="text-[15px] font-medium text-ink">
                            {rate.provider} — {rate.service}
                          </div>
                          {rate.estimatedDays && (
                            <div className="text-[13px] text-muted">~{rate.estimatedDays} business days</div>
                          )}
                        </div>
                      </div>
                      <div className="font-serif text-[18px] text-ink">${(rate.amountCents / 100).toFixed(2)}</div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-fit rounded-[3px] border border-line bg-paper p-6">
            <div className="font-serif text-[20px] text-ink">Order summary</div>
            <div className="mt-4 flex flex-col gap-2">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex justify-between text-[14px] text-muted">
                  <span>
                    {item.name}
                    {item.variantLabel ? ` — ${item.variantLabel}` : ""} × {item.qty}
                  </span>
                  <span>${((item.priceCents * item.qty) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t border-line pt-4 text-[14.5px]">
              <span className="text-muted">Subtotal</span>
              <span className="text-ink">${(subtotalCents / 100).toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between text-[14.5px]">
              <span className="text-muted">Shipping</span>
              <span className="text-ink">{selectedRate ? `$${(selectedRate.amountCents / 100).toFixed(2)}` : "—"}</span>
            </div>

            {promoApplied ? (
              <div className="mt-4 flex items-center gap-2 rounded-[2px] border border-forest/30 bg-cream px-3 py-2.5 text-[13px] text-forest">
                <span>✓</span>
                <span>
                  <b>{promoApplied.code}</b> applied — {promoApplied.description}
                </span>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="w-0 flex-1 rounded-[2px] border border-line bg-cream p-[10px] text-[13.5px] uppercase outline-none focus:border-forest"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoChecking || !promoCode.trim()}
                    className="rounded-[2px] border border-forest px-[16px] py-[10px] text-[13px] font-semibold text-forest transition hover:bg-forest hover:text-paper disabled:opacity-60"
                  >
                    {promoChecking ? "Checking…" : "Apply"}
                  </button>
                </div>
                {promoError && <p className="mt-1.5 text-[12px] font-medium text-red-700">{promoError}</p>}
                <p className="mt-1.5 text-[12px] text-muted">Have a code? You can also enter it at payment.</p>
              </div>
            )}

            <div className="mt-3 flex justify-between border-t border-line pt-3">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-serif text-[22px] text-ink">${(totalCents / 100).toFixed(2)}</span>
            </div>

            {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}

            <button
              type="button"
              onClick={handlePay}
              disabled={!selectedRate || payingNow}
              className="mt-5 w-full justify-center rounded-[2px] bg-brass py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {payingNow ? "Redirecting to payment…" : "Pay now"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
