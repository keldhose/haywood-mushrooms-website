import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { markOrderPaid } from "@/lib/orders";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Stripe webhook received without a signature or STRIPE_WEBHOOK_SECRET configured.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId ?? session.client_reference_id;

    if (!orderId) {
      console.error("checkout.session.completed had no orderId in metadata:", session.id);
      return NextResponse.json({ received: true });
    }

    const discountCents = session.total_details?.amount_discount ?? 0;

    try {
      await markOrderPaid(orderId, {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: (session.payment_intent as string) ?? "",
        discountCents: discountCents > 0 ? discountCents : undefined,
        totalCents: session.amount_total ?? undefined,
      });
    } catch (err) {
      console.error(`Failed to mark order ${orderId} paid:`, err);
      // Return 500 so Stripe retries this event rather than silently dropping it.
      return NextResponse.json({ error: "Failed to process order." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
