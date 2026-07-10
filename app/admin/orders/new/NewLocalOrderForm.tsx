"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type VariantOption = { id: string; label: string; priceCents: number; stockQty: number };
type ProductOption = {
  id: string;
  name: string;
  priceCents: number;
  stockQty: number;
  variants: VariantOption[] | null;
};

type Row = { productId: string; variantId: string; qty: string };

const PAYMENT_METHODS = ["Cash", "Venmo", "PayPal", "Zelle", "Other"];
const inputClass = "w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest";

function emptyRow(): Row {
  return { productId: "", variantId: "", qty: "1" };
}

function rowPriceCents(row: Row, products: ProductOption[]): number | null {
  const product = products.find((p) => p.id === row.productId);
  if (!product) return null;
  if (product.variants) {
    const variant = product.variants.find((v) => v.id === row.variantId);
    return variant ? variant.priceCents : null;
  }
  return product.priceCents;
}

export default function NewLocalOrderForm({ products }: { products: ProductOption[] }) {
  const router = useRouter();
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function setProduct(index: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    const defaultVariantId = product?.variants?.[0]?.id ?? "";
    updateRow(index, { productId, variantId: defaultVariantId });
  }

  const subtotalCents = rows.reduce((sum, row) => {
    const price = rowPriceCents(row, products);
    const qty = parseInt(row.qty, 10);
    return price !== null && qty > 0 ? sum + price * qty : sum;
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!buyerName.trim()) {
      setError("Buyer name is required.");
      return;
    }
    const items = rows
      .filter((r) => r.productId)
      .map((r) => ({
        productId: r.productId,
        variantId: r.variantId || undefined,
        qty: parseInt(r.qty, 10),
      }));
    if (items.length === 0) {
      setError("Add at least one item.");
      return;
    }
    if (items.some((i) => !Number.isInteger(i.qty) || i.qty <= 0)) {
      setError("Item quantities must be positive whole numbers.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/orders/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerName: buyerName.trim(), buyerEmail: buyerEmail.trim() || undefined, paymentMethod, items }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not record the sale.");
      }
      router.push(`/admin/orders/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Buyer name</label>
          <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Buyer email (optional)</label>
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            className={inputClass}
            placeholder="For an invoice/receipt"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Payment method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClass}>
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Items</div>
        <div className="flex flex-col gap-3">
          {rows.map((row, i) => {
            const product = products.find((p) => p.id === row.productId);
            const price = rowPriceCents(row, products);
            return (
              <div key={i} className="flex flex-col gap-2 rounded-[3px] border border-line bg-paper p-3 sm:flex-row sm:items-center">
                <select value={row.productId} onChange={(e) => setProduct(i, e.target.value)} className={`${inputClass} sm:flex-[2]`}>
                  <option value="">Select a product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {product?.variants && (
                  <select
                    value={row.variantId}
                    onChange={(e) => updateRow(i, { variantId: e.target.value })}
                    className={`${inputClass} sm:flex-[1.5]`}
                  >
                    {product.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label} — ${(v.priceCents / 100).toFixed(2)} ({v.stockQty} in stock)
                      </option>
                    ))}
                  </select>
                )}

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={row.qty}
                  onChange={(e) => updateRow(i, { qty: e.target.value })}
                  className={`${inputClass} sm:w-24`}
                />

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
                  <span className="text-[13px] text-muted sm:text-right">{price !== null ? `$${(price / 100).toFixed(2)} ea` : ""}</span>
                  <button
                    type="button"
                    onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                    disabled={rows.length === 1}
                    className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted hover:text-red-700 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, emptyRow()])}
          className="mt-3 font-mono text-[12px] uppercase tracking-[0.1em] text-forest hover:text-forest-deep"
        >
          + Add item
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="text-[14.5px] text-muted">Subtotal</span>
        <span className="font-serif text-[22px] text-ink">${(subtotalCents / 100).toFixed(2)}</span>
      </div>

      {error && <p className="text-[13px] font-medium text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Recording…" : "Record sale"}
      </button>
    </form>
  );
}
