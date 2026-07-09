import "server-only";
import { FieldValue, type Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { sendOrderConfirmationEmail, sendShippedEmail, sendAdminOrderNotification } from "@/lib/email";

export type OrderItem = {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  name: string;
  priceCents: number;
  /** Snapshot of the item's per-unit weight at checkout, for buying a shipping label later. Absent on orders placed before this existed. */
  weightOz?: number;
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
  /** Set once a shipping label has been purchased for this order via the admin "Buy label" action. */
  labelUrl?: string;
  shippingLabelCostCents?: number;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  /** Set from Stripe's completed session when a promotion code was applied at payment. totalCents already reflects it. */
  discountCents?: number;
  /** When a "pending" order's stock reservation expires and can be released. Irrelevant once paid/fulfilled/cancelled. */
  expiresAt: Date | null;
  createdAt: Date | null;
};

/** How long a pending order holds its stock reservation before it's eligible for automatic release. */
const RESERVATION_TTL_MS = 30 * 60 * 1000;

export class InsufficientStockError extends Error {
  constructor(public readonly item: OrderItem, public readonly available: number) {
    super(`Only ${available} of "${item.name}" left in stock.`);
    this.name = "InsufficientStockError";
  }
}

function toOrder(id: string, data: FirebaseFirestore.DocumentData): Order {
  const createdAt = data.createdAt as Timestamp | undefined;
  const expiresAt = data.expiresAt as Timestamp | undefined;
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
    labelUrl: data.labelUrl,
    shippingLabelCostCents: data.shippingLabelCostCents,
    stripeCheckoutSessionId: data.stripeCheckoutSessionId,
    stripePaymentIntentId: data.stripePaymentIntentId,
    discountCents: data.discountCents,
    expiresAt: expiresAt ? expiresAt.toDate() : null,
    createdAt: createdAt ? createdAt.toDate() : null,
  };
}

type StockVariant = { id: string; label: string; priceCents: number; weightOz: number; stockQty: number };

/**
 * Reads each item's product doc (within the given transaction) and applies
 * `sign * item.qty` to its stock — variant-aware, matching the product's
 * `variants` array when the item has a `variantId`. Used for both reserving
 * stock (sign -1, validated so it never goes negative) and releasing it back
 * (sign +1, unvalidated). A missing product doc is silently skipped, same as
 * the historical decrement-on-payment behavior — it can't be reserved for or
 * released back to something that no longer exists.
 */
async function applyStockDelta(
  tx: FirebaseFirestore.Transaction,
  items: OrderItem[],
  sign: 1 | -1
): Promise<{ ok: true } | { ok: false; item: OrderItem; available: number }> {
  const productRefs = items.map((item) => adminDb.collection("products").doc(item.productId));
  const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

  if (sign === -1) {
    for (let i = 0; i < items.length; i++) {
      const snap = productSnaps[i];
      if (!snap.exists) continue;
      const item = items[i];
      const data = snap.data()!;
      const variants = data.variants as StockVariant[] | undefined;

      const available =
        item.variantId && Array.isArray(variants)
          ? variants.find((v) => v.id === item.variantId)?.stockQty ?? 0
          : ((data.stockQty as number) ?? 0);

      if (available < item.qty) {
        return { ok: false, item, available };
      }
    }
  }

  productSnaps.forEach((snap, i) => {
    if (!snap.exists) return;
    const item = items[i];
    const data = snap.data()!;
    const variants = data.variants as StockVariant[] | undefined;

    if (item.variantId && Array.isArray(variants)) {
      const updatedVariants = variants.map((v) =>
        v.id === item.variantId ? { ...v, stockQty: Math.max(v.stockQty + sign * item.qty, 0) } : v
      );
      tx.update(snap.ref, { variants: updatedVariants });
    } else {
      const currentStock = (data.stockQty as number) ?? 0;
      const newStock = Math.max(currentStock + sign * item.qty, 0);
      tx.update(snap.ref, { stockQty: newStock });
    }
  });

  return { ok: true };
}

/**
 * Creates a pending order and atomically reserves stock for its items in
 * the same transaction — closes the window where two concurrent checkouts
 * could both pass a "there's enough stock" check on the last unit(s) and
 * both complete payment. Throws InsufficientStockError (naming the item
 * that lost the race) if reservation fails; the order is not created.
 */
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
  const orderRef = adminDb.collection("orders").doc();

  await adminDb.runTransaction(async (tx) => {
    const result = await applyStockDelta(tx, input.items, -1);
    if (!result.ok) {
      throw new InsufficientStockError(result.item, result.available);
    }

    tx.set(orderRef, {
      ...input,
      status: "pending" satisfies OrderStatus,
      expiresAt: new Date(Date.now() + RESERVATION_TTL_MS),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  return orderRef.id;
}

/**
 * Marks an order paid. Stock was already reserved when the order was
 * created, so this only flips status — never decrements twice. Safe to
 * call more than once for the same order (Stripe may retry webhooks) —
 * a non-"pending" order is left untouched.
 */
export async function markOrderPaid(
  orderId: string,
  stripeIds: {
    stripeCheckoutSessionId: string;
    stripePaymentIntentId: string;
    /** Present when a promotion code was applied at Stripe's hosted checkout. */
    discountCents?: number;
    /** The amount Stripe actually charged, reconciled onto the order when a discount was applied. */
    totalCents?: number;
  }
): Promise<void> {
  const orderRef = adminDb.collection("orders").doc(orderId);

  const didTransition = await adminDb.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) {
      throw new Error(`Order ${orderId} not found`);
    }

    const order = orderSnap.data()!;
    if (order.status !== "pending") {
      return false;
    }

    tx.update(orderRef, {
      status: "paid" satisfies OrderStatus,
      stripeCheckoutSessionId: stripeIds.stripeCheckoutSessionId,
      stripePaymentIntentId: stripeIds.stripePaymentIntentId,
      ...(stripeIds.discountCents !== undefined ? { discountCents: stripeIds.discountCents } : {}),
      ...(stripeIds.totalCents !== undefined ? { totalCents: stripeIds.totalCents } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return true;
  });

  // Only send on the real pending -> paid transition, never on an
  // idempotent re-run of an already-paid order (Stripe may retry webhooks).
  // Never let an email failure bubble up into the webhook handler.
  if (didTransition) {
    const order = await getOrderById(orderId).catch(() => null);
    if (order) {
      try {
        await sendOrderConfirmationEmail(order);
      } catch (err) {
        console.error(`Failed to send order confirmation email for order ${orderId}:`, err);
      }
      try {
        await sendAdminOrderNotification(order);
      } catch (err) {
        console.error(`Failed to send admin order notification for order ${orderId}:`, err);
      }
    }
  }
}

/**
 * Releases a pending order's reserved stock and marks it cancelled. Safe to
 * call more than once / concurrently with itself or markOrderPaid — only a
 * still-"pending" order is touched, so a just-paid order's stock is never
 * released out from under it. Returns whether it actually cancelled anything.
 */
export async function cancelPendingOrder(orderId: string): Promise<boolean> {
  const orderRef = adminDb.collection("orders").doc(orderId);

  return adminDb.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) return false;

    const order = orderSnap.data()!;
    if (order.status !== "pending") return false;

    await applyStockDelta(tx, order.items as OrderItem[], 1);

    tx.update(orderRef, {
      status: "cancelled" satisfies OrderStatus,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return true;
  });
}

/**
 * Finds pending orders whose reservation window has passed and releases
 * their stock. Called opportunistically wherever stock availability is
 * about to be checked (so a stale reservation from someone else's abandoned
 * cart doesn't wrongly block a new one), and from a daily cron backstop for
 * products nobody else attempts to buy in the meantime. Returns how many
 * orders were released.
 */
export async function releaseExpiredPendingOrders(): Promise<number> {
  const snapshot = await adminDb
    .collection("orders")
    .where("status", "==", "pending")
    .where("expiresAt", "<=", new Date())
    .get();

  const results = await Promise.all(snapshot.docs.map((doc) => cancelPendingOrder(doc.id)));
  return results.filter(Boolean).length;
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
  const orderRef = adminDb.collection("orders").doc(orderId);

  // Cancelling a still-pending order must release its stock reservation —
  // otherwise that inventory would be locked away forever with no order to
  // account for it. Route through the same path the expiry sweep uses.
  if (update.status === "cancelled") {
    const snap = await orderRef.get();
    if (snap.exists && snap.data()!.status === "pending") {
      await cancelPendingOrder(orderId);
      if (update.trackingNumber !== undefined) {
        await orderRef.update({ trackingNumber: update.trackingNumber, updatedAt: FieldValue.serverTimestamp() });
      }
      return;
    }
  }

  // Detect a tracking number being set for the first time, before the
  // update overwrites it, so the "shipped" email only fires once.
  let shouldSendShippedEmail = false;
  if (update.trackingNumber?.trim()) {
    const snap = await orderRef.get();
    const existingTracking = snap.exists ? (snap.data()!.trackingNumber as string | undefined) : undefined;
    shouldSendShippedEmail = !existingTracking?.trim();
  }

  await orderRef.update({ ...update, updatedAt: FieldValue.serverTimestamp() });

  if (shouldSendShippedEmail) {
    try {
      const order = await getOrderById(orderId);
      if (order) {
        await sendShippedEmail(order);
      }
    } catch (err) {
      console.error(`Failed to send shipped email for order ${orderId}:`, err);
    }
  }
}

/**
 * Admin-only: records a purchased shipping label. Reuses updateOrderStatus
 * for the tracking-number-triggers-the-shipped-email logic (never fires
 * twice), then attaches the label URL/cost in a second write.
 */
export async function attachShippingLabel(
  orderId: string,
  label: { trackingNumber: string; labelUrl: string; costCents: number }
): Promise<void> {
  await updateOrderStatus(orderId, { trackingNumber: label.trackingNumber });
  await adminDb.collection("orders").doc(orderId).update({
    labelUrl: label.labelUrl,
    shippingLabelCostCents: label.costCents,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
