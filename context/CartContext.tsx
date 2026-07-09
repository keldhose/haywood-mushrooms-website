"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  /** Present when the product line is a specific variant rather than the base product. */
  variantId?: string;
  variantLabel?: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  weightOz: number;
  qty: number;
};

type CartLineKey = { productId: string; variantId?: string };

function sameLine(a: CartLineKey, b: CartLineKey): boolean {
  return a.productId === b.productId && (a.variantId ?? "") === (b.variantId ?? "");
}

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
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
        setItems(JSON.parse(stored));
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

  function addItem(item: Omit<CartItem, "qty">, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, item));
      if (existing) {
        return prev.map((i) => (sameLine(i, item) ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, qty }];
    });
  }

  function updateQty(productId: string, variantId: string | undefined, qty: number) {
    if (qty <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) => prev.map((i) => (sameLine(i, { productId, variantId }) ? { ...i, qty } : i)));
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
