import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { validateProductPayload } from "../route";

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

  const product = validateProductPayload(body);
  if (!product) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  // An empty variants array means "no variants" — clear the field rather
  // than writing an empty array, so getAllProducts' back-compat check
  // (`variants?.length > 0`) sees a genuinely non-variant product.
  const { variants, ...rest } = product;
  const updateData = variants.length > 0 ? { ...rest, variants } : { ...rest, variants: FieldValue.delete() };
  await adminDb.collection("products").doc(id).update(updateData);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await adminDb.collection("products").doc(id).delete();

  return NextResponse.json({ ok: true });
}
