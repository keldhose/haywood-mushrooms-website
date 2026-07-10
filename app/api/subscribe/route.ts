import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createWelcomeDiscountCode } from "@/lib/welcome-discount";
import { sendWelcomeDiscountEmail } from "@/lib/email";

const TO_EMAIL = "info@haywoodmushrooms.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Haywood Mushrooms <onboarding@resend.dev>";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; cannot send subscribe notification");
    return NextResponse.json(
      { error: "Email delivery is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: "New grower's list signup",
      text: `New newsletter signup: ${email}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to subscribe." }, { status: 502 });
    }
  } catch (err) {
    console.error("Unexpected error sending subscribe notification:", err);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }

  // Best-effort — the signup itself already succeeded above, so a hiccup
  // here (Stripe or Resend) shouldn't turn into a failed subscribe request.
  try {
    const code = await createWelcomeDiscountCode();
    await sendWelcomeDiscountEmail(email, code);
  } catch (err) {
    console.error(`Failed to create/send welcome discount code for ${email}:`, err);
  }

  return NextResponse.json({ ok: true });
}
