"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const HIDDEN_PREFIXES = ["/admin", "/cart", "/checkout"];

export default function FloatingCartButton() {
  const pathname = usePathname();
  const { totalQty } = useCart();

  if (totalQty === 0 || HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${totalQty} item${totalQty !== 1 ? "s" : ""}`}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brass text-forest-deep shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition hover:brightness-[1.06] active:scale-95"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 0 0 5.414 17H17M17 13v4M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
      <span className="absolute -right-1 -top-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-cream bg-forest px-1 font-mono text-[10.5px] font-bold text-cream">
        {totalQty}
      </span>
    </Link>
  );
}
