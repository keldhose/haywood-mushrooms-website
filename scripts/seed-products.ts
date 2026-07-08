/**
 * One-time / repeatable seed script for the Firestore `products` collection.
 * Run with: npm run db:seed
 *
 * Safe to re-run — it upserts by slug (doc ID), so editing a value here and
 * re-running updates the existing product rather than duplicating it.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

type SeedProduct = {
  slug: string;
  name: string;
  scientificName: string;
  description: string;
  priceCents: number;
  stockQty: number;
  weightOz: number;
  imageUrls: string[];
  active: boolean;
};

const products: SeedProduct[] = [
  {
    slug: "pink-oyster-grain-spawn-3lb",
    name: "Premium Pink Oyster Mushroom Grain Spawn (Fully Colonized) — 3 lb Bag",
    scientificName: "Pleurotus djamor",
    description:
      "A fully colonized 3 lb inoculum bag of our Pink Oyster grain spawn — ready to inoculate your bulk substrate. Fast-growing tropical strain known for vivid coral fruiting bodies.",
    priceCents: 2900,
    stockQty: 5,
    weightOz: 48,
    imageUrls: ["/pink-oyster.png"],
    active: true,
  },
  {
    slug: "pink-oyster-grain-spawn-1lb",
    name: "Premium Pink Oyster Mushroom Grain Spawn — 1 lb Bag, Fast Colonizing",
    scientificName: "Pleurotus djamor",
    description:
      "A 1 lb bag of our fast-colonizing Pink Oyster grain spawn — a great starting size for smaller grows or expanding to additional substrate.",
    priceCents: 999,
    stockQty: 5,
    weightOz: 16,
    imageUrls: ["/pink-oyster.png"],
    active: true,
  },
  {
    slug: "blue-oyster-grain-spawn-3lb",
    name: "Premium Blue Oyster Mushroom Colonized Grain Spawn — 3 lb Bag",
    scientificName: "Pleurotus ostreatus var.",
    description:
      "A fully colonized 3 lb bag of our Blue Oyster grain spawn. A cool-weather strain with steel-blue young caps, firm texture, and clean flavor.",
    priceCents: 2900,
    stockQty: 5,
    weightOz: 48,
    imageUrls: ["/oyster-grow-bag.jpg"],
    active: true,
  },
];

async function seed() {
  const { adminDb } = await import("./firebase-admin");
  const batch = adminDb.batch();

  for (const { slug, ...data } of products) {
    const ref = adminDb.collection("products").doc(slug);
    batch.set(ref, data, { merge: true });
  }

  await batch.commit();
  console.log(`Seeded ${products.length} products.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
