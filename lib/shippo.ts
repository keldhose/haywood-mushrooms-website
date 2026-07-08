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
