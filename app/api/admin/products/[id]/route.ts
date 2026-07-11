import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { notifyBackInStock } from "@/lib/stock-notify";
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

  const docRef = adminDb.collection("products").doc(id);
  const beforeSnap = await docRef.get();
  const before = beforeSnap.exists ? beforeSnap.data()! : null;

  // An empty variants array means "no variants" — clear the field rather
  // than writing an empty array, so getAllProducts' back-compat check
  // (`variants?.length > 0`) sees a genuinely non-variant product.
  const { variants, bulkTiers, preorderEstimate, ...rest } = product;
  const updateData = {
    ...rest,
    variants: variants.length > 0 ? variants : FieldValue.delete(),
    bulkTiers: bulkTiers.length > 0 ? bulkTiers : FieldValue.delete(),
    preorderEstimate: preorderEstimate ? preorderEstimate : FieldValue.delete(),
  };
  await docRef.update(updateData);

  // Anything that went from 0 stock to >0 stock in this edit should notify
  // its waiting list. Best-effort — a failure here must not fail the save.
  try {
    const restockedVariantIds: (string | undefined)[] = [];

    if (variants.length > 0) {
      const beforeVariants =
        (before?.variants as Array<{ id: string; stockQty: number }> | undefined) ?? [];
      for (const v of variants) {
        const prevStock = beforeVariants.find((bv) => bv.id === v.id)?.stockQty ?? 0;
        if (prevStock <= 0 && v.stockQty > 0) {
          restockedVariantIds.push(v.id);
        }
      }
    } else {
      const prevStock = (before?.stockQty as number) ?? 0;
      if (prevStock <= 0 && product.stockQty > 0) {
        restockedVariantIds.push(undefined);
      }
    }

    await Promise.all(restockedVariantIds.map((variantId) => notifyBackInStock(id, variantId, product.name)));
  } catch (err) {
    console.error(`Failed to send back-in-stock notifications for product ${id}:`, err);
  }

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
