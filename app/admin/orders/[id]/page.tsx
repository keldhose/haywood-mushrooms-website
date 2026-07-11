import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/orders";
import OrderStatusForm from "../OrderStatusForm";
import BuyShippingLabel from "../BuyShippingLabel";
import InvoiceActions from "../InvoiceActions";
import PickupActions from "../PickupActions";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const isLocalSale = order.channel === "local";
  const isPickup = !isLocalSale && order.shippingRate.provider === "Local pickup";
  const isShipped = !isLocalSale && !isPickup;

  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[900px]">
        <Link href="/admin/orders" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-forest">
          ← Orders
        </Link>

        <h1 className="mt-4 font-serif text-[32px] text-ink">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
        <p className="mt-1.5 text-[14px] text-muted">
          {order.channel === "local" ? (
            <>
              {order.buyerName}
              {order.userEmail ? ` (${order.userEmail})` : ""} · <span className="text-brass">Local — {order.paymentMethod}</span>
            </>
          ) : (
            order.userEmail
          )}{" "}
          · {order.createdAt ? order.createdAt.toLocaleString() : ""}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-[3px] border border-line bg-paper p-6">
            <div className="font-serif text-[20px] text-ink">Items</div>
            <div className="mt-4 flex flex-col gap-2">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex justify-between text-[14px] text-muted">
                  <span>
                    {item.name}
                    {item.variantLabel ? ` — ${item.variantLabel}` : ""} × {item.qty}
                    {item.isPreorder && <span className="ml-1.5 font-mono text-[10px] uppercase text-brass">(Made to order)</span>}
                  </span>
                  <span>${((item.priceCents * item.qty) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-[14.5px]">
              <span className="text-muted">Subtotal</span>
              <span className="text-ink">${(order.subtotalCents / 100).toFixed(2)}</span>
            </div>
            {isShipped && (
              <div className="mt-2 flex justify-between text-[14.5px]">
                <span className="text-muted">
                  Shipping ({order.shippingRate.provider} {order.shippingRate.service})
                </span>
                <span className="text-ink">${(order.shippingCents / 100).toFixed(2)}</span>
              </div>
            )}
            {order.discountCents ? (
              <div className="mt-2 flex justify-between text-[14.5px]">
                <span className="text-forest">Discount</span>
                <span className="text-forest">−${(order.discountCents / 100).toFixed(2)}</span>
              </div>
            ) : null}
            <div className="mt-3 flex justify-between border-t border-line pt-3">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-serif text-[22px] text-ink">${(order.totalCents / 100).toFixed(2)}</span>
            </div>
          </div>

          {isLocalSale ? (
            <div className="rounded-[3px] border border-line bg-paper p-6">
              <div className="font-serif text-[20px] text-ink">Sale details</div>
              <p className="mt-2 text-[14px] leading-[1.6] text-muted">
                {order.buyerName}
                {order.userEmail ? <><br />{order.userEmail}</> : null}
                <br />
                Paid via {order.paymentMethod} · picked up in person
              </p>
            </div>
          ) : isPickup ? (
            <div className="rounded-[3px] border border-line bg-paper p-6">
              <div className="font-serif text-[20px] text-ink">Pickup</div>
              <p className="mt-2 text-[14px] leading-[1.6] text-muted">
                {order.shippingAddress.name}
                {order.userEmail ? <><br />{order.userEmail}</> : null}
                <br />
                Paid online · picking up in person
              </p>

              {order.stripeCheckoutSessionId && (
                <div className="mt-5 border-t border-line pt-4 font-mono text-[11px] text-muted">
                  Stripe session: {order.stripeCheckoutSessionId}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-[3px] border border-line bg-paper p-6">
              <div className="font-serif text-[20px] text-ink">Ship to</div>
              <p className="mt-2 text-[14px] leading-[1.6] text-muted">
                {order.shippingAddress.name}
                <br />
                {order.shippingAddress.street1}
                {order.shippingAddress.street2 ? `, ${order.shippingAddress.street2}` : ""}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>

              {order.stripeCheckoutSessionId && (
                <div className="mt-5 border-t border-line pt-4 font-mono text-[11px] text-muted">
                  Stripe session: {order.stripeCheckoutSessionId}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <OrderStatusForm orderId={order.id} status={order.status} trackingNumber={order.trackingNumber} />
          {isLocalSale ? (
            <InvoiceActions orderId={order.id} hasEmail={!!order.userEmail} />
          ) : isPickup ? (
            <PickupActions order={order} />
          ) : (
            <BuyShippingLabel order={order} />
          )}
        </div>
      </div>
    </main>
  );
}
