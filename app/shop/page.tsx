import Image from "next/image";
import Link from "next/link";
import { getAllProducts, type Product } from "@/lib/products";
import AddToCart from "../components/shop/AddToCart";

export const metadata = {
  title: "Shop | Haywood Mushrooms",
  description: "Order premium mushroom grain spawn directly from Haywood Mushrooms.",
};

// Firestore reads via the Admin SDK aren't tracked by Next's fetch cache, so
// without this the page would be baked statically at build time and never
// reflect stock/price changes made later. Revalidate periodically instead.
export const revalidate = 60;

/** True if any purchasable option on this product currently has real stock. */
function hasInStockOption(product: Product): boolean {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some((v) => v.stockQty > 0);
  }
  return product.stockQty > 0;
}

/** True if "Active for made to order" is checked and at least one option is at 0 stock with an MTO price set. */
function hasMadeToOrderOption(product: Product): boolean {
  if (!product.preorderActive) return false;
  if (product.variants && product.variants.length > 0) {
    return product.variants.some((v) => v.stockQty <= 0 && v.preorderPriceCents != null);
  }
  return product.stockQty <= 0 && product.preorderPriceCents != null;
}

/** True once every option is at 0 stock and the only way to buy it is made-to-order — belongs in that section exclusively. */
function isMadeToOrderOnly(product: Product): boolean {
  return !hasInStockOption(product) && hasMadeToOrderOption(product);
}

function ProductCard({ product }: { product: Product }) {
  const soldOut = !hasInStockOption(product);
  const madeToOrder = hasMadeToOrderOption(product);

  return (
    <div className="flex flex-col overflow-hidden rounded-[3px] border border-line bg-paper">
      <Link href={`/shop/${product.id}`} className="relative block h-[240px] overflow-hidden bg-[#1a1512]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        {madeToOrder ? (
          <span className="absolute left-4 top-4 rounded-[2px] bg-brass px-[11px] py-[6px] font-mono text-[10px] uppercase tracking-[0.16em] text-forest-deep">
            Made to order
          </span>
        ) : (
          soldOut && (
            <span className="absolute left-4 top-4 rounded-[2px] border border-red-300 bg-red-50/95 px-[11px] py-[6px] font-mono text-[10px] uppercase tracking-[0.16em] text-red-700">
              Sold out
            </span>
          )
        )}
      </Link>

      <div className="flex flex-1 flex-col p-[26px] pb-7">
        <Link href={`/shop/${product.id}`}>
          <div className="font-serif text-[22px] leading-[1.2] text-ink">{product.name}</div>
        </Link>
        <div className="mt-[5px] font-mono text-[12px] tracking-[0.02em] text-brass">{product.scientificName}</div>
        <p className="mt-4 flex-1 text-[14.5px] leading-[1.5] text-muted">{product.description}</p>

        <div className="mt-5">
          <AddToCart product={product} compact />
        </div>
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const products = await getAllProducts();
  // A product with a mix of in-stock and made-to-order-eligible options
  // appears in both sections; one that's exclusively made-to-order (every
  // option at 0 stock) appears only in that section, not "In stock" too.
  const inStockProducts = products.filter((p) => !isMadeToOrderOnly(p));
  const preorderProducts = products.filter((p) => hasMadeToOrderOption(p));

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
            Fully colonized grain spawn, ready to inoculate your own bulk substrate. Small-batch, ready to ship.
          </p>
        </div>
      </header>

      <section className="px-6 pb-[76px] md:px-10 md:pb-[120px]">
        <div className="mx-auto max-w-[1200px]">
          {products.length === 0 ? (
            <p className="text-muted">No products are available right now — check back soon.</p>
          ) : (
            <>
              {inStockProducts.length > 0 && (
                <div>
                  {preorderProducts.length > 0 && (
                    <h2 className="font-serif text-[24px] text-ink">In stock</h2>
                  )}
                  <div className={`grid grid-cols-1 gap-7 md:grid-cols-3 ${preorderProducts.length > 0 ? "mt-6" : ""}`}>
                    {inStockProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {preorderProducts.length > 0 && (
                <div className={inStockProducts.length > 0 ? "mt-16" : ""}>
                  <h2 className="font-serif text-[24px] text-ink">Made to order</h2>
                  <p className="mt-1.5 max-w-[34em] text-[14.5px] text-muted">
                    Made to order — we start growing once you order. See each listing for the expected ship window.
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-3">
                    {preorderProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
