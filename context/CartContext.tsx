"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { applyBulkDiscount, type BulkTier } from "@/lib/pricing";

export type CartItem = {
  productId: string;
  /** Present when the product line is a specific variant rather than the base product. */
  variantId?: string;
  variantLabel?: string;
  name: string;
  /** Undiscounted per-unit price. */
  basePriceCents: number;
  /** Effective per-unit price at this item's current qty — kept in sync with qty by addItem/updateQty, reflecting any bulk-quantity discount. */
  priceCents: number;
  imageUrl: string;
  weightOz: number;
  bulkTiers?: BulkTier[];
  /** Marks this line as a special/limited-batch pre-order rather than ready-to-ship stock. */
  isPreorder?: boolean;
  preorderEstimate?: string;
  qty: number;
};

type CartLineKey = { productId: string; variantId?: string };

function sameLine(a: CartLineKey, b: CartLineKey): boolean {
  return a.productId === b.productId && (a.variantId ?? "") === (b.variantId ?? "");
}

function effectivePriceCents(basePriceCents: number, bulkTiers: BulkTier[] | undefined, qty: number): number {
  return applyBulkDiscount(basePriceCents, bulkTiers, qty);
}

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty" | "priceCents">, qty?: number) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clear: () => void;
  subtotalCents: number;
  totalQty: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "haywood-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<Record<string, unknown>>;
        // Back-compat: carts saved before bulk pricing only had `priceCents`
        // (no basePriceCents) — treat that as the undiscounted base price.
        const migrated: CartItem[] = parsed.map((raw) => {
          const basePriceCents = (raw.basePriceCents as number | undefined) ?? (raw.priceCents as number | undefined) ?? 0;
          const bulkTiers = raw.bulkTiers as BulkTier[] | undefined;
          const qty = (raw.qty as number | undefined) ?? 1;
          return {
            productId: raw.productId as string,
            variantId: raw.variantId as string | undefined,
            variantLabel: raw.variantLabel as string | undefined,
            name: raw.name as string,
            imageUrl: raw.imageUrl as string,
            weightOz: raw.weightOz as number,
            basePriceCents,
            bulkTiers,
            isPreorder: raw.isPreorder as boolean | undefined,
            preorderEstimate: raw.preorderEstimate as string | undefined,
            qty,
            priceCents: effectivePriceCents(basePriceCents, bulkTiers, qty),
          };
        });
        setItems(migrated);
      }
    } catch {
      // ignore corrupt/inaccessible storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "qty" | "priceCents">, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, item));
      if (existing) {
        const newQty = existing.qty + qty;
        return prev.map((i) =>
          sameLine(i, item)
            ? { ...i, ...item, qty: newQty, priceCents: effectivePriceCents(item.basePriceCents, item.bulkTiers, newQty) }
            : i
        );
      }
      return [...prev, { ...item, qty, priceCents: effectivePriceCents(item.basePriceCents, item.bulkTiers, qty) }];
    });
  }

  function updateQty(productId: string, variantId: string | undefined, qty: number) {
    if (qty <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        sameLine(i, { productId, variantId })
          ? { ...i, qty, priceCents: effectivePriceCents(i.basePriceCents, i.bulkTiers, qty) }
          : i
      )
    );
  }

  function removeItem(productId: string, variantId?: string) {
    setItems((prev) => prev.filter((i) => !sameLine(i, { productId, variantId })));
  }

  function clear() {
    setItems([]);
  }

  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clear, subtotalCents, totalQty }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
