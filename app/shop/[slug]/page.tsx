import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import AddToCart from "../../components/shop/AddToCart";
import ProductGallery from "../../components/shop/ProductGallery";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | Haywood Mushrooms`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Link href="/shop" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-forest">
          ← Shop
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-11 md:grid-cols-2 md:gap-16">
          <ProductGallery images={product.imageUrls} alt={product.name} />

          <div>
            <div className="font-serif text-[clamp(28px,3.4vw,40px)] leading-[1.15] text-ink">{product.name}</div>
            <div className="mt-2 font-mono text-[13px] tracking-[0.02em] text-brass">{product.scientificName}</div>

            <p className="mt-6 max-w-[34em] text-[17px] leading-[1.6] text-muted">{product.description}</p>

            <div className="mt-7">
              <AddToCart product={product} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
