import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { saveAddress, clearSavedAddress } from "@/lib/users";
import type { ShippingAddress } from "@/lib/orders";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, street1, street2, city, state, zip } = (body ?? {}) as Partial<ShippingAddress>;
  if (!name?.trim() || !street1?.trim() || !city?.trim() || !state?.trim() || !zip?.trim()) {
    return NextResponse.json({ error: "A complete address is required." }, { status: 400 });
  }

  const address: ShippingAddress = {
    name: name.trim(),
    street1: street1.trim(),
    city: city.trim(),
    state: state.trim(),
    zip: zip.trim(),
    country: "US",
    ...(street2?.trim() ? { street2: street2.trim() } : {}),
  };

  await saveAddress(user.uid, address);

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }

  await clearSavedAddress(user.uid);

  return NextResponse.json({ ok: true });
}
