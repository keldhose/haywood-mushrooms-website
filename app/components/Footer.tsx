export default function Footer() {
  return (
    <>
      {/* 1. Quality & Compliance Section */}
      <section className="py-20 bg-stone-50 border-t border-stone-200">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold text-stone-900">Professional Standards</h2>
          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            At Haywood Mushrooms, we leverage over two decades of professional experience in 
            agricultural regulatory compliance and state registration. Every culture is produced 
            under the same rigorous standards required for professional plant pathology research, 
            ensuring our North Carolina growers receive spawn that is genetically stable, 
            vigorous, and verified for purity.
          </p>
        </div>
      </section>

      {/* 2. Simple Status Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-semibold">Coming Soon</h3>
          <p className="mt-6 text-lg text-stone-600">
            Haywood Mushrooms is preparing to launch premium mushroom spawn for
            growers across North Carolina and beyond.
          </p>
          <p className="mt-4 font-semibold text-green-800">info@haywoodmushrooms.com</p>
        </div>
      </section>

      {/* 3. Main Dark Footer */}
      <footer className="bg-stone-900 text-white py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-bold text-xl tracking-tight">Haywood Mushrooms</p>
          <p className="text-stone-400 mt-2 text-sm uppercase tracking-widest">
            Cary research operations · Moncure cultivation expansion
          </p>
          <div className="mt-8 pt-8 border-t border-stone-800 text-stone-500 text-xs">
            © {new Date().getFullYear()} Haywood Mushrooms. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}