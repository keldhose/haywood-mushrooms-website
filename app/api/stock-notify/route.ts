import { NextResponse } from "next/server";
import { recordStockNotification } from "@/lib/stock-notify";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { productId, variantId, email } = (body ?? {}) as {
    productId?: string;
    variantId?: string;
    email?: string;
  };

  if (typeof productId !== "string" || !productId.trim()) {
    return NextResponse.json({ error: "Missing product." }, { status: 400 });
  }
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  try {
    await recordStockNotification(
      productId.trim(),
      typeof variantId === "string" && variantId.trim() ? variantId.trim() : undefined,
      email.trim()
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to record stock notification:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
