import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import type { ProductVariant } from "@/lib/products";
import type { BulkTier } from "@/lib/pricing";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function validateVariants(input: unknown): ProductVariant[] | null {
  if (!Array.isArray(input)) return [];

  const clean: ProductVariant[] = [];
  for (const raw of input) {
    const v = (raw ?? {}) as Record<string, unknown>;
    if (
      typeof v.id !== "string" || !v.id.trim() ||
      typeof v.label !== "string" || !v.label.trim() ||
      typeof v.priceCents !== "number" || !Number.isFinite(v.priceCents) || v.priceCents < 0 ||
      typeof v.stockQty !== "number" || !Number.isFinite(v.stockQty) || v.stockQty < 0 ||
      typeof v.weightOz !== "number" || !Number.isFinite(v.weightOz) || v.weightOz <= 0
    ) {
      return null;
    }
    clean.push({
      id: v.id.trim(),
      label: v.label.trim(),
      priceCents: Math.round(v.priceCents),
      stockQty: Math.round(v.stockQty),
      weightOz: v.weightOz,
    });
  }
  return clean;
}

function validateBulkTiers(input: unknown): BulkTier[] | null {
  if (!Array.isArray(input)) return [];

  const clean: BulkTier[] = [];
  for (const raw of input) {
    const t = (raw ?? {}) as Record<string, unknown>;
    if (
      typeof t.minQty !== "number" || !Number.isFinite(t.minQty) || t.minQty < 2 || !Number.isInteger(t.minQty) ||
      typeof t.discountPercent !== "number" || !Number.isFinite(t.discountPercent) || t.discountPercent <= 0 || t.discountPercent >= 100
    ) {
      return null;
    }
    clean.push({ minQty: t.minQty, discountPercent: t.discountPercent });
  }
  return clean.sort((a, b) => a.minQty - b.minQty);
}

export function validateProductPayload(body: unknown) {
  const {
    name,
    scientificName,
    description,
    priceCents,
    stockQty,
    weightOz,
    imageUrls,
    active,
    variants,
    bulkTiers,
    isPreorder,
    preorderEstimate,
  } = (body ?? {}) as Record<string, unknown>;

  const cleanImageUrls = Array.isArray(imageUrls)
    ? imageUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0).map((u) => u.trim())
    : [];

  const cleanVariants = validateVariants(variants);
  const cleanBulkTiers = validateBulkTiers(bulkTiers);
  // Base price/stock/weight are only meaningful — and required — for a
  // product with no variants. A variant product is priced/stocked/weighed
  // per variant; the base fields are unused everywhere they'd be read.
  const hasVariants = cleanVariants !== null && cleanVariants.length > 0;

  const baseNumbersValid = hasVariants
    ? true
    : typeof priceCents === "number" && Number.isFinite(priceCents) && priceCents >= 0 &&
      typeof stockQty === "number" && Number.isFinite(stockQty) && stockQty >= 0 &&
      typeof weightOz === "number" && Number.isFinite(weightOz) && weightOz > 0;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof scientificName !== "string" || !scientificName.trim() ||
    typeof description !== "string" || !description.trim() ||
    cleanImageUrls.length === 0 ||
    cleanVariants === null ||
    cleanBulkTiers === null ||
    !baseNumbersValid
  ) {
    return null;
  }

  return {
    name: name.trim(),
    scientificName: scientificName.trim(),
    description: description.trim(),
    bulkTiers: cleanBulkTiers,
    priceCents: hasVariants ? 0 : Math.round(priceCents as number),
    stockQty: hasVariants ? 0 : Math.round(stockQty as number),
    weightOz: hasVariants ? 0 : (weightOz as number),
    imageUrls: cleanImageUrls,
    active: active !== false,
    variants: cleanVariants,
    isPreorder: isPreorder === true,
    preorderEstimate: typeof preorderEstimate === "string" ? preorderEstimate.trim() : "",
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

  const { variants, bulkTiers, preorderEstimate, ...rest } = product;
  const docData = {
    ...rest,
    ...(variants.length > 0 ? { variants } : {}),
    ...(bulkTiers.length > 0 ? { bulkTiers } : {}),
    ...(preorderEstimate ? { preorderEstimate } : {}),
  };
  await adminDb.collection("products").doc(slug).set(docData);

  return NextResponse.json({ id: slug });
}
