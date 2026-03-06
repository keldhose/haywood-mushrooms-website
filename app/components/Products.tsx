const products = [
  {
    name: "Lion's Mane Spawn",
    image: "/lions-mane.jpg",
    desc: "Hericium erinaceus selected for vigorous growth and dense fruiting.",
  },
  {
    name: "Gray Oyster Spawn",
    image: "/grey-oyster-harvest.jpg",
    desc: "Reliable oyster strain known for aggressive colonization and consistent yields.",
  },
  {
    name: "Pink Oyster Spawn",
    image: "/pink-oyster.png",
    desc: "Fast-growing tropical oyster with vibrant coral-colored fruiting bodies.",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center">Our Products</h2>

        <div className="grid md:grid-cols-3 gap-10 mt-12">
          {products.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-60 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="mt-3 text-stone-600">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}