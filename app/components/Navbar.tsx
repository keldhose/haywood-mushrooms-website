import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-stone-200">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Haywood Mushrooms"
            className="h-16"
          />
        </Link>

        <div className="flex gap-6 text-sm font-medium">

          <Link href="#science">Science</Link>

          <Link href="#products">Products</Link>

          <Link href="/blog">Grow Guides</Link>

          <Link href="#contact">Contact</Link>

        </div>

      </div>

    </nav>
  )
}