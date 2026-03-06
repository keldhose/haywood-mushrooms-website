import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-stone-200">
      {/* Changed py-3 to py-1 to drastically reduce the white bar's thickness */}
      <div className="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">

        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Haywood Mushrooms"
            width={200} 
            height={60}
            priority
            /* Reduced from h-28 to h-20 (80px) to slim the navbar profile */
            className="h-20 w-auto hover:opacity-90 transition" 
          />
        </Link>

        <div className="flex gap-8 text-sm font-medium text-stone-700">
          <Link href="#science" className="hover:text-green-800 transition">Science</Link>
          <Link href="#products" className="hover:text-green-800 transition">Products</Link>
          <Link href="/blog" className="hover:text-green-800 transition">Grow Guides</Link>
          <Link href="#contact" className="hover:text-green-800 transition">Contact</Link>
        </div>

      </div>
    </nav>
  )
}