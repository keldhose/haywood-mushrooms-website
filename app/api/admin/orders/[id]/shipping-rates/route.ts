import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getOrderById } from "@/lib/orders";
import { shippo, SHIP_FROM_ADDRESS, DEFAULT_PARCEL } from "@/lib/shippo";

/**
 * Quotes fresh shipping rates for an existing order at fulfillment time —
 * the rate the customer paid for at checkout may be days old and no longer
 * purchasable, so buying a label always re-quotes rather than reusing it.
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { weightOz } = (body ?? {}) as { weightOz?: number };
  if (typeof weightOz !== "number" || !Number.isFinite(weightOz) || weightOz <= 0) {
    return NextResponse.json({ error: "Enter a valid package weight." }, { status: 400 });
  }

  const totalWeightLb = Math.max(weightOz / 16, 0.1).toFixed(2);
  const addr = order.shippingAddress;

  try {
    const shipment = await shippo.shipments.create({
      addressFrom: SHIP_FROM_ADDRESS,
      addressTo: {
        name: addr.name,
        street1: addr.street1,
        street2: addr.street2,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: "US",
      },
      parcels: [{ ...DEFAULT_PARCEL, weight: totalWeightLb }],
      async: false,
    });

    const rates = (shipment.rates ?? [])
      .map((rate) => ({
        id: rate.objectId,
        provider: rate.provider,
        service: rate.servicelevel?.name ?? "Shipping",
        amountCents: Math.round(parseFloat(rate.amount) * 100),
        estimatedDays: rate.estimatedDays,
      }))
      .filter((rate) => Number.isFinite(rate.amountCents))
      .sort((a, b) => a.amountCents - b.amountCents);

    if (rates.length === 0) {
      return NextResponse.json({ error: "No shipping rates available for this address." }, { status: 422 });
    }

    return NextResponse.json({ rates, shipmentId: shipment.objectId });
  } catch (err) {
    console.error(`Shippo rate lookup failed for order ${id}:`, err);
    return NextResponse.json({ error: "Could not calculate shipping rates. Please try again." }, { status: 502 });
  }
}
