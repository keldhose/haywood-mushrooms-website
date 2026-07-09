"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
// Type-only: importing anything runtime from "@/lib/products" here would
// pull the server-only firebase-admin module graph into the client bundle.
import type { Product } from "@/lib/products";

function resolveVariant(product: Product, variantId?: string) {
  if (product.variants && product.variants.length > 0) {
    const found = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
    return found ?? product.variants[0];
  }
  return { id: undefined, label: undefined, priceCents: product.priceCents, weightOz: product.weightOz, stockQty: product.stockQty };
}

export default function AddToCart({
  product,
  compact = false,
}: {
  product: Product;
  /** Catalog-card usage: the caller already shows price, so hide the built-in price/stock line and variant chips — just add the default (first in-stock) variant. */
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const variants = product.variants;
  const hasVariants = Boolean(variants && variants.length > 0);
  const defaultVariantId = hasVariants ? (variants!.find((v) => v.stockQty > 0) ?? variants![0]).id : undefined;

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(defaultVariantId);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = resolveVariant(product, selectedVariantId);
  const outOfStock = selected.stockQty <= 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        variantId: hasVariants ? selected.id : undefined,
        variantLabel: hasVariants ? selected.label : undefined,
        name: product.name,
        priceCents: selected.priceCents,
        imageUrl: product.imageUrl,
        weightOz: selected.weightOz,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function selectVariant(id: string) {
    setSelectedVariantId(id);
    setQty(1);
  }

  return (
    <div>
      {!compact && (
        <>
          <div className="font-serif text-[32px] text-ink">${(selected.priceCents / 100).toFixed(2)}</div>
          <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            {(selected.weightOz / 16).toFixed(1)} lb ·{" "}
            {selected.stockQty > 0 ? `${selected.stockQty} in stock` : "Out of stock"}
          </div>
        </>
      )}

      {!compact && hasVariants && (
        <div className="mt-6">
          <div className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Size</div>
          <div className="flex flex-wrap gap-2.5">
            {variants!.map((v) => {
              const soldOut = v.stockQty <= 0;
              const isSelected = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={soldOut}
                  onClick={() => selectVariant(v.id)}
                  className={`min-w-[92px] rounded-[3px] border px-4 py-3 text-center transition ${
                    soldOut
                      ? "cursor-not-allowed border-line bg-paper opacity-45"
                      : isSelected
                      ? "border-forest bg-white shadow-[inset_0_0_0_1px_var(--color-forest)]"
                      : "border-line bg-paper hover:border-forest/50"
                  }`}
                >
                  <div className="text-[14px] font-semibold text-ink">{v.label}</div>
                  <div className={`mt-[3px] font-mono text-[11px] ${soldOut ? "text-red-700" : "text-muted"}`}>
                    {soldOut ? "Sold out" : `$${(v.priceCents / 100).toFixed(2)}`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={compact ? "mt-4" : "mt-7 max-w-[360px]"}>
        {outOfStock ? (
          <div className="rounded-[2px] border border-line bg-cream px-[22px] py-[13px] text-center text-[14.5px] font-semibold text-muted">
            Out of stock
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest"
            >
              {Array.from({ length: Math.min(selected.stockQty, 10) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 justify-center rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06]"
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
