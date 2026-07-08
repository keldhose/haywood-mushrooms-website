import "server-only";
import { adminDb } from "@/lib/firebase/admin";

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
};

function toProduct(id: string, data: FirebaseFirestore.DocumentData): Product {
  // Back-compat: older docs (seeded before multi-image support) only have
  // a single `imageUrl` string field rather than `imageUrls`.
  const imageUrls: string[] = Array.isArray(data.imageUrls)
    ? data.imageUrls
    : data.imageUrl
    ? [data.imageUrl]
    : [];

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
  };
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
