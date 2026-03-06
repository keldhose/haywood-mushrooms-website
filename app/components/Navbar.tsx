import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-stone-200">

      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Haywood Mushrooms"
            width={240} // Increase this to prevent blurriness
            height={80}  // Increase this proportionally
            priority
            className="h-28 w-auto hover:opacity-90 transition" // Changed h-20 to h-28
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