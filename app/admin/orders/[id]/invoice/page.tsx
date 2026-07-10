import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/orders";
import PrintButton from "./PrintButton";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const buyer = order.buyerName ?? order.shippingAddress.name;
  const invoiceId = order.id.slice(0, 8).toUpperCase();
  const date = order.createdAt ? order.createdAt.toLocaleDateString() : "";
  const isLocal = order.channel === "local";

  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[720px]">
        <div className="print:hidden mb-8 flex items-center justify-between">
          <Link href={`/admin/orders/${order.id}`} className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-forest">
            ← Order
          </Link>
          <PrintButton />
        </div>

        <div className="border border-line bg-white p-10 print:border-0 print:p-0">
          <div className="flex items-start justify-between border-b border-line pb-6">
            <div>
              <div className="font-serif text-[24px] text-ink">Haywood Mushrooms</div>
              <div className="mt-1 text-[13px] text-muted">Cary &amp; Moncure, NC · info@haywoodmushrooms.com</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-brass">Invoice #{invoiceId}</div>
              <div className="mt-1 text-[13px] text-muted">{date}</div>
              <div className="mt-2 inline-block rounded-[2px] bg-forest px-[10px] py-[3px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-cream">
                Paid
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-6">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Bill to</div>
              <div className="mt-1.5 text-[14.5px] text-ink">{buyer}</div>
              {order.userEmail && <div className="text-[13.5px] text-muted">{order.userEmail}</div>}
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Payment</div>
              <div className="mt-1.5 text-[14.5px] text-ink">{order.paymentMethod ?? "Stripe"}</div>
              <div className="text-[13.5px] text-muted">{isLocal ? "Picked up in person" : "Shipped"}</div>
            </div>
          </div>

          <table className="mt-8 w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-line font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
                <th className="py-2 font-medium">Item</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Price</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={`${item.productId}-${item.variantId ?? ""}`} className="border-b border-line">
                  <td className="py-3 text-ink">
                    {item.name}
                    {item.variantLabel ? ` — ${item.variantLabel}` : ""}
                  </td>
                  <td className="py-3 text-right text-muted">{item.qty}</td>
                  <td className="py-3 text-right text-muted">${(item.priceCents / 100).toFixed(2)}</td>
                  <td className="py-3 text-right text-ink">${((item.priceCents * item.qty) / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col items-end gap-1.5">
            <div className="flex w-56 justify-between text-[14px] text-muted">
              <span>Subtotal</span>
              <span>${(order.subtotalCents / 100).toFixed(2)}</span>
            </div>
            {order.shippingCents > 0 && (
              <div className="flex w-56 justify-between text-[14px] text-muted">
                <span>Shipping</span>
                <span>${(order.shippingCents / 100).toFixed(2)}</span>
              </div>
            )}
            {order.discountCents ? (
              <div className="flex w-56 justify-between text-[14px] text-forest">
                <span>Discount</span>
                <span>−${(order.discountCents / 100).toFixed(2)}</span>
              </div>
            ) : null}
            <div className="mt-1.5 flex w-56 justify-between border-t border-line pt-1.5 text-[16px] font-semibold text-ink">
              <span>Total</span>
              <span>${(order.totalCents / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
