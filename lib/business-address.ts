/**
 * The real pickup/ship-from address — shared by lib/shippo.ts (label
 * purchase) and anywhere a paying customer needs the exact pickup location
 * (order confirmation page/email). Not shown publicly anywhere on the site
 * before checkout — only the general area ("Cary, NC") is public; this
 * exact address is revealed only after payment, to actual customers.
 */
export const PICKUP_ADDRESS = {
  name: "Haywood Mushrooms",
  street1: "3121 Sentinel Ferry Ln",
  city: "Cary",
  state: "NC",
  zip: "27519",
  country: "US",
};
