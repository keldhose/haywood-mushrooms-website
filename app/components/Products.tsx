import Image from "next/image";

const products = [
  {
    name: "Lion's Mane Spawn",
    scientific: "Hericium erinaceus",
    image: "/lions-mane.jpg",
    desc: "Selected for vigorous mycelial growth and dense, icicle-like fruiting bodies.",
    stats: { colonization: "Fast", temp: "60-75°F", yield: "High" }
  },
  {
    name: "Gray Oyster Spawn",
    scientific: "Pleurotus ostreatus",
    image: "/grey-oyster-harvest.jpg",
    desc: "A reliable commercial strain known for aggressive colonization and thick caps.",
    stats: { colonization: "Aggressive", temp: "55-75°F", yield: "Very High" }
  },
  {
    name: "Pink Oyster Spawn",
    scientific: "Pleurotus djamor",
    image: "/pink-oyster.png",
    desc: "Fast-growing tropical oyster with vibrant coral-colored fruiting bodies.",
    stats: { colonization: "Ultra-Fast", temp: "70-85°F", yield: "High" }
  },
];

export default function Products() {
  return (
    <section id="products" className="py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight">Our Cultures & Spawn</h2>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            High-purity liquid cultures and grain spawn developed through rigorous 
            strain selection and laboratory isolation.
          </p>
          <div className="mt-4 h-1 w-20 bg-green-700 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {products.map((p) => (
            <div
              key={p.name}
              className="group bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-green-800/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
                    Coming Soon
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-stone-900">{p.name}</h3>
                  <p className="text-sm italic text-green-800 font-medium">{p.scientific}</p>
                </div>
                
                <p className="text-stone-600 leading-relaxed mb-6">
                  {p.desc}
                </p>

                {/* Technical Specs Grid */}
                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-stone-100">
                  <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-tighter text-stone-400 font-bold">Growth</span>
                    <span className="text-sm font-semibold text-stone-700">{p.stats.colonization}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-tighter text-stone-400 font-bold">Temp Range</span>
                    <span className="text-sm font-semibold text-stone-700">{p.stats.temp}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-tighter text-stone-400 font-bold">Yield</span>
                    <span className="text-sm font-semibold text-stone-700">{p.stats.yield}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}