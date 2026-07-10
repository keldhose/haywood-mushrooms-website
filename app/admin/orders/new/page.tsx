import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import NewLocalOrderForm from "./NewLocalOrderForm";

export const metadata = {
  title: "Admin · Record local sale | Haywood Mushrooms",
};

export default async function NewLocalOrderPage() {
  const products = await getAllProducts();

  const options = products.map((p) => ({
    id: p.id,
    name: p.name,
    priceCents: p.priceCents,
    stockQty: p.stockQty,
    variants: p.variants ?? null,
  }));

  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[760px]">
        <Link href="/admin/orders" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-forest">
          ← Orders
        </Link>
        <h1 className="mt-4 font-serif text-[32px] text-ink">Record local sale</h1>
        <p className="mt-1.5 text-[14px] text-muted">
          For growers who pick up in person and pay cash, Venmo, PayPal, or Zelle. This creates a paid order and decrements
          stock right away — no Stripe involved.
        </p>

        <div className="mt-8">
          <NewLocalOrderForm products={options} />
        </div>
      </div>
    </main>
  );
}
