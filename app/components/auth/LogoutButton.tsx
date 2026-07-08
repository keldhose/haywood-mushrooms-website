"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await signOut(auth);
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      // Hard navigation on purpose: guarantees no stale client-side auth
      // state (Firebase cache, React state, etc.) survives the logout.
      window.location.href = "/";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center gap-[9px] rounded-[2px] border border-forest px-[22px] py-[13px] text-[14.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper disabled:opacity-60"
      }
    >
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
