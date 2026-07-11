import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { markReadyForPickup } from "@/lib/orders";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const { instructions } = (body ?? {}) as { instructions?: string };
  if (typeof instructions !== "string" || !instructions.trim()) {
    return NextResponse.json({ error: "Pickup instructions are required." }, { status: 400 });
  }

  try {
    await markReadyForPickup(id, instructions.trim());
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`Failed to mark order ${id} ready for pickup:`, err);
    return NextResponse.json({ error: "Could not update the order." }, { status: 500 });
  }
}
