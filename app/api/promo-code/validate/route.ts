import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

/**
 * Checks whether a code is a live Stripe promotion code before the customer
 * reaches the hosted Checkout page — pure UX reassurance. Stripe itself
 * remains the only place the discount is actually validated and applied.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { code } = (body ?? {}) as { code?: string };
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ error: "Enter a code." }, { status: 400 });
  }

  try {
    const result = await stripe.promotionCodes.list({
      code: code.trim(),
      active: true,
      limit: 1,
      expand: ["data.promotion.coupon"],
    });
    const promo = result.data[0];
    if (!promo) {
      return NextResponse.json({ error: "That code isn't valid or has expired." }, { status: 404 });
    }

    const coupon = promo.promotion.coupon;
    const description =
      typeof coupon === "object" && coupon !== null
        ? coupon.percent_off
          ? `${coupon.percent_off}% off`
          : coupon.amount_off
          ? `$${(coupon.amount_off / 100).toFixed(2)} off`
          : "Discount"
        : "Discount";

    return NextResponse.json({ code: promo.code, description });
  } catch (err) {
    console.error("Failed to validate promotion code:", err);
    return NextResponse.json({ error: "Could not check that code right now." }, { status: 502 });
  }
}
