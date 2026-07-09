import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getOrderById, attachShippingLabel } from "@/lib/orders";
import { shippo } from "@/lib/shippo";

/**
 * Purchases a real shipping label via Shippo for a freshly-quoted rate
 * (from POST .../shipping-rates) and attaches the resulting tracking
 * number + label URL to the order. This spends real money against the
 * Shippo account balance, so it's a deliberate, explicit admin action —
 * never automatic.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.trackingNumber?.trim()) {
    return NextResponse.json({ error: "This order already has a tracking number." }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { rateId, amountCents } = (body ?? {}) as { rateId?: string; amountCents?: number };
  if (typeof rateId !== "string" || !rateId) {
    return NextResponse.json({ error: "Please select a shipping rate." }, { status: 400 });
  }
  if (typeof amountCents !== "number" || !Number.isFinite(amountCents) || amountCents < 0) {
    return NextResponse.json({ error: "Missing rate amount." }, { status: 400 });
  }

  try {
    const transaction = await shippo.transactions.create({
      rate: rateId,
      async: false,
      labelFileType: "PDF",
    });

    if (transaction.status !== "SUCCESS" || !transaction.trackingNumber || !transaction.labelUrl) {
      const detail = transaction.messages?.map((m) => m.text).join(" ") || "Label purchase failed.";
      console.error(`Shippo label purchase failed for order ${id}:`, detail);
      return NextResponse.json({ error: detail }, { status: 502 });
    }

    await attachShippingLabel(id, {
      trackingNumber: transaction.trackingNumber,
      labelUrl: transaction.labelUrl,
      costCents: amountCents,
    });

    return NextResponse.json({ trackingNumber: transaction.trackingNumber, labelUrl: transaction.labelUrl });
  } catch (err) {
    console.error(`Failed to purchase shipping label for order ${id}:`, err);
    return NextResponse.json({ error: "Could not purchase the shipping label. Please try again." }, { status: 502 });
  }
}
