export default function HaywoodMushroomsHomepage() {

  const products = [
    {
      name: "Lion's Mane Liquid Culture",
      desc: "Fast‑colonizing lion's mane culture ideal for gourmet mushroom growers and specialty farms."
    },
    {
      name: "Blue Oyster Liquid Culture",
      desc: "Reliable oyster strain known for aggressive growth and strong yields."
    },
    {
      name: "Shiitake Grain Spawn",
      desc: "Premium shiitake spawn prepared for hardwood substrate cultivation."
    }
  ];

  return (

    <main className="min-h-screen bg-stone-50 text-stone-900">

      {/* HERO */}

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">

        <h1 className="text-5xl md:text-6xl font-bold text-emerald-900">
          Haywood Mushrooms
        </h1>

        <p className="mt-4 text-xl text-stone-700">
          Scientifically developed mushroom spawn
        </p>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-stone-600 leading-relaxed">
          Premium mushroom spawn and fungal cultures developed by plant
          pathologists and produced with rigorous sterile technique.
          Based in Moncure, North Carolina.
        </p>

        <div className="mt-10 flex justify-center gap-4">

          <button className="px-6 py-3 bg-emerald-900 text-white rounded-xl hover:bg-emerald-800 transition">
            Explore Products
          </button>

          <button className="px-6 py-3 border border-stone-400 rounded-xl hover:bg-stone-100 transition">
            Learn About Us
          </button>

        </div>

      </section>


      {/* SCIENCE SECTION */}

      <section className="bg-white py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Built on fungal science
          </h2>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Haywood Mushrooms was founded by a husband‑and‑wife team
            combining agricultural science and engineering systems.
            Our mission is to provide growers with reliable,
            scientifically developed mushroom spawn.
          </p>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Our work is guided by professional training in plant pathology
            and years of experience studying fungi and plant‑microbe
            interactions.
          </p>

        </div>

      </section>


      {/* FOUNDER CREDIBILITY */}

      <section className="py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Scientific leadership
          </h2>

          <p className="mt-6 text-lg text-stone-600">
            Dr. Anna Thomas holds a PhD in Plant Pathology from
            North Carolina State University and has extensive
            experience studying fungi and plant‑microbe interactions.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6 text-left">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">PhD</h3>
              <p className="text-stone-600">Plant Pathology – NC State University</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">MS</h3>
              <p className="text-stone-600">Plant Pathology – University of Georgia</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">BSc</h3>
              <p className="text-stone-600">Agriculture – UAS Bangalore</p>
            </div>

          </div>

        </div>

      </section>


      {/* PRODUCTS */}

      <section className="bg-white py-20">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-semibold text-center">
            Our Products
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">

            {products.map((p)=> (

              <div key={p.name} className="p-8 bg-stone-50 rounded-2xl shadow hover:shadow-lg transition">

                <h3 className="text-xl font-semibold">
                  {p.name}
                </h3>

                <p className="mt-4 text-stone-600">
                  {p.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* CONTACT CTA */}

      <section className="py-20">

        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-3xl font-semibold">
            Coming Soon
          </h2>

          <p className="mt-6 text-lg text-stone-600">
            Haywood Mushrooms is preparing to launch premium
            mushroom spawn for growers across North Carolina
            and beyond.
          </p>

          <p className="mt-4 text-lg text-stone-600">
            For early inquiries please contact:
          </p>

          <p className="mt-4 font-semibold">
            info@haywoodmushrooms.com
          </p>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="bg-stone-900 text-white py-10 text-center">

        <p className="text-lg">
          Haywood Mushrooms
        </p>

        <p className="mt-2 text-stone-400">
          Moncure, North Carolina
        </p>

      </footer>


    </main>

  );

}