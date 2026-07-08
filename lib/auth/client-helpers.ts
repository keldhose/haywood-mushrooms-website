import type { User } from "firebase/auth";

export async function establishSessionCookie(user: User): Promise<void> {
  const idToken = await user.getIdToken();

  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Could not sign you in. Please try again.");
  }
}

export function authErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with that email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        break;
    }
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}
