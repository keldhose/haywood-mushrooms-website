import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/orders";
import ReorderButton from "../../components/shop/ReorderButton";

// Public — reachable by anyone who knows the order id (an unguessable
// Firestore doc id), the same way a Stripe or Shopify hosted receipt works.
// This is what checkout redirects to on success, so it has to work for
// guest orders with no account to gate access behind.
export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-[700px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Haywood Mushrooms / Order confirmation
        </div>

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

        {!order.userId && (
          <div className="mt-6 rounded-[3px] border border-line bg-cream px-5 py-4 text-[13.5px] text-muted">
            Checked out as a guest — a confirmation was sent to {order.userEmail}.{" "}
            <Link href="/signup" className="font-medium text-forest hover:text-brass">
              Create an account
            </Link>{" "}
            for faster checkout next time.
          </div>
        )}
      </div>
    </main>
  );
}
