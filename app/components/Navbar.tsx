import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
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