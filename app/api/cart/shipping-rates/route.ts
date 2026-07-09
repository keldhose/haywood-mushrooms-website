import { NextResponse } from "next/server";
import { shippo, SHIP_FROM_ADDRESS, DEFAULT_PARCEL, curateCustomerRates } from "@/lib/shippo";
import { getProductsByIds, getVariant } from "@/lib/products";
import { releaseExpiredPendingOrders } from "@/lib/orders";

type RequestItem = { productId: string; variantId?: string; qty: number };
type RequestAddress = {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { items, address } = (body ?? {}) as { items?: RequestItem[]; address?: RequestAddress };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  if (
    !address ||
    !address.name?.trim() ||
    !address.street1?.trim() ||
    !address.city?.trim() ||
    !address.state?.trim() ||
    !address.zip?.trim()
  ) {
    return NextResponse.json({ error: "A complete shipping address is required." }, { status: 400 });
  }

  // Free any stale reservations from abandoned checkouts before checking
  // availability — best-effort, never blocks this request on its own.
  try {
    await releaseExpiredPendingOrders();
  } catch (err) {
    console.error("Failed to release expired pending orders:", err);
  }

  const products = await getProductsByIds(items.map((i) => i.productId));

  let totalWeightOz = 0;
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
    totalWeightOz += variant.weightOz * item.qty;
  }

  const totalWeightLb = Math.max(totalWeightOz / 16, 0.1).toFixed(2);

  try {
    const shipment = await shippo.shipments.create({
      addressFrom: SHIP_FROM_ADDRESS,
      addressTo: {
        name: address.name,
        street1: address.street1,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: "US",
      },
      parcels: [{ ...DEFAULT_PARCEL, weight: totalWeightLb }],
      async: false,
    });

    const allRates = (shipment.rates ?? [])
      .map((rate) => ({
        id: rate.objectId,
        provider: rate.provider,
        service: rate.servicelevel?.name ?? "Shipping",
        amountCents: Math.round(parseFloat(rate.amount) * 100),
        estimatedDays: rate.estimatedDays,
      }))
      .filter((rate) => Number.isFinite(rate.amountCents));

    // Customers see a curated pick (cheapest + one meaningfully faster
    // option), not every service tier a carrier offers.
    const rates = curateCustomerRates(allRates);

    if (rates.length === 0) {
      return NextResponse.json(
        { error: "No shipping rates available for that address. Please double-check it and try again." },
        { status: 422 }
      );
    }

    // Threaded through to checkout so it can confirm the chosen rate actually
    // belongs to the shipment just quoted, rather than trusting any rateId.
    return NextResponse.json({ rates, shipmentId: shipment.objectId });
  } catch (err) {
    console.error("Shippo rate lookup failed:", err);
    return NextResponse.json({ error: "Could not calculate shipping. Please check your address and try again." }, { status: 502 });
  }
}
