export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-stone-200">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Haywood Mushrooms" className="h-10"/>
          <span className="text-xl font-bold text-emerald-900">
            Haywood Mushrooms
          </span>
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <a href="#science">Science</a>
          <a href="#products">Products</a>
          <a href="#contact">Contact</a>
        </div>

      </div>

    </nav>
  )
}