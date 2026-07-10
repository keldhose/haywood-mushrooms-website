import "server-only";
import { Resend } from "resend";
import type { Order, LowStockCrossing } from "@/lib/orders";

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Haywood Mushrooms <onboarding@resend.dev>";
const REPLY_TO = "info@haywoodmushrooms.com";
const BASE_URL = "https://www.haywoodmushrooms.com";

const COLORS = {
  cream: "#f5f4f0",
  paper: "#fbfaf7",
  ink: "#14231a",
  forest: "#1f3d2b",
  forestDeep: "#16281d",
  brass: "#c9a44c",
  muted: "#5c5f57",
  line: "#e4e2d8",
};

function shortId(order: Order): string {
  return order.id.slice(0, 8).toUpperCase();
}

function firstName(order: Order): string {
  return order.shippingAddress.name.trim().split(/\s+/)[0] || "there";
}

const TRACKING_URLS: Record<string, (n: string) => string> = {
  USPS: (n) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}`,
  UPS: (n) => `https://www.ups.com/track?tracknum=${n}`,
  FEDEX: (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}`,
};

function trackingUrl(order: Order): string | null {
  if (!order.trackingNumber) return null;
  const provider = order.shippingRate.provider?.toUpperCase() ?? "";
  const builder = Object.entries(TRACKING_URLS).find(([key]) => provider.includes(key))?.[1];
  return builder ? builder(order.trackingNumber) : null;
}

export function emailShell(headBar: string, body: string): string {
  return `
<div style="background:${COLORS.cream};padding:32px 16px;font-family:'Hanken Grotesk',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="600" style="max-width:600px;width:100%;margin:0 auto;background:#ffffff;border:1px solid ${COLORS.line};border-collapse:collapse;">
    <tr>
      <td style="background:${COLORS.forestDeep};padding:34px 40px;">
        <table role="presentation">
          <tr>
            <td style="width:12px;height:12px;border-radius:50%;background:${COLORS.brass};"></td>
            <td style="padding-left:14px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${COLORS.cream};">Haywood Mushrooms</div>
              <div style="font-family:monospace;font-size:8.5px;letter-spacing:0.24em;text-transform:uppercase;color:rgba(245,244,240,0.55);margin-top:3px;">Spawn Laboratory</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:40px;">
        ${headBar}
        ${body}
      </td>
    </tr>
    <tr>
      <td style="background:${COLORS.ink};padding:26px 40px;text-align:center;">
        <div style="font-family:monospace;font-size:10px;letter-spacing:0.1em;color:rgba(245,244,240,0.5);">Haywood Mushrooms &middot; Cary &amp; Moncure, NC &middot; info@haywoodmushrooms.com</div>
      </td>
    </tr>
  </table>
</div>`;
}

function orderItemsTable(order: Order): string {
  const rows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:16px 20px;border-bottom:1px solid ${COLORS.line};">
        <div style="font-size:14px;font-weight:600;color:${COLORS.ink};">${item.name}${item.variantLabel ? ` &mdash; ${item.variantLabel}` : ""}</div>
        <div style="font-family:monospace;font-size:11px;color:${COLORS.muted};margin-top:2px;">Qty ${item.qty}</div>
      </td>
      <td style="padding:16px 20px;border-bottom:1px solid ${COLORS.line};text-align:right;font-family:Georgia,serif;font-size:16px;color:${COLORS.ink};white-space:nowrap;">$${((item.priceCents * item.qty) / 100).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  return `
  <table role="presentation" width="100%" style="border:1px solid ${COLORS.line};border-radius:4px;border-collapse:collapse;margin-top:28px;">
    ${rows}
    <tr>
      <td style="padding:12px 20px;font-size:13.5px;color:${COLORS.muted};">Subtotal</td>
      <td style="padding:12px 20px;text-align:right;font-size:13.5px;color:${COLORS.muted};">$${(order.subtotalCents / 100).toFixed(2)}</td>
    </tr>
    <tr>
      <td style="padding:0 20px 12px;font-size:13.5px;color:${COLORS.muted};">Shipping &mdash; ${order.shippingRate.provider} ${order.shippingRate.service}</td>
      <td style="padding:0 20px 12px;text-align:right;font-size:13.5px;color:${COLORS.muted};">$${(order.shippingCents / 100).toFixed(2)}</td>
    </tr>
    ${
      order.discountCents
        ? `<tr>
      <td style="padding:0 20px 12px;font-size:13.5px;color:${COLORS.forest};">Discount</td>
      <td style="padding:0 20px 12px;text-align:right;font-size:13.5px;color:${COLORS.forest};">&minus;$${(order.discountCents / 100).toFixed(2)}</td>
    </tr>`
        : ""
    }
    <tr>
      <td style="padding:16px 20px 18px;border-top:1px solid ${COLORS.line};font-size:15px;font-weight:600;color:${COLORS.ink};">Total</td>
      <td style="padding:16px 20px 18px;border-top:1px solid ${COLORS.line};text-align:right;font-family:Georgia,serif;font-size:20px;color:${COLORS.ink};">$${(order.totalCents / 100).toFixed(2)}</td>
    </tr>
  </table>`;
}

function shippingBlock(order: Order): string {
  const addr = order.shippingAddress;
  return `
  <table role="presentation" width="100%" style="background:${COLORS.paper};border:1px solid ${COLORS.line};border-radius:4px;border-collapse:collapse;margin-top:24px;">
    <tr>
      <td style="padding:20px;">
        <div style="font-family:monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.muted};margin-bottom:8px;">Shipping to</div>
        <div style="font-size:14px;color:${COLORS.ink};line-height:1.5;">
          ${addr.name}<br>
          ${addr.street1}${addr.street2 ? `, ${addr.street2}` : ""}<br>
          ${addr.city}, ${addr.state} ${addr.zip}
        </div>
      </td>
    </tr>
  </table>`;
}

export function brassButton(label: string, href: string): string {
  return `
  <table role="presentation" width="100%" style="margin-top:28px;"><tr><td>
    <a href="${href}" style="display:block;text-align:center;background:${COLORS.brass};color:${COLORS.forestDeep};font-size:14.5px;font-weight:600;padding:15px 22px;border-radius:2px;text-decoration:none;">${label} &rarr;</a>
  </td></tr></table>`;
}

export function buildOrderConfirmationHtml(order: Order): string {
  const id = shortId(order);
  const body = `
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.brass};">Order confirmed &middot; #${id}</div>
    <div style="font-family:Georgia,serif;font-size:30px;color:${COLORS.ink};margin-top:12px;">Thank you &mdash; your spawn is on the way to being made.</div>
    <p style="font-size:15px;color:${COLORS.muted};margin-top:14px;line-height:1.6;">Hi ${firstName(order)}, we've received your order and payment. It's now in our production queue; you'll get a shipping note with tracking the moment it's on the way.</p>
    ${orderItemsTable(order)}
    ${shippingBlock(order)}
    ${brassButton("View your order", `${BASE_URL}/account/orders/${order.id}`)}
  `;
  return emailShell("", body);
}

export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  if (!order.userEmail) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; skipping order confirmation email");
    return;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: order.userEmail,
      replyTo: REPLY_TO,
      subject: `Order confirmed — Haywood Mushrooms #${shortId(order)}`,
      html: buildOrderConfirmationHtml(order),
    });
    if (error) {
      console.error("Resend error sending order confirmation email:", error);
    }
  } catch (err) {
    console.error("Unexpected error sending order confirmation email:", err);
  }
}

export function buildAdminOrderNotificationHtml(order: Order): string {
  const id = shortId(order);
  const body = `
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.brass};">New order &middot; #${id}</div>
    <div style="font-family:Georgia,serif;font-size:30px;color:${COLORS.ink};margin-top:12px;">$${(order.totalCents / 100).toFixed(2)} from ${firstName(order)}.</div>
    <table role="presentation" width="100%" style="background:${COLORS.paper};border:1px solid ${COLORS.line};border-radius:4px;border-collapse:collapse;margin-top:20px;">
      <tr>
        <td style="padding:16px 20px;">
          <div style="font-family:monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.muted};margin-bottom:6px;">Customer</div>
          <div style="font-size:14px;color:${COLORS.ink};">${order.shippingAddress.name} &middot; ${order.userEmail ?? "no email"}</div>
        </td>
      </tr>
    </table>
    ${orderItemsTable(order)}
    ${shippingBlock(order)}
    ${brassButton("View order in admin", `${BASE_URL}/admin/orders/${order.id}`)}
  `;
  return emailShell("", body);
}

export async function sendAdminOrderNotification(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; skipping admin order notification");
    return;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: REPLY_TO,
      replyTo: order.userEmail || REPLY_TO,
      subject: `New order — $${(order.totalCents / 100).toFixed(2)} (#${shortId(order)})`,
      html: buildAdminOrderNotificationHtml(order),
    });
    if (error) {
      console.error("Resend error sending admin order notification:", error);
    }
  } catch (err) {
    console.error("Unexpected error sending admin order notification:", err);
  }
}

export function buildLowStockAlertHtml(crossings: LowStockCrossing[]): string {
  const rows = crossings
    .map(
      (c) => `
    <tr>
      <td style="padding:14px 20px;border-bottom:1px solid ${COLORS.line};">
        <div style="font-size:14px;font-weight:600;color:${COLORS.ink};">${c.productName}${c.variantLabel ? ` &mdash; ${c.variantLabel}` : ""}</div>
      </td>
      <td style="padding:14px 20px;border-bottom:1px solid ${COLORS.line};text-align:right;font-family:Georgia,serif;font-size:16px;color:#a33;white-space:nowrap;">${c.newStock} left</td>
    </tr>`
    )
    .join("");

  const body = `
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.brass};">Low stock</div>
    <div style="font-family:Georgia,serif;font-size:30px;color:${COLORS.ink};margin-top:12px;">${crossings.length === 1 ? "An item is" : `${crossings.length} items are`} running low.</div>
    <p style="font-size:15px;color:${COLORS.muted};margin-top:14px;line-height:1.6;">These just crossed your low-stock threshold — worth queuing a restock before they sell out.</p>
    <table role="presentation" width="100%" style="border:1px solid ${COLORS.line};border-radius:4px;border-collapse:collapse;margin-top:24px;">
      ${rows}
    </table>
    ${brassButton("Manage products", `${BASE_URL}/admin/products`)}
  `;
  return emailShell("", body);
}

export async function sendLowStockAlert(crossings: LowStockCrossing[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; skipping low-stock alert");
    return;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: REPLY_TO,
      subject: crossings.length === 1 ? `Low stock — ${crossings[0].productName}` : `Low stock — ${crossings.length} items`,
      html: buildLowStockAlertHtml(crossings),
    });
    if (error) {
      console.error("Resend error sending low-stock alert:", error);
    }
  } catch (err) {
    console.error("Unexpected error sending low-stock alert:", err);
  }
}

export function buildWelcomeDiscountHtml(code: string): string {
  const body = `
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.brass};">Welcome</div>
    <div style="font-family:Georgia,serif;font-size:30px;color:${COLORS.ink};margin-top:12px;">10% off your first order.</div>
    <p style="font-size:15px;color:${COLORS.muted};margin-top:14px;line-height:1.6;">Thanks for joining the growers' list — here's a code for 10% off your first order. Good for 30 days.</p>
    <table role="presentation" width="100%" style="border:1px dashed ${COLORS.brass};border-radius:4px;background:${COLORS.paper};margin-top:24px;">
      <tr>
        <td style="padding:24px;text-align:center;">
          <div style="font-family:monospace;font-size:22px;font-weight:600;letter-spacing:0.08em;color:${COLORS.ink};">${code}</div>
        </td>
      </tr>
    </table>
    <p style="font-size:13.5px;color:${COLORS.muted};margin-top:14px;line-height:1.5;">Enter it on the payment page at checkout.</p>
    ${brassButton("Shop now", `${BASE_URL}/shop`)}
  `;
  return emailShell("", body);
}

export async function sendWelcomeDiscountEmail(toEmail: string, code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; skipping welcome discount email");
    return;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      replyTo: REPLY_TO,
      subject: "Here's 10% off your first order",
      html: buildWelcomeDiscountHtml(code),
    });
    if (error) {
      console.error("Resend error sending welcome discount email:", error);
    }
  } catch (err) {
    console.error("Unexpected error sending welcome discount email:", err);
  }
}

export function buildShippedEmailHtml(order: Order): string {
  const id = shortId(order);
  const trackUrl = trackingUrl(order);
  const trackingBlock = order.trackingNumber
    ? `
  <table role="presentation" width="100%" style="background:${COLORS.paper};border:1px solid ${COLORS.line};border-radius:4px;border-collapse:collapse;margin-top:24px;">
    <tr>
      <td style="padding:20px;">
        <div style="font-family:monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.muted};margin-bottom:8px;">Tracking number</div>
        <div style="font-family:monospace;font-size:15px;color:${COLORS.ink};">${order.trackingNumber}</div>
      </td>
      ${trackUrl ? `<td style="padding:20px;text-align:right;"><a href="${trackUrl}" style="display:inline-block;border:1px solid ${COLORS.forest};color:${COLORS.forest};font-size:13px;font-weight:600;padding:10px 16px;border-radius:2px;text-decoration:none;">Track &rarr;</a></td>` : ""}
    </tr>
  </table>`
    : "";

  const body = `
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.brass};">Shipped &middot; #${id}</div>
    <div style="font-family:Georgia,serif;font-size:30px;color:${COLORS.ink};margin-top:12px;">Your order is on its way.</div>
    <p style="font-size:15px;color:${COLORS.muted};margin-top:14px;line-height:1.6;">Good news, ${firstName(order)} &mdash; your spawn shipped today via ${order.shippingRate.provider} ${order.shippingRate.service}. Use the tracking number below to follow it to your door. Inoculate promptly once it arrives for the healthiest colonization.</p>
    ${trackingBlock}
    <div style="margin-top:24px;">
      <div style="font-family:monospace;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.muted};">Handling tip</div>
      <p style="font-size:15px;color:${COLORS.muted};margin-top:8px;line-height:1.6;">Store spawn cool and out of direct sun until you're ready. It's alive &mdash; the sooner it's working in your substrate, the better.</p>
    </div>
    ${brassButton("View your order", `${BASE_URL}/account/orders/${order.id}`)}
  `;
  return emailShell("", body);
}

function invoiceItemsTable(order: Order): string {
  const rows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:16px 20px;border-bottom:1px solid ${COLORS.line};">
        <div style="font-size:14px;font-weight:600;color:${COLORS.ink};">${item.name}${item.variantLabel ? ` &mdash; ${item.variantLabel}` : ""}</div>
        <div style="font-family:monospace;font-size:11px;color:${COLORS.muted};margin-top:2px;">Qty ${item.qty}</div>
      </td>
      <td style="padding:16px 20px;border-bottom:1px solid ${COLORS.line};text-align:right;font-family:Georgia,serif;font-size:16px;color:${COLORS.ink};white-space:nowrap;">$${((item.priceCents * item.qty) / 100).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  return `
  <table role="presentation" width="100%" style="border:1px solid ${COLORS.line};border-radius:4px;border-collapse:collapse;margin-top:28px;">
    ${rows}
    <tr>
      <td style="padding:16px 20px 18px;border-top:1px solid ${COLORS.line};font-size:15px;font-weight:600;color:${COLORS.ink};">Total &mdash; paid</td>
      <td style="padding:16px 20px 18px;border-top:1px solid ${COLORS.line};text-align:right;font-family:Georgia,serif;font-size:20px;color:${COLORS.ink};">$${(order.totalCents / 100).toFixed(2)}</td>
    </tr>
  </table>`;
}

/** Invoice for an in-person local sale (cash/Venmo/PayPal/Zelle) — no shipment involved, so this omits the shipping line/address block the online templates use. */
export function buildLocalSaleInvoiceHtml(order: Order): string {
  const id = shortId(order);
  const date = order.createdAt ? order.createdAt.toLocaleDateString() : "";
  const buyer = order.buyerName ?? order.shippingAddress.name;
  const body = `
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.brass};">Invoice &middot; #${id}</div>
    <div style="font-family:Georgia,serif;font-size:30px;color:${COLORS.ink};margin-top:12px;">$${(order.totalCents / 100).toFixed(2)} &mdash; paid in full.</div>
    <p style="font-size:15px;color:${COLORS.muted};margin-top:14px;line-height:1.6;">Thanks, ${buyer}! Here's your receipt for the order picked up in person${date ? ` on ${date}` : ""}, paid via ${order.paymentMethod ?? "cash"}.</p>
    ${invoiceItemsTable(order)}
  `;
  return emailShell("", body);
}

export async function sendLocalSaleInvoiceEmail(order: Order): Promise<void> {
  if (!order.userEmail) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; skipping local sale invoice email");
    return;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: order.userEmail,
      replyTo: REPLY_TO,
      subject: `Your invoice — Haywood Mushrooms #${shortId(order)}`,
      html: buildLocalSaleInvoiceHtml(order),
    });
    if (error) {
      console.error("Resend error sending local sale invoice email:", error);
    }
  } catch (err) {
    console.error("Unexpected error sending local sale invoice email:", err);
  }
}

export async function sendShippedEmail(order: Order): Promise<void> {
  if (!order.userEmail) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; skipping shipped email");
    return;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: order.userEmail,
      replyTo: REPLY_TO,
      subject: "Your Haywood Mushrooms order has shipped",
      html: buildShippedEmailHtml(order),
    });
    if (error) {
      console.error("Resend error sending shipped email:", error);
    }
  } catch (err) {
    console.error("Unexpected error sending shipped email:", err);
  }
}
