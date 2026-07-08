"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";

export default function ProductForm({
  product,
  onSaved,
  onCancel,
}: {
  product?: Product;
  /** If provided, called instead of navigating back to /admin/products after a save/delete (e.g. when shown in a modal). */
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [scientificName, setScientificName] = useState(product?.scientificName ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? (product.priceCents / 100).toFixed(2) : "");
  const [stockQty, setStockQty] = useState(product?.stockQty.toString() ?? "0");
  const [weightOz, setWeightOz] = useState(product?.weightOz.toString() ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls ?? []);
  const [active, setActive] = useState(product?.active ?? true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/admin/products/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || `Upload failed for ${file.name}.`);
          }
          return data.url as string;
        })
      );

      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleSetCover(url: string) {
    setImageUrls((prev) => [url, ...prev.filter((u) => u !== url)]);
  }

  function handleRemoveImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (imageUrls.length === 0) {
      setError("Add at least one photo before saving.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name,
      scientificName,
      description,
      priceCents: Math.round(parseFloat(price) * 100),
      stockQty: parseInt(stockQty, 10),
      weightOz: parseFloat(weightOz),
      imageUrls,
      active,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      router.refresh();
      if (onSaved) {
        onSaved();
      } else {
        router.push("/admin/products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product.");
      }
      router.refresh();
      if (onSaved) {
        onSaved();
      } else {
        router.push("/admin/products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[560px]">
      <div>
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-[2px] border border-line bg-paper p-[12px] text-[15px] outline-none focus:border-forest"
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Scientific name</label>
        <input
          type="text"
          required
          value={scientificName}
          onChange={(e) => setScientificName(e.target.value)}
          className="w-full rounded-[2px] border border-line bg-paper p-[12px] text-[15px] outline-none focus:border-forest"
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Description</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-y rounded-[2px] border border-line bg-paper p-[12px] text-[15px] outline-none focus:border-forest"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Price ($)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-[2px] border border-line bg-paper p-[12px] text-[15px] outline-none focus:border-forest"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Stock qty</label>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={stockQty}
            onChange={(e) => setStockQty(e.target.value)}
            className="w-full rounded-[2px] border border-line bg-paper p-[12px] text-[15px] outline-none focus:border-forest"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Weight (oz)</label>
          <input
            type="number"
            required
            min="0"
            step="0.1"
            value={weightOz}
            onChange={(e) => setWeightOz(e.target.value)}
            className="w-full rounded-[2px] border border-line bg-paper p-[12px] text-[15px] outline-none focus:border-forest"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          Photos <span className="normal-case text-muted/70">(first one is used as the main/catalog image)</span>
        </label>

        {imageUrls.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {imageUrls.map((url, i) => (
              <div key={url} className="flex flex-col items-center gap-1.5">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail */}
                  <img
                    src={url}
                    alt=""
                    className={`h-16 w-16 rounded-[2px] border object-cover ${i === 0 ? "border-forest" : "border-line"}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    aria-label="Remove photo"
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] text-cream"
                  >
                    ×
                  </button>
                </div>
                {i === 0 ? (
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-forest">Cover</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetCover(url)}
                    className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted hover:text-forest"
                  >
                    Set cover
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <label className="inline-flex cursor-pointer items-center gap-[9px] rounded-[2px] border border-forest px-[16px] py-[10px] text-[13.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper">
          {uploading ? "Uploading…" : "Add photos"}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {imageUrls.length === 0 && (
          <p className="mt-2 text-[12.5px] text-muted">At least one photo is required.</p>
        )}
      </div>

      <label className="mt-4 flex items-center gap-2.5 text-[14px] text-ink">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active (visible in the shop)
      </label>

      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || deleting}
          className="rounded-[2px] bg-brass px-[22px] py-[12px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="font-mono text-[12px] uppercase tracking-[0.1em] text-red-700 hover:text-red-900 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete product"}
          </button>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving || deleting}
            className="ml-auto font-mono text-[12px] uppercase tracking-[0.1em] text-muted hover:text-ink disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
