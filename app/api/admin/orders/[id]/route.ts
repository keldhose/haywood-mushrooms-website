import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { updateOrderStatus, type OrderStatus } from "@/lib/orders";

const VALID_STATUSES: OrderStatus[] = ["pending", "paid", "fulfilled", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { status, trackingNumber } = (body ?? {}) as Record<string, unknown>;

  if (typeof status !== "string" || !VALID_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await updateOrderStatus(id, {
    status: status as OrderStatus,
    trackingNumber: typeof trackingNumber === "string" ? trackingNumber : undefined,
  });

  return NextResponse.json({ ok: true });
}
