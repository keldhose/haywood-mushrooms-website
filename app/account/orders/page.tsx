import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/orders";

export const metadata = {
  title: "Your Orders | Haywood Mushrooms",
};

export default async function OrdersPage() {
  const user = await getSessionUser();
  const orders = await getOrdersForUser(user!.uid);

  return (
    <main className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-[800px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Haywood Mushrooms / Account / Orders
        </div>
        <h1 className="mt-4 font-serif text-[36px] text-ink">Your orders</h1>

        {orders.length === 0 ? (
          <p className="mt-6 text-muted">
            You haven&apos;t placed any orders yet.{" "}
            <Link href="/shop" className="text-forest hover:text-brass">
              Visit the shop
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between rounded-[3px] border border-line bg-paper p-5 transition hover:border-forest"
              >
                <div>
                  <div className="text-[15px] font-medium text-ink">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                  <div className="mt-1 text-[13px] text-muted">
                    {order.createdAt ? order.createdAt.toLocaleDateString() : ""} · {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono text-[10.5px] uppercase tracking-[0.1em] ${
                      order.status === "paid"
                        ? "text-forest"
                        : order.status === "pending"
                        ? "text-brass"
                        : "text-muted"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-serif text-[18px] text-ink">${(order.totalCents / 100).toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
