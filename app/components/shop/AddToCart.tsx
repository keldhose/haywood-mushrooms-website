"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
// Type-only: importing anything runtime from "@/lib/products" here would
// pull the server-only firebase-admin module graph into the client bundle.
import type { Product } from "@/lib/products";
import { applyBulkDiscount, bestBulkTier } from "@/lib/pricing";

function BackInStockForm({
  productId,
  variantId,
  itemLabel,
}: {
  productId: string;
  variantId?: string;
  itemLabel: string;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/stock-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[4px] border border-line bg-white p-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-forest text-[20px] text-cream">
          ✓
        </div>
        <div className="mt-3 font-serif text-[20px] text-ink">You&apos;re on the list.</div>
        <p className="mt-2.5 text-[13.5px] leading-[1.5] text-muted">
          We&apos;ll email you the moment {itemLabel} is back in stock. No other mail, promise.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[4px] border border-dashed border-line bg-paper p-6">
      <span className="inline-block rounded-[2px] border border-red-300 bg-red-50 px-[9px] py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-red-700">
        Sold out
      </span>
      <div className="mt-4 font-serif text-[20px] text-ink">{itemLabel}</div>
      <p className="mt-2 text-[13.5px] leading-[1.5] text-muted">
        This batch is gone. Leave your email and we&apos;ll notify you the moment it&apos;s back — usually within a
        grow cycle.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@email.com"
          className="w-full rounded-[2px] border border-line bg-white p-[12px] text-[15px] outline-none focus:border-forest"
        />
        {error && <p className="mt-2 text-[12.5px] font-medium text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-3.5 w-full justify-center rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Notify me →"}
        </button>
      </form>
    </div>
  );
}

function resolveVariant(product: Product, variantId?: string) {
  if (product.variants && product.variants.length > 0) {
    const found = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
    return found ?? product.variants[0];
  }
  return {
    id: undefined,
    label: undefined,
    priceCents: product.priceCents,
    weightOz: product.weightOz,
    stockQty: product.stockQty,
    preorderPriceCents: product.preorderPriceCents,
  };
}

export default function AddToCart({
  product,
  compact = false,
  showPreorderBadge = true,
  preferMadeToOrder = false,
  enableMadeToOrder = true,
}: {
  product: Product;
  /** Catalog-card usage: smaller price, no weight/stock line, tighter variant chips. Still fully interactive — price updates with the selected variant. */
  compact?: boolean;
  /** Set false when this card is shown in a context (e.g. the general "Products" grid) that already makes made-to-order status clear elsewhere. */
  showPreorderBadge?: boolean;
  /** Set true in a "Made to order" listing so the default selection/price shown is a made-to-order option, not whichever variant happens to be in stock. */
  preferMadeToOrder?: boolean;
  /** Set false in a plain "Products" listing so a fully sold-out product shows as out of stock there, instead of silently falling back to its made-to-order price. */
  enableMadeToOrder?: boolean;
}) {
  const { addItem } = useCart();
  const variants = product.variants;
  const hasVariants = Boolean(variants && variants.length > 0);
  const preorderActive = enableMadeToOrder && product.preorderActive === true;
  const isMtoEligible = (v: NonNullable<typeof variants>[number]) =>
    v.stockQty <= 0 && v.preorderPriceCents != null && preorderActive;
  const defaultVariantId = hasVariants
    ? (
        preferMadeToOrder
          ? variants!.find(isMtoEligible) ?? variants!.find((v) => v.stockQty > 0) ?? variants![0]
          : variants!.find((v) => v.stockQty > 0) ?? variants!.find(isMtoEligible) ?? variants![0]
      ).id
    : undefined;

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(defaultVariantId);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = resolveVariant(product, selectedVariantId);
  const isPreorder = selected.stockQty <= 0 && selected.preorderPriceCents != null && preorderActive;
  const outOfStock = selected.stockQty <= 0 && !isPreorder;
  const unitBasePriceCents = isPreorder ? selected.preorderPriceCents! : selected.priceCents;
  const bulkTiers = product.bulkTiers;
  const effectivePriceCents = applyBulkDiscount(unitBasePriceCents, bulkTiers, qty);
  const activeTier = bestBulkTier(bulkTiers, qty);
  const nextTier = bulkTiers?.find((t) => t.minQty > qty && t.minQty > (activeTier?.minQty ?? 0));

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        variantId: hasVariants ? selected.id : undefined,
        variantLabel: hasVariants ? selected.label : undefined,
        name: product.name,
        basePriceCents: unitBasePriceCents,
        bulkTiers,
        imageUrl: product.imageUrl,
        weightOz: selected.weightOz,
        isPreorder,
        preorderEstimate: isPreorder ? product.preorderEstimate : undefined,
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
      {isPreorder && showPreorderBadge && (
        <div className="mb-1.5 inline-block rounded-[2px] bg-brass px-[9px] py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-forest-deep">
          Made to order
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <div className={compact ? "font-serif text-[22px] text-ink" : "font-serif text-[32px] text-ink"}>
          ${(effectivePriceCents / 100).toFixed(2)}
        </div>
        {activeTier && (
          <div className={`font-mono text-muted line-through ${compact ? "text-[12px]" : "text-[15px]"}`}>
            ${(unitBasePriceCents / 100).toFixed(2)}
          </div>
        )}
      </div>
      {activeTier && (
        <div className={`mt-1 font-mono uppercase tracking-[0.08em] text-forest ${compact ? "text-[10px]" : "text-[11px]"}`}>
          {activeTier.discountPercent}% bulk discount applied
        </div>
      )}
      {!compact && (
        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          {(selected.weightOz / 16).toFixed(1)} lb ·{" "}
          {isPreorder ? "Made to order" : selected.stockQty > 0 ? `${selected.stockQty} in stock` : "Out of stock"}
        </div>
      )}
      {isPreorder && product.preorderEstimate && (
        <div className="mt-1.5 text-[12.5px] text-muted">{product.preorderEstimate}</div>
      )}
      {!compact && bulkTiers && bulkTiers.length > 0 && (
        <div className="mt-3 rounded-[2px] border border-dashed border-brass/50 bg-cream px-3 py-2.5 font-mono text-[11px] text-muted">
          {nextTier
            ? `Buy ${nextTier.minQty}+, save ${nextTier.discountPercent}%`
            : bulkTiers.map((t) => `${t.minQty}+ save ${t.discountPercent}%`).join(" · ")}
        </div>
      )}

      {hasVariants && (
        <div className={compact ? "mt-3" : "mt-6"}>
          {!compact && <div className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Size</div>}
          <div className="flex flex-wrap gap-2">
            {variants!.map((v) => {
              const vIsPreorder = v.stockQty <= 0 && v.preorderPriceCents != null && preorderActive;
              const soldOut = v.stockQty <= 0 && !vIsPreorder;
              const isSelected = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={soldOut}
                  onClick={() => selectVariant(v.id)}
                  className={`rounded-[3px] border text-center transition ${
                    compact ? "min-w-[64px] px-2.5 py-1.5" : "min-w-[92px] px-4 py-3"
                  } ${
                    soldOut
                      ? "cursor-not-allowed border-line bg-paper opacity-45"
                      : isSelected
                      ? "border-forest bg-white shadow-[inset_0_0_0_1px_var(--color-forest)]"
                      : "border-line bg-paper hover:border-forest/50"
                  }`}
                >
                  <div className={compact ? "text-[12.5px] font-semibold text-ink" : "text-[14px] font-semibold text-ink"}>
                    {v.label}
                  </div>
                  {!compact && (
                    <div className={`mt-[3px] font-mono text-[11px] ${soldOut ? "text-red-700" : "text-muted"}`}>
                      {soldOut
                        ? "Sold out"
                        : vIsPreorder
                        ? `$${(v.preorderPriceCents! / 100).toFixed(2)} · Made to order`
                        : `$${(v.priceCents / 100).toFixed(2)}`}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={compact ? "mt-4" : "mt-7 max-w-[360px]"}>
        {outOfStock ? (
          compact ? (
            <Link
              href={`/shop/${product.id}`}
              className="inline-flex font-mono text-[12px] uppercase tracking-[0.1em] text-forest hover:text-brass"
            >
              Notify me →
            </Link>
          ) : (
            <BackInStockForm
              productId={product.id}
              variantId={hasVariants ? selected.id : undefined}
              itemLabel={hasVariants && selected.label ? `${product.name} — ${selected.label}` : product.name}
            />
          )
        ) : (
          <div className="flex items-center gap-3">
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest"
            >
              {Array.from({ length: isPreorder ? 10 : Math.min(selected.stockQty, 10) }, (_, i) => i + 1).map((n) => (
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
