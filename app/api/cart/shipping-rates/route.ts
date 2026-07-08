import { NextResponse } from "next/server";
import { shippo, SHIP_FROM_ADDRESS, DEFAULT_PARCEL } from "@/lib/shippo";
import { getProductsByIds } from "@/lib/products";

type RequestItem = { productId: string; qty: number };
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

  const products = await getProductsByIds(items.map((i) => i.productId));

  let totalWeightOz = 0;
  for (const item of items) {
    const product = products.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "One of the items in your cart is no longer available." }, { status: 400 });
    }
    if (item.qty > product.stockQty) {
      return NextResponse.json(
        { error: `Only ${product.stockQty} of "${product.name}" left in stock.` },
        { status: 400 }
      );
    }
    totalWeightOz += product.weightOz * item.qty;
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
      return NextResponse.json(
        { error: "No shipping rates available for that address. Please double-check it and try again." },
        { status: 422 }
      );
    }

    return NextResponse.json({ rates });
  } catch (err) {
    console.error("Shippo rate lookup failed:", err);
    return NextResponse.json({ error: "Could not calculate shipping. Please check your address and try again." }, { status: 502 });
  }
}
