"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useCart } from "@/context/CartContext";

const links = [
  { href: "/#science", label: "Science" },
  { href: "/shop", label: "Shop" },
  { href: "/strains", label: "Strains" },
  { href: "/blog", label: "Grow Guides" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const { totalQty } = useCart();

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-cream/[.82] backdrop-blur-md">
      <div className="mx-auto flex h-[78px] max-w-[1200px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-3 whitespace-nowrap">
          <span className="h-[13px] w-[13px] flex-none rounded-full bg-brass shadow-[0_0_0_4px_rgba(201,164,76,0.18)]" />
          <span>
            <span className="block font-serif text-[23px] leading-none tracking-[0.01em] text-ink">
              Haywood Mushrooms
            </span>
            <span className="mt-[3px] block font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted">
              Spawn Laboratory · Cary &amp; Moncure, NC
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[14.5px] font-medium transition hover:text-forest ${
                pathname === link.href ? "text-forest" : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={user ? "/account" : "/login"}
            className={`text-[14.5px] font-medium transition hover:text-forest ${
              pathname === "/account" ? "text-forest" : "text-ink"
            }`}
          >
            {user ? "Account" : "Log in"}
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative flex items-center text-ink hover:text-forest">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 0 0 5.414 17H17M17 13v4M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
            {totalQty > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-brass px-1 font-mono text-[9.5px] font-bold text-forest-deep">
                {totalQty}
              </span>
            )}
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-[9px] rounded-[2px] border border-brass bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06]"
          >
            Shop now <span className="font-mono">→</span>
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="p-2 -mr-2 text-ink lg:hidden"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-line bg-cream px-6 py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-[10px] text-[17px] font-medium text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={user ? "/account" : "/login"}
            onClick={() => setOpen(false)}
            className="border-b border-line py-[10px] text-[17px] font-medium text-ink"
          >
            {user ? "Account" : "Log in"}
          </Link>
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="border-b border-line py-[10px] text-[17px] font-medium text-ink"
          >
            Cart{totalQty > 0 ? ` (${totalQty})` : ""}
          </Link>
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="border-b border-line py-[10px] text-[17px] font-medium text-ink"
          >
            Shop now →
          </Link>
        </div>
      )}
    </nav>
  );
}
