export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">

      {/* HERO SECTION */}

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-emerald-900">
        Haywood Mushrooms
        </h1>

        <p className="mt-4 text-xl text-stone-700">
        Scientifically developed mushroom spawn
        </p>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-stone-600">
        Premium mushroom spawn and fungal cultures developed by plant
        pathologists and produced with rigorous sterile technique.
        Based in Moncure, North Carolina.
        </p>
      </section>


      {/* ABOUT SECTION */}

      <section className="bg-stone-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Built on fungal science
          </h2>

          <p className="mt-6 text-lg text-stone-600">
            Haywood Mushrooms was founded by a husband-and-wife team
            combining agricultural science and engineering systems.
          </p>

          <p className="mt-4 text-lg text-stone-600">
            Dr. [Wife Name] holds a PhD in Plant Pathology from
            North Carolina State University and has extensive
            experience studying fungi and plant-microbe interactions.
          </p>

          <p className="mt-4 text-lg text-stone-600">
            Our goal is simple: provide growers with reliable,
            scientifically developed mushroom spawn.
          </p>

        </div>
      </section>


      {/* PRODUCTS */}

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-semibold text-center">
            Products
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">

            <div className="p-8 bg-white rounded-2xl shadow">
              <h3 className="text-xl font-semibold">Liquid Culture</h3>
              <p className="mt-4 text-stone-600">
                Carefully maintained fungal cultures for reliable inoculation.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow">
              <h3 className="text-xl font-semibold">Grain Spawn</h3>
              <p className="mt-4 text-stone-600">
                Clean and vigorous spawn ready for substrate inoculation.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow">
              <h3 className="text-xl font-semibold">Fungal Genetics</h3>
              <p className="mt-4 text-stone-600">
                High quality strains selected for cultivation performance.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* FOOTER */}

      <footer className="bg-stone-900 text-white py-10 text-center">

        <p className="text-lg">
          Haywood Mushrooms
        </p>
        <p className="mt-2 text-stone-400">
          info@haywoodmushrooms.com
        </p>

      </footer>

    </main>
  );
}