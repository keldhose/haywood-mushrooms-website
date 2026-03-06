import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    // "sticky top-0 z-50" keeps the bar at the top and ensures it stays above other content
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-stone-200">

      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Haywood Mushrooms"
            // Increased width/height props for better resolution at larger sizes
            width={240} 
            height={80}
            priority
            // Changed h-20 to h-28 for a more prominent logo
            className="h-28 w-auto hover:opacity-90 transition" 
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