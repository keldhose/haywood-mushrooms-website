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
        <h1 className="font-serif text-[32px] text-ink">Orders</h1>

        <div className="mt-8 overflow-hidden rounded-[3px] border border-line">
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
                  <td className="px-5 py-4 text-muted">{order.userEmail}</td>
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
