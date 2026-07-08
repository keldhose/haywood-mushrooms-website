"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { establishSessionCookie, authErrorMessage } from "@/lib/auth/client-helpers";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setResetSent(false);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await establishSessionCookie(cred.user);
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setSubmitting(true);
    setError("");
    setResetSent(false);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await establishSessionCookie(cred.user);
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Enter your email above first, then click \"Forgot password?\".");
      return;
    }
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (err) {
      setError(authErrorMessage(err));
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-[440px] rounded-[4px] border border-line bg-paper p-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Haywood Mushrooms / Log in
        </div>
        <h1 className="mt-4 font-serif text-[32px] text-ink">Welcome back</h1>
        <p className="mt-2.5 text-[15px] text-muted">
          Log in to view your orders and account details.
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="mt-7 w-full justify-center rounded-[2px] border border-forest px-[22px] py-[13px] text-[14.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper disabled:opacity-60"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              placeholder="name@email.com"
              className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-forest hover:text-brass"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              placeholder="Your password"
              className="w-full rounded-[2px] border border-line bg-paper p-[13px] text-[15px] outline-none transition focus:border-forest focus:shadow-[0_0_0_3px_rgba(31,61,43,0.1)] disabled:opacity-60"
            />
          </div>

          {resetSent && (
            <p className="mt-4 text-sm font-medium text-forest">
              Password reset email sent — check your inbox.
            </p>
          )}
          {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full justify-center rounded-[2px] bg-brass py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-muted">
          Don&apos;t have an account?{" "}
          <Link href={`/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-forest hover:text-brass">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
