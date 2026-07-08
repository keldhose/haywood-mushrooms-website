import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRES_IN_MS = 60 * 60 * 24 * 14 * 1000; // 14 days (Firebase's max)

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { idToken } = (body ?? {}) as Record<string, unknown>;

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
  }

  try {
    // Require a recently-issued token so a stolen long-lived session cookie
    // can't be minted from an old, potentially-replayed ID token.
    await adminAuth.verifyIdToken(idToken, true);

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN_MS,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRES_IN_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Failed to create session cookie:", err);
    return NextResponse.json({ error: "Could not sign you in. Please try again." }, { status: 401 });
  }
}
