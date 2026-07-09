import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getProductsByIds, getVariant } from "@/lib/products";
import { shippo } from "@/lib/shippo";
import { stripe } from "@/lib/stripe";
import { createPendingOrder, type OrderItem, type ShippingAddress } from "@/lib/orders";

type RequestItem = { productId: string; variantId?: string; qty: number };

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "Please log in to check out." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { items, address, rateId } = (body ?? {}) as {
    items?: RequestItem[];
    address?: ShippingAddress;
    rateId?: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!address?.name?.trim() || !address.street1?.trim() || !address.city?.trim() || !address.state?.trim() || !address.zip?.trim()) {
    return NextResponse.json({ error: "A complete shipping address is required." }, { status: 400 });
  }
  if (typeof rateId !== "string" || !rateId) {
    return NextResponse.json({ error: "Please select a shipping option." }, { status: 400 });
  }

  // Re-derive everything charge-relevant server-side — never trust
  // client-supplied prices, weights, or shipping amounts.
  const products = await getProductsByIds(items.map((i) => i.productId));
  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const product = products.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "One of the items in your cart is no longer available." }, { status: 400 });
    }
    const variant = getVariant(product, item.variantId);
    if (item.qty > variant.stockQty) {
      return NextResponse.json(
        { error: `Only ${variant.stockQty} of "${product.name}" left in stock.` },
        { status: 400 }
      );
    }
    orderItems.push({
      productId: product.id,
      variantId: variant.id || undefined,
      variantLabel: variant.label || undefined,
      name: product.name,
      priceCents: variant.priceCents,
      qty: item.qty,
    });
  }

  let shippingRate: { provider: string; service: string; amountCents: number; estimatedDays?: number };
  try {
    const rate = await shippo.rates.get(rateId);
    shippingRate = {
      provider: rate.provider,
      service: rate.servicelevel?.name ?? "Shipping",
      amountCents: Math.round(parseFloat(rate.amount) * 100),
      estimatedDays: rate.estimatedDays,
    };
  } catch (err) {
    console.error("Failed to re-verify shipping rate:", err);
    return NextResponse.json({ error: "That shipping option expired. Please recalculate shipping and try again." }, { status: 400 });
  }

  const subtotalCents = orderItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0);
  const shippingCents = shippingRate.amountCents;
  const totalCents = subtotalCents + shippingCents;

  const orderId = await createPendingOrder({
    userId: user.uid,
    userEmail: user.email,
    items: orderItems,
    subtotalCents,
    shippingCents,
    totalCents,
    shippingAddress: address,
    shippingRate,
  });

  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      client_reference_id: orderId,
      metadata: { orderId },
      allow_promotion_codes: true,
      line_items: [
        ...orderItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.variantLabel ? `${item.name} — ${item.variantLabel}` : item.name },
            unit_amount: item.priceCents,
          },
          quantity: item.qty,
        })),
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Shipping — ${shippingRate.provider} ${shippingRate.service}` },
            unit_amount: shippingCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/account/orders/${orderId}?success=true`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Failed to create Stripe Checkout session:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
