"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
// Type-only: importing anything runtime from "@/lib/orders" here would pull
// the server-only firebase-admin module graph into the client bundle.
import type { OrderItem } from "@/lib/orders";
import type { BulkTier } from "@/lib/pricing";

type RemoteVariant = { id: string; label: string; priceCents: number; weightOz: number; stockQty: number };
type RemoteProduct = {
  id: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  weightOz: number;
  stockQty: number;
  variants?: RemoteVariant[];
  bulkTiers?: BulkTier[];
};

export default function ReorderButton({ items }: { items: OrderItem[] }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function handleReorder(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setNote("");

    try {
      const ids = Array.from(new Set(items.map((i) => i.productId)));
      const res = await fetch(`/api/products/by-ids?ids=${ids.map(encodeURIComponent).join(",")}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not reorder right now.");
      }

      const products = data.products as Record<string, RemoteProduct>;
      let addedCount = 0;
      let skippedCount = 0;

      for (const item of items) {
        const product = products[item.productId];
        if (!product) {
          skippedCount++;
          continue;
        }

        let priceCents = product.priceCents;
        let weightOz = product.weightOz;
        let stockQty = product.stockQty;
        let variantLabel: string | undefined;

        if (item.variantId) {
          const variant = product.variants?.find((v) => v.id === item.variantId);
          if (!variant) {
            skippedCount++;
            continue;
          }
          priceCents = variant.priceCents;
          weightOz = variant.weightOz;
          stockQty = variant.stockQty;
          variantLabel = variant.label;
        }

        if (stockQty <= 0) {
          skippedCount++;
          continue;
        }

        addItem(
          {
            productId: product.id,
            variantId: item.variantId,
            variantLabel,
            name: product.name,
            basePriceCents: priceCents,
            bulkTiers: product.bulkTiers,
            imageUrl: product.imageUrl,
            weightOz,
          },
          Math.min(item.qty, stockQty)
        );
        addedCount++;
      }

      if (addedCount === 0) {
        setNote("None of these items are currently available.");
        return;
      }

      if (skippedCount > 0) {
        setNote(`${skippedCount} item${skippedCount !== 1 ? "s are" : " is"} no longer available and ${skippedCount !== 1 ? "were" : "was"} skipped.`);
      }

      router.push("/checkout");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleReorder}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-[2px] bg-brass px-[16px] py-[10px] text-[13.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60"
      >
        {loading ? "Reordering…" : "Reorder"} <span className="font-mono">↻</span>
      </button>
      {note && <p className="mt-2 text-[12.5px] text-muted">{note}</p>}
    </div>
  );
}
