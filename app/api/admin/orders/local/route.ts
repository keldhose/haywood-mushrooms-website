import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getProductsByIds, getVariant } from "@/lib/products";
import { createLocalOrder, InsufficientStockError, type OrderItem } from "@/lib/orders";

type RequestItem = { productId: string; variantId?: string; qty: number };

const PAYMENT_METHODS = ["Cash", "Venmo", "PayPal", "Zelle", "Other"];

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { buyerName, buyerEmail, paymentMethod, items } = (body ?? {}) as {
    buyerName?: string;
    buyerEmail?: string;
    paymentMethod?: string;
    items?: RequestItem[];
  };

  if (!buyerName?.trim()) {
    return NextResponse.json({ error: "Buyer name is required." }, { status: 400 });
  }
  if (typeof paymentMethod !== "string" || !PAYMENT_METHODS.includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
  }
  if (buyerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Add at least one item." }, { status: 400 });
  }
  if (items.some((i) => !Number.isInteger(i.qty) || i.qty <= 0)) {
    return NextResponse.json({ error: "Item quantities must be positive whole numbers." }, { status: 400 });
  }

  // Re-derive everything charge-relevant server-side — never trust
  // client-supplied prices, matching the same pattern the customer checkout uses.
  const products = await getProductsByIds(items.map((i) => i.productId));
  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const product = products.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "One of the selected products is no longer available." }, { status: 400 });
    }
    const variant = getVariant(product, item.variantId);
    orderItems.push({
      productId: product.id,
      variantId: variant.id || undefined,
      variantLabel: variant.label || undefined,
      name: product.name,
      priceCents: variant.priceCents,
      weightOz: variant.weightOz,
      qty: item.qty,
    });
  }

  const subtotalCents = orderItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);

  try {
    const orderId = await createLocalOrder({
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail?.trim() || undefined,
      items: orderItems,
      subtotalCents,
      paymentMethod,
    });
    return NextResponse.json({ orderId });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Failed to record local sale:", err);
    return NextResponse.json({ error: "Could not record the sale. Please try again." }, { status: 500 });
  }
}
