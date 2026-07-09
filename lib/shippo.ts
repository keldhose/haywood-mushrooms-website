import "server-only";
import { Shippo } from "shippo";

export const shippo = new Shippo({
  apiKeyHeader: process.env.SHIPPO_API_KEY!,
});

export const SHIP_FROM_ADDRESS = {
  name: "Haywood Mushrooms",
  street1: "3121 Sentinel Ferry Ln",
  city: "Cary",
  state: "NC",
  zip: "27519",
  country: "US",
  email: "info@haywoodmushrooms.com",
  phone: "984-284-0795",
};

// Estimated small-box dimensions for a grain spawn bag shipment. Not
// per-product yet — refine if/when product weights vary widely enough to
// need different box sizes.
export const DEFAULT_PARCEL = {
  massUnit: "lb" as const,
  distanceUnit: "in" as const,
  length: "10",
  width: "8",
  height: "6",
};

export type ShippingRateOption = {
  id: string;
  provider: string;
  service: string;
  amountCents: number;
  estimatedDays?: number;
};

/**
 * Narrows a full carrier rate list down to what we actually offer
 * customers at checkout: the cheapest option, plus the cheapest option
 * that arrives meaningfully faster (if any) — not every UPS/USPS service
 * tier Shippo returns (often 10+, including same-day/overnight), which is
 * overkill for a small grain-spawn shop. Admin fulfillment still sees the
 * full list, since it may need a substitute for a specific service.
 */
export function curateCustomerRates(rates: ShippingRateOption[]): ShippingRateOption[] {
  if (rates.length === 0) return [];

  const sorted = [...rates].sort((a, b) => a.amountCents - b.amountCents);
  const cheapest = sorted[0];

  const faster = sorted
    .filter(
      (r) =>
        r.id !== cheapest.id &&
        r.estimatedDays !== undefined &&
        (cheapest.estimatedDays === undefined || r.estimatedDays < cheapest.estimatedDays)
    )
    .sort((a, b) => a.amountCents - b.amountCents)[0];

  return faster ? [cheapest, faster] : [cheapest];
}
