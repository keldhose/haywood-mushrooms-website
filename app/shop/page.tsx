import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import AddToCart from "../components/shop/AddToCart";

export const metadata = {
  title: "Shop | Haywood Mushrooms",
  description: "Order premium mushroom grain spawn directly from Haywood Mushrooms.",
};

// Firestore reads via the Admin SDK aren't tracked by Next's fetch cache, so
// without this the page would be baked statically at build time and never
// reflect stock/price changes made later. Revalidate periodically instead.
export const revalidate = 60;

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <main>
      <header className="px-6 pb-14 pt-24 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Haywood Mushrooms / Shop
          </div>
          <h1 className="mt-[22px] max-w-[18em] text-[clamp(40px,5.4vw,74px)] leading-[1.05] tracking-[-0.025em]">
            Order spawn <em className="font-serif italic text-forest">directly</em> from the lab.
          </h1>
          <p className="mt-[26px] max-w-[34em] text-[20px] leading-[1.55] text-muted">
            Fully colonized grain spawn, ready to inoculate your own bulk substrate. Small-batch, made to order.
          </p>
        </div>
      </header>

      <section className="px-6 pb-[76px] md:px-10 md:pb-[120px]">
        <div className="mx-auto max-w-[1200px]">
          {products.length === 0 ? (
            <p className="text-muted">No products are available right now — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-[3px] border border-line bg-paper"
                >
                  <Link href={`/shop/${product.id}`} className="relative block h-[240px] overflow-hidden bg-[#1a1512]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-[26px] pb-7">
                    <Link href={`/shop/${product.id}`}>
                      <div className="font-serif text-[22px] leading-[1.2] text-ink">{product.name}</div>
                    </Link>
                    <div className="mt-[5px] font-mono text-[12px] tracking-[0.02em] text-brass">
                      {product.scientificName}
                    </div>
                    <p className="mt-4 flex-1 text-[14.5px] leading-[1.5] text-muted">{product.description}</p>

                    <div className="mt-5 font-serif text-[24px] text-ink">
                      {product.variants && product.variants.length > 0
                        ? `From $${(Math.min(...product.variants.map((v) => v.priceCents)) / 100).toFixed(2)}`
                        : `$${(product.priceCents / 100).toFixed(2)}`}
                    </div>

                    <AddToCart product={product} compact />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
