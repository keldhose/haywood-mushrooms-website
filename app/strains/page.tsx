export const metadata = {
  title: "Mushroom Strains | Haywood Mushrooms",
  description:
    "Explore the mushroom species cultivated and studied at Haywood Mushrooms including oyster mushrooms, lion's mane, and shiitake.",
};

export default function StrainsPage() {
  return (
    <main className="min-h-screen bg-stone-50 py-20">

      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-4xl font-semibold text-center">
          Mushroom Strains We Work With
        </h1>

        <p className="mt-6 text-lg text-stone-600 text-center">
          Haywood Mushrooms focuses on scientifically developed fungal
          cultures suitable for gourmet cultivation and research.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mt-12">

          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Blue Oyster</h2>
            <p className="mt-3 text-stone-600">
              Pleurotus ostreatus – fast colonizing oyster mushroom
              widely used in commercial mushroom production.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Pink Oyster</h2>
            <p className="mt-3 text-stone-600">
              Pleurotus djamor – tropical oyster mushroom known for
              rapid growth and vibrant pink fruiting bodies.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Gray Oyster</h2>
            <p className="mt-3 text-stone-600">
              A reliable oyster strain suitable for a wide variety
              of substrates and growing conditions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Lion's Mane</h2>
            <p className="mt-3 text-stone-600">
              Hericium erinaceus – a gourmet and medicinal mushroom
              valued for culinary and functional uses.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Shiitake</h2>
            <p className="mt-3 text-stone-600">
              Lentinula edodes – a classic hardwood mushroom widely
              cultivated around the world.
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}