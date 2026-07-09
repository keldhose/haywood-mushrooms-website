import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/products";

/** Public — mirrors the data already visible on /shop, just batched by id for reorder. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  const ids = (idsParam ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ error: "Missing ids." }, { status: 400 });
  }

  const productMap = await getProductsByIds(ids);

  return NextResponse.json({ products: Object.fromEntries(productMap) });
}
