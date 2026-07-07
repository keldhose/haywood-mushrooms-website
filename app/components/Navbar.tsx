"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "#science", label: "Science" },
  { href: "#products", label: "Products" },
  { href: "/blog", label: "Grow Guides" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-stone-200">
      {/* We use h-20 (80px) and zero padding to keep it slim */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        <Link href="/" className="flex items-center h-full py-2">
          <Image
            src="/logo.png"
            alt="Haywood Mushrooms"
            width={200}
            height={60}
            priority
            /* h-full will now actually make the logo large because the file is cropped */
            className="h-full w-auto object-contain hover:opacity-90 transition"
          />
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-stone-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-green-800 transition">
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-stone-700 hover:text-green-800 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 text-sm font-medium text-stone-700">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="hover:text-green-800 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
