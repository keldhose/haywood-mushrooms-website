"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCart({
  productId,
  name,
  priceCents,
  imageUrl,
  weightOz,
  stockQty,
}: {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  weightOz: number;
  stockQty: number;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (stockQty <= 0) {
    return (
      <div className="rounded-[2px] border border-line bg-cream px-[22px] py-[13px] text-center text-[14.5px] font-semibold text-muted">
        Out of stock
      </div>
    );
  }

  function handleAdd() {
    addItem({ productId, name, priceCents, imageUrl, weightOz }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none focus:border-forest"
      >
        {Array.from({ length: Math.min(stockQty, 10) }, (_, i) => i + 1).map((n) => (
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
  );
}
