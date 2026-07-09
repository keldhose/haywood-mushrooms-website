import { NextResponse } from "next/server";
import { releaseExpiredPendingOrders } from "@/lib/orders";

/**
 * Backstop for abandoned-cart stock reservations. The primary release path
 * is opportunistic — it runs whenever anyone checks shipping rates or
 * checks out (see app/api/cart/shipping-rates and app/api/checkout) — so
 * this only matters for products nobody else attempts to buy in the
 * meantime. Vercel's Hobby plan only supports daily cron schedules; see
 * vercel.json.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const released = await releaseExpiredPendingOrders();
    return NextResponse.json({ released });
  } catch (err) {
    console.error("Failed to release expired pending orders:", err);
    return NextResponse.json({ error: "Failed to release expired pending orders." }, { status: 500 });
  }
}
