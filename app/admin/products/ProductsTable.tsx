"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import ProductModal from "./ProductModal";
import ProductForm from "./ProductForm";

export default function ProductsTable({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const modalOpen = editing !== null || creating;

  function closeModal() {
    setEditing(null);
    setCreating(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-[32px] text-ink">Products</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-[9px] rounded-[2px] bg-brass px-[18px] py-[11px] text-[14px] font-semibold text-forest-deep transition hover:brightness-[1.06]"
        >
          + New product
        </button>
      </div>

      {/* Mobile: stacked cards. A fixed-column table can't reflow, so on a
          narrow screen the name column gets squeezed and wraps word-by-word. */}
      <div className="mt-8 flex flex-col gap-3 sm:hidden">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setEditing(product)}
            className="rounded-[3px] border border-line bg-paper p-4 text-left hover:border-forest"
          >
            <div className="font-medium text-ink">{product.name}</div>
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <span className="text-muted">
                ${(product.priceCents / 100).toFixed(2)} · {product.stockQty} in stock
              </span>
              <span className={`font-mono text-[10.5px] uppercase tracking-[0.1em] ${product.active ? "text-forest" : "text-muted"}`}>
                {product.active ? "Active" : "Inactive"}
              </span>
            </div>
          </button>
        ))}
        {products.length === 0 && <p className="py-8 text-center text-muted">No products yet.</p>}
      </div>

      {/* Desktop / tablet: full table. */}
      <div className="mt-8 hidden overflow-hidden rounded-[3px] border border-line sm:block">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-line bg-paper font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-b-0 hover:bg-paper">
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setEditing(product)}
                    className="font-medium text-ink hover:text-forest"
                  >
                    {product.name}
                  </button>
                </td>
                <td className="px-5 py-4 text-muted">${(product.priceCents / 100).toFixed(2)}</td>
                <td className="px-5 py-4 text-muted">{product.stockQty}</td>
                <td className="px-5 py-4">
                  <span className={`font-mono text-[10.5px] uppercase tracking-[0.1em] ${product.active ? "text-forest" : "text-muted"}`}>
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ProductModal title={editing ? "Edit product" : "New product"} onClose={closeModal}>
          <ProductForm product={editing ?? undefined} onSaved={closeModal} onCancel={closeModal} />
        </ProductModal>
      )}
    </div>
  );
}
