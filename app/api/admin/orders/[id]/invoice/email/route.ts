import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getOrderById } from "@/lib/orders";
import { sendLocalSaleInvoiceEmail } from "@/lib/email";

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
  if (!order.userEmail) {
    return NextResponse.json({ error: "This order has no email on file." }, { status: 400 });
  }

  try {
    await sendLocalSaleInvoiceEmail(order);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`Failed to send invoice email for order ${id}:`, err);
    return NextResponse.json({ error: "Could not send the invoice email." }, { status: 500 });
  }
}
