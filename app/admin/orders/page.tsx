import Link from "next/link";
import { getAllOrders } from "@/lib/orders";

export const metadata = {
  title: "Admin · Orders | Haywood Mushrooms",
};

const statusColor: Record<string, string> = {
  pending: "text-muted",
  paid: "text-brass",
  fulfilled: "text-forest",
  cancelled: "text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-[32px] text-ink">Orders</h1>
          <Link
            href="/admin/orders/new"
            className="rounded-[2px] border border-forest px-[16px] py-[10px] text-[13px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
          >
            + Record local sale
          </Link>
        </div>

        {/* Mobile: stacked cards — a fixed-column table can't reflow on a
            narrow screen (email/order-id columns squeeze each other out). */}
        <div className="mt-8 flex flex-col gap-3 sm:hidden">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block rounded-[3px] border border-line bg-paper p-4 hover:border-forest"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">#{order.id.slice(0, 8).toUpperCase()}</span>
                <span className={`font-mono text-[10.5px] uppercase tracking-[0.1em] ${statusColor[order.status] ?? ""}`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-1.5 truncate text-[13px] text-muted">
                {order.channel === "local" ? (
                  <span className="text-brass">Local — {order.paymentMethod}</span>
                ) : (
                  order.userEmail
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-[13px] text-muted">
                <span>{order.createdAt ? order.createdAt.toLocaleDateString() : ""}</span>
                <span className="text-ink">${(order.totalCents / 100).toFixed(2)}</span>
              </div>
            </Link>
          ))}
          {orders.length === 0 && <p className="py-8 text-center text-muted">No orders yet.</p>}
        </div>

        {/* Desktop / tablet: full table. */}
        <div className="mt-8 hidden overflow-hidden rounded-[3px] border border-line sm:block">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-line bg-paper font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-line last:border-b-0 hover:bg-paper">
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink hover:text-forest">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {order.channel === "local" ? (
                      <span>
                        {order.buyerName} <span className="text-brass">· Local — {order.paymentMethod}</span>
                      </span>
                    ) : (
                      order.userEmail
                    )}
                  </td>
                  <td className="px-5 py-4 text-muted">{order.createdAt ? order.createdAt.toLocaleDateString() : ""}</td>
                  <td className="px-5 py-4 text-ink">${(order.totalCents / 100).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`font-mono text-[10.5px] uppercase tracking-[0.1em] ${statusColor[order.status] ?? ""}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
