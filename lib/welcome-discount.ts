import "server-only";
import { randomInt } from "crypto";
import { stripe } from "@/lib/stripe";

const WELCOME_PERCENT_OFF = 10;
const EXPIRES_IN_DAYS = 30;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — avoids look-alike mix-ups

function randomSuffix(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_CHARS[randomInt(CODE_CHARS.length)];
  }
  return out;
}

/**
 * Creates a real, single-use Stripe promotion code for a newsletter
 * signup — a fresh coupon + promotion code per person (not one shared
 * code), so it can't be leaked and reused indefinitely. Retries once on
 * the rare code collision (max_redemptions/uniqueness is enforced by
 * Stripe, not checked locally).
 */
export async function createWelcomeDiscountCode(): Promise<string> {
  const coupon = await stripe.coupons.create({
    percent_off: WELCOME_PERCENT_OFF,
    duration: "once",
    name: "Welcome — 10% off",
  });

  const expiresAt = Math.floor(Date.now() / 1000) + EXPIRES_IN_DAYS * 24 * 60 * 60;

  for (let attempt = 0; attempt < 3; attempt++) {
    const code = `WELCOME-${randomSuffix(6)}`;
    try {
      const promo = await stripe.promotionCodes.create({
        promotion: { type: "coupon", coupon: coupon.id },
        code,
        max_redemptions: 1,
        expires_at: expiresAt,
      });
      return promo.code;
    } catch (err) {
      // A duplicate code is the only expected failure here — retry with a
      // fresh random suffix. Anything else should bubble up.
      const isDuplicate = err instanceof Error && /already exists|resource_already_exists/i.test(err.message);
      if (!isDuplicate || attempt === 2) {
        throw err;
      }
    }
  }

  throw new Error("Could not generate a unique welcome code.");
}
