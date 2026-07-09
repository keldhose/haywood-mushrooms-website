import "server-only";
import { Resend } from "resend";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { emailShell, brassButton } from "@/lib/email";

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Haywood Mushrooms <onboarding@resend.dev>";
const BASE_URL = "https://www.haywoodmushrooms.com";
const BRASS = "#c9a44c";
const INK = "#14231a";
const MUTED = "#5c5f57";

/**
 * Records a back-in-stock request. Idempotent per (product, variant, email)
 * while a prior request is still pending — resubmitting the form doesn't
 * create duplicate notification docs.
 */
export async function recordStockNotification(
  productId: string,
  variantId: string | undefined,
  email: string
): Promise<void> {
  const col = adminDb.collection("stockNotifications");

  const existing = await col
    .where("productId", "==", productId)
    .where("variantId", "==", variantId ?? null)
    .where("email", "==", email)
    .where("notified", "==", false)
    .limit(1)
    .get();

  if (!existing.empty) return;

  await col.add({
    productId,
    variantId: variantId ?? null,
    email,
    createdAt: FieldValue.serverTimestamp(),
    notified: false,
  });
}

/**
 * Emails everyone waiting on a product (or specific variant) that just came
 * back in stock, then marks their requests notified. Never throws — admin
 * stock updates must succeed even if this fails; log and move on.
 */
export async function notifyBackInStock(
  productId: string,
  variantId: string | undefined,
  productName: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; skipping back-in-stock notifications");
    return;
  }

  const col = adminDb.collection("stockNotifications");
  const snap = await col
    .where("productId", "==", productId)
    .where("variantId", "==", variantId ?? null)
    .where("notified", "==", false)
    .get();

  if (snap.empty) return;

  const resend = new Resend(apiKey);
  const body = `
    <div style="font-family:monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRASS};">Back in stock</div>
    <div style="font-family:Georgia,serif;font-size:30px;color:${INK};margin-top:12px;">${productName} is back.</div>
    <p style="font-size:15px;color:${MUTED};margin-top:14px;line-height:1.6;">You asked us to let you know — it's freshly restocked and ready to ship. Grab it before this batch is gone again.</p>
    ${brassButton("Shop now", `${BASE_URL}/shop`)}
  `;
  const html = emailShell("", body);

  await Promise.all(
    snap.docs.map(async (doc) => {
      const { email } = doc.data() as { email: string };
      try {
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `${productName} is back in stock`,
          html,
        });
        if (error) {
          console.error(`Resend error sending back-in-stock email to ${email}:`, error);
          return;
        }
        await doc.ref.update({ notified: true });
      } catch (err) {
        console.error(`Unexpected error sending back-in-stock email to ${email}:`, err);
      }
    })
  );
}
