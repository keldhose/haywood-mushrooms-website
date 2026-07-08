import "server-only";
import { FieldValue, type Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

export type OrderItem = {
  productId: string;
  name: string;
  priceCents: number;
  qty: number;
};

export type ShippingAddress = {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type ShippingRate = {
  provider: string;
  service: string;
  amountCents: number;
  estimatedDays?: number;
};

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingAddress: ShippingAddress;
  shippingRate: ShippingRate;
  status: OrderStatus;
  trackingNumber?: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date | null;
};

function toOrder(id: string, data: FirebaseFirestore.DocumentData): Order {
  const createdAt = data.createdAt as Timestamp | undefined;
  return {
    id,
    userId: data.userId,
    userEmail: data.userEmail,
    items: data.items,
    subtotalCents: data.subtotalCents,
    shippingCents: data.shippingCents,
    totalCents: data.totalCents,
    shippingAddress: data.shippingAddress,
    shippingRate: data.shippingRate,
    status: data.status,
    trackingNumber: data.trackingNumber,
    stripeCheckoutSessionId: data.stripeCheckoutSessionId,
    stripePaymentIntentId: data.stripePaymentIntentId,
    createdAt: createdAt ? createdAt.toDate() : null,
  };
}

export async function createPendingOrder(input: {
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingAddress: ShippingAddress;
  shippingRate: ShippingRate;
}): Promise<string> {
  const ref = await adminDb.collection("orders").add({
    ...input,
    status: "pending" satisfies OrderStatus,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

/**
 * Marks an order paid and decrements product stock, atomically. Safe to
 * call more than once for the same order (Stripe may retry webhooks) —
 * a non-"pending" order is left untouched.
 */
export async function markOrderPaid(
  orderId: string,
  stripeIds: { stripeCheckoutSessionId: string; stripePaymentIntentId: string }
): Promise<void> {
  const orderRef = adminDb.collection("orders").doc(orderId);

  await adminDb.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) {
      throw new Error(`Order ${orderId} not found`);
    }

    const order = orderSnap.data()!;
    if (order.status !== "pending") {
      return;
    }

    const items = order.items as OrderItem[];
    const productRefs = items.map((item) => adminDb.collection("products").doc(item.productId));
    const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

    productSnaps.forEach((snap, i) => {
      if (!snap.exists) return;
      const currentStock = (snap.data()!.stockQty as number) ?? 0;
      const newStock = Math.max(currentStock - items[i].qty, 0);
      tx.update(snap.ref, { stockQty: newStock });
    });

    tx.update(orderRef, {
      status: "paid" satisfies OrderStatus,
      ...stripeIds,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const snapshot = await adminDb.collection("orders").where("userId", "==", userId).get();
  return snapshot.docs
    .map((doc) => toOrder(doc.id, doc.data()))
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const doc = await adminDb.collection("orders").doc(orderId).get();
  if (!doc.exists) {
    return null;
  }
  return toOrder(doc.id, doc.data()!);
}

/** Admin-only: every order across all customers. */
export async function getAllOrders(): Promise<Order[]> {
  const snapshot = await adminDb.collection("orders").get();
  return snapshot.docs
    .map((doc) => toOrder(doc.id, doc.data()))
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

/** Admin-only: update fulfillment status and/or tracking number. */
export async function updateOrderStatus(
  orderId: string,
  update: { status?: OrderStatus; trackingNumber?: string }
): Promise<void> {
  await adminDb
    .collection("orders")
    .doc(orderId)
    .update({ ...update, updatedAt: FieldValue.serverTimestamp() });
}
