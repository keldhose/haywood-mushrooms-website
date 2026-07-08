import Link from "next/link";
import { getAllProductsForAdmin } from "@/lib/products";
import { getAllOrders } from "@/lib/orders";

export const metadata = {
  title: "Admin | Haywood Mushrooms",
};

export default async function AdminHomePage() {
  const [products, orders] = await Promise.all([getAllProductsForAdmin(), getAllOrders()]);
  const pendingOrders = orders.filter((o) => o.status === "paid").length;

  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-serif text-[32px] text-ink">Dashboard</h1>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Link href="/admin/products" className="rounded-[3px] border border-line bg-paper p-6 transition hover:border-forest">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Products</div>
            <div className="mt-2 font-serif text-[32px] text-ink">{products.length}</div>
          </Link>
          <Link href="/admin/orders" className="rounded-[3px] border border-line bg-paper p-6 transition hover:border-forest">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Total orders</div>
            <div className="mt-2 font-serif text-[32px] text-ink">{orders.length}</div>
          </Link>
          <Link href="/admin/orders" className="rounded-[3px] border border-line bg-paper p-6 transition hover:border-forest">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Awaiting fulfillment</div>
            <div className="mt-2 font-serif text-[32px] text-brass">{pendingOrders}</div>
          </Link>
        </div>
      </div>
    </main>
  );
}
