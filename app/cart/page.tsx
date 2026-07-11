"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { bestBulkTier } from "@/lib/pricing";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotalCents } = useCart();

  if (items.length === 0) {
    return (
      <main className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[640px] text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Haywood Mushrooms / Cart
          </div>
          <h1 className="mt-4 font-serif text-[36px] text-ink">Your cart is empty</h1>
          <p className="mt-4 text-[16px] text-muted">Browse the shop to find spawn for your next grow.</p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-[9px] rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06]"
          >
            Go to shop <span className="font-mono">→</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-[800px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Haywood Mushrooms / Cart
        </div>
        <h1 className="mt-4 font-serif text-[36px] text-ink">Your cart</h1>

        <div className="mt-8 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId ?? ""}`}
              className="flex flex-col gap-4 rounded-[3px] border border-line bg-paper p-5 sm:flex-row sm:items-center sm:gap-5"
            >
              <div className="flex items-center gap-4 sm:min-w-0 sm:flex-1">
                <div className="relative h-20 w-20 flex-none overflow-hidden rounded-[2px] bg-[#1a1512]">
                  <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium text-ink">
                    {item.name}
                    {item.variantLabel && <span className="text-muted"> — {item.variantLabel}</span>}
                    {item.isPreorder && (
                      <span className="ml-2 rounded-[2px] bg-brass px-[7px] py-[2px] align-middle font-mono text-[9.5px] uppercase tracking-[0.08em] text-forest-deep">
                        Made to order
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-mono text-[13px] text-muted">
                    ${(item.priceCents / 100).toFixed(2)} each
                    {bestBulkTier(item.bulkTiers, item.qty) && (
                      <span className="ml-1.5 text-forest">
                        · {bestBulkTier(item.bulkTiers, item.qty)!.discountPercent}% bulk discount
                      </span>
                    )}
                  </div>
                  {item.isPreorder && item.preorderEstimate && (
                    <div className="mt-1 text-[12px] text-muted">{item.preorderEstimate}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-5">
                <select
                  value={item.qty}
                  onChange={(e) => updateQty(item.productId, item.variantId, Number(e.target.value))}
                  className="rounded-[2px] border border-line bg-paper p-2.5 text-[15px] outline-none focus:border-forest"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <div className="w-20 text-right font-serif text-[18px] text-ink">
                  ${((item.priceCents * item.qty) / 100).toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  aria-label={`Remove ${item.name}`}
                  className="font-mono text-[12px] text-muted hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <span className="text-[16px] font-semibold text-ink">Subtotal</span>
          <span className="font-serif text-[26px] text-ink">${(subtotalCents / 100).toFixed(2)}</span>
        </div>
        <p className="mt-1.5 text-[13px] text-muted">Shipping calculated at checkout.</p>

        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center gap-[9px] rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06]"
        >
          Proceed to checkout <span className="font-mono">→</span>
        </Link>
      </div>
    </main>
  );
}
