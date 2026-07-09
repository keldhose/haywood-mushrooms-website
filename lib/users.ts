import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { ShippingAddress } from "@/lib/orders";

/** Returns a signed-in user's saved shipping address, if they have one. */
export async function getSavedAddress(uid: string): Promise<ShippingAddress | null> {
  const doc = await adminDb.collection("users").doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  return (doc.data()!.shippingAddress as ShippingAddress | undefined) ?? null;
}

/** Saves/overwrites a user's default shipping address for next time. */
export async function saveAddress(uid: string, address: ShippingAddress): Promise<void> {
  await adminDb
    .collection("users")
    .doc(uid)
    // mergeFields (not plain `merge: true`) so shippingAddress is replaced
    // wholesale — `merge: true` deep-merges nested map fields, which would
    // leave a stale street2 behind if a later save omits it.
    .set(
      { shippingAddress: address, updatedAt: FieldValue.serverTimestamp() },
      { mergeFields: ["shippingAddress", "updatedAt"] }
    );
}

/** Clears a user's saved shipping address. */
export async function clearSavedAddress(uid: string): Promise<void> {
  await adminDb
    .collection("users")
    .doc(uid)
    .set({ shippingAddress: FieldValue.delete(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}
