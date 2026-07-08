import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export type SessionUser = {
  uid: string;
  email: string | null;
  isAdmin: boolean;
};

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      isAdmin: decoded.admin === true,
    };
  } catch {
    return null;
  }
});
