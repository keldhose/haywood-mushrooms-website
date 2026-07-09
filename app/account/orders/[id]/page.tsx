import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { getOrderById } from "@/lib/orders";
import ReorderButton from "../../../components/shop/ReorderButton";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;
  const user = await getSessionUser();
  const order = await getOrderById(id);

  if (!order || (order.userId !== user!.uid && !user!.isAdmin)) {
    notFound();
  }

  return (
    <main className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-[700px]">
        <Link href="/account/orders" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-forest">
          ← Your orders
        </Link>

        <div className="mt-4 flex items-center justify-between gap-4">
          <h1 className="font-serif text-[32px] text-ink">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <ReorderButton items={order.items} />
        </div>

        {order.status === "paid" && (
          <div className="mt-4 rounded-[2px] border border-forest bg-paper px-4 py-3 text-[14px] text-forest">
            Payment received — a receipt was emailed to you by Stripe.
          </div>
        )}
        {order.status === "pending" && success === "true" && (
          <div className="mt-4 rounded-[2px] border border-brass bg-paper px-4 py-3 text-[14px] text-muted">
            Payment is being confirmed — this usually takes just a few seconds. Refresh the page if it doesn&apos;t update.
          </div>
        )}
        {order.status === "pending" && success !== "true" && (
          <div className="mt-4 rounded-[2px] border border-line bg-cream px-4 py-3 text-[14px] text-muted">
            This order hasn&apos;t completed payment yet.
          </div>
        )}

        <div className="mt-8 rounded-[3px] border border-line bg-paper p-6">
          <div className="font-serif text-[20px] text-ink">Items</div>
          <div className="mt-4 flex flex-col gap-2">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex justify-between text-[14px] text-muted">
                <span>
                  {item.name}
                  {item.variantLabel ? ` — ${item.variantLabel}` : ""} × {item.qty}
                </span>
                <span>${((item.priceCents * item.qty) / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-[14.5px]">
            <span className="text-muted">Subtotal</span>
            <span className="text-ink">${(order.subtotalCents / 100).toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between text-[14.5px]">
            <span className="text-muted">
              Shipping ({order.shippingRate.provider} {order.shippingRate.service})
            </span>
            <span className="text-ink">${(order.shippingCents / 100).toFixed(2)}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3">
            <span className="font-semibold text-ink">Total</span>
            <span className="font-serif text-[22px] text-ink">${(order.totalCents / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-[3px] border border-line bg-paper p-6">
          <div className="font-serif text-[20px] text-ink">Shipping to</div>
          <p className="mt-2 text-[14px] leading-[1.6] text-muted">
            {order.shippingAddress.name}
            <br />
            {order.shippingAddress.street1}
            {order.shippingAddress.street2 ? `, ${order.shippingAddress.street2}` : ""}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
          </p>
          {order.trackingNumber && (
            <div className="mt-4 border-t border-line pt-4">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Tracking number</div>
              <div className="mt-1 text-[15px] text-ink">{order.trackingNumber}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
