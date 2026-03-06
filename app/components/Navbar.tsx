import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        {/* h-full ensures the Link and Image can stretch to the container height */}
        <Link href="/" className="flex items-center h-full">
          <Image
            src="/logo.png"
            alt="Haywood Mushrooms"
            width={240} 
            height={80}
            priority
            /* h-full makes the image touch the top and bottom borders */
            /* py-1 provides a tiny sliver of breathing room if you don't want it literally touching the lines */
            className="h-full w-auto object-contain py-1 hover:opacity-90 transition" 
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