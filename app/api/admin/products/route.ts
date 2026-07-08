import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function validateProductPayload(body: unknown) {
  const { name, scientificName, description, priceCents, stockQty, weightOz, imageUrls, active } = (body ?? {}) as Record<
    string,
    unknown
  >;

  const cleanImageUrls = Array.isArray(imageUrls)
    ? imageUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0).map((u) => u.trim())
    : [];

  if (
    typeof name !== "string" || !name.trim() ||
    typeof scientificName !== "string" || !scientificName.trim() ||
    typeof description !== "string" || !description.trim() ||
    cleanImageUrls.length === 0 ||
    typeof priceCents !== "number" || !Number.isFinite(priceCents) || priceCents < 0 ||
    typeof stockQty !== "number" || !Number.isFinite(stockQty) || stockQty < 0 ||
    typeof weightOz !== "number" || !Number.isFinite(weightOz) || weightOz <= 0
  ) {
    return null;
  }

  return {
    name: name.trim(),
    scientificName: scientificName.trim(),
    description: description.trim(),
    priceCents: Math.round(priceCents),
    stockQty: Math.round(stockQty),
    weightOz,
    imageUrls: cleanImageUrls,
    active: active !== false,
  };
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

  const baseSlug = slugify(product.name);
  let slug = baseSlug;
  let suffix = 1;
  while ((await adminDb.collection("products").doc(slug).get()).exists) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  await adminDb.collection("products").doc(slug).set(product);

  return NextResponse.json({ id: slug });
}
