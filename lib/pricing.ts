/**
 * Quantity-break bulk pricing, shared between server code and client
 * components — deliberately has no "server-only" dependency so it's safe
 * to import directly from client components (AddToCart, cart display)
 * instead of duplicating this math.
 */
export type BulkTier = { minQty: number; discountPercent: number };

/** The best (highest-discount) tier a given quantity qualifies for, or undefined if none apply. */
export function bestBulkTier(tiers: BulkTier[] | undefined, qty: number): BulkTier | undefined {
  if (!tiers || tiers.length === 0) return undefined;
  return tiers
    .filter((t) => qty >= t.minQty)
    .sort((a, b) => b.discountPercent - a.discountPercent)[0];
}

/** Per-unit price after applying the best qualifying bulk tier, if any. */
export function applyBulkDiscount(basePriceCents: number, tiers: BulkTier[] | undefined, qty: number): number {
  const tier = bestBulkTier(tiers, qty);
  if (!tier) return basePriceCents;
  return Math.round(basePriceCents * (1 - tier.discountPercent / 100));
}
