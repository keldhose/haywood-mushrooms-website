import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { applyBulkDiscount, type BulkTier } from "@/lib/pricing";

/** One purchasable option on a product (e.g. a 1/5/10 lb size, or grain/agar/LC form). */
export type ProductVariant = {
  id: string;
  label: string;
  priceCents: number;
  weightOz: number;
  stockQty: number;
};

export type Product = {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  priceCents: number;
  stockQty: number;
  weightOz: number;
  /** All photos, in display order. Always has at least one entry. */
  imageUrls: string[];
  /** First image — convenient for contexts that only show one (cart, catalog cards). */
  imageUrl: string;
  active: boolean;
  /** Optional purchasable options. When absent, the product itself is the single implicit variant. */
  variants?: ProductVariant[];
  /** Optional quantity-break discounts — same schedule applies to whichever variant is being bought. */
  bulkTiers?: BulkTier[];
  /** Marks this as a special/limited-batch listing, not ready-to-ship stock. stockQty represents pre-order slots, not on-hand inventory. */
  isPreorder?: boolean;
  /** Free-text shipping estimate shown to customers, e.g. "Ships in ~4-6 weeks". Only meaningful when isPreorder is true. */
  preorderEstimate?: string;
};

function toProduct(id: string, data: FirebaseFirestore.DocumentData): Product {
  // Back-compat: older docs (seeded before multi-image support) only have
  // a single `imageUrl` string field rather than `imageUrls`.
  const imageUrls: string[] = Array.isArray(data.imageUrls)
    ? data.imageUrls
    : data.imageUrl
    ? [data.imageUrl]
    : [];

  const variants: ProductVariant[] | undefined =
    Array.isArray(data.variants) && data.variants.length > 0
      ? data.variants.map((v: FirebaseFirestore.DocumentData) => ({
          id: v.id,
          label: v.label,
          priceCents: v.priceCents,
          weightOz: v.weightOz,
          stockQty: v.stockQty,
        }))
      : undefined;

  return {
    id,
    name: data.name,
    scientificName: data.scientificName,
    description: data.description,
    priceCents: data.priceCents,
    stockQty: data.stockQty,
    weightOz: data.weightOz,
    imageUrls,
    imageUrl: imageUrls[0] ?? "",
    active: data.active !== false,
    variants,
    bulkTiers: Array.isArray(data.bulkTiers) && data.bulkTiers.length > 0 ? data.bulkTiers : undefined,
    isPreorder: data.isPreorder === true,
    preorderEstimate: data.preorderEstimate || undefined,
  };
}

/**
 * Resolves the purchasable price/weight/stock for a product, given an
 * optional variant id. Products without variants behave as a single
 * implicit variant built from their own base fields — this is the one
 * place that distinction should matter, so cart/checkout/stock code can
 * stay variant-agnostic and just call this.
 */
export function getVariant(
  product: Product,
  variantId?: string,
  /** When >1 and the product has bulk tiers, priceCents reflects the best qualifying quantity discount. */
  qty: number = 1
): { id?: string; label?: string; priceCents: number; weightOz: number; stockQty: number } {
  const base =
    product.variants && product.variants.length > 0
      ? (variantId ? product.variants.find((v) => v.id === variantId) : undefined) ?? product.variants[0]
      : { priceCents: product.priceCents, weightOz: product.weightOz, stockQty: product.stockQty };

  return { ...base, priceCents: applyBulkDiscount(base.priceCents, product.bulkTiers, qty) };
}

export async function getAllProducts(): Promise<Product[]> {
  const snapshot = await adminDb.collection("products").where("active", "==", true).get();
  return snapshot.docs.map((doc) => toProduct(doc.id, doc.data()));
}

/** Admin-only: every product regardless of active/inactive status. */
export async function getAllProductsForAdmin(): Promise<Product[]> {
  const snapshot = await adminDb.collection("products").get();
  return snapshot.docs.map((doc) => toProduct(doc.id, doc.data()));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const doc = await adminDb.collection("products").doc(slug).get();
  if (!doc.exists) {
    return null;
  }
  return toProduct(doc.id, doc.data()!);
}

/**
 * Looks up multiple products by ID at once. Used at checkout time to
 * re-derive authoritative prices/weights/stock from Firestore rather than
 * trusting whatever a client sent — cart contents are just an (id, qty)
 * wishlist, never a source of truth for pricing.
 */
export async function getProductsByIds(ids: string[]): Promise<Map<string, Product>> {
  if (ids.length === 0) {
    return new Map();
  }

  const uniqueIds = Array.from(new Set(ids));
  const refs = uniqueIds.map((id) => adminDb.collection("products").doc(id));
  const snaps = await adminDb.getAll(...refs);

  const map = new Map<string, Product>();
  snaps.forEach((snap) => {
    if (snap.exists) {
      map.set(snap.id, toProduct(snap.id, snap.data()!));
    }
  });
  return map;
}
