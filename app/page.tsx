export default function HaywoodMushroomsHomepage() {

  const products = [
    {
      name: "Lion's Mane Liquid Culture",
      desc: "Fast-colonizing lion's mane culture ideal for gourmet mushroom growers and specialty farms."
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

      {/* NAVBAR */}

      <nav className="w-full bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Haywood Mushrooms" className="h-10 w-auto" />
            <span className="text-xl font-bold text-emerald-900">Haywood Mushrooms</span>
          </div>

          <div className="flex gap-6 text-sm font-medium">
            <a href="#home" className="hover:text-emerald-800">Home</a>
            <a href="#science" className="hover:text-emerald-800">Science</a>
            <a href="#products" className="hover:text-emerald-800">Products</a>
            <a href="#contact" className="hover:text-emerald-800">Contact</a>
          </div>

        </div>
      </nav>


      {/* HERO */}

      <section className="relative h-[75vh] flex items-center justify-center text-center text-white">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/pink-oyster.png')" }}
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-3xl px-6">

          <h1 className="text-5xl md:text-6xl font-bold">
            Haywood Mushrooms
          </h1>

          <p className="mt-4 text-xl">
            Premium spawn developed by plant pathologists
          </p>

          <p className="mt-6 text-lg opacity-90">
            Scientifically developed mushroom spawn produced with
            rigorous sterile technique in Moncure, North Carolina.
          </p>

        </div>

        {/* Photo Caption */}
        <div className="absolute bottom-4 w-full text-center text-sm text-white/80 italic px-4">
          Pink Oyster Mushrooms grown during early cultivation experiments at Haywood Mushrooms.
        </div>

      </section>


      {/* ORIGIN STORY */}}

      <section className="bg-white py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Our Origin
          </h2>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Haywood Mushrooms began with the purchase of agricultural land in
            Moncure, North Carolina. What started as a plan for a small orchard
            and herb garden evolved into a focused mushroom spawn business
            built around deep fungal science expertise.
          </p>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Combining scientific training in plant pathology with engineering
            systems thinking, we aim to produce reliable, clean, and
            high‑quality mushroom spawn for growers across North Carolina
            and beyond.
          </p>

        </div>

      </section>


      {/* SCIENCE SECTION */}

      <section id="science" className="py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Built on fungal science
          </h2>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Our approach to mushroom spawn production is grounded in
            professional training in plant pathology and years of experience
            studying fungi and plant‑microbe interactions.
          </p>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            We apply rigorous sterile technique, strain selection, and
            quality control to ensure growers receive reliable cultures
            and consistent results.
          </p>

        </div>

      </section>


      {/* FOUNDER CREDENTIALS */}

      <section className="bg-white py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Scientific Leadership
          </h2>

          <p className="mt-6 text-lg text-stone-600">
            Dr. Anna Thomas leads the scientific development of
            Haywood Mushrooms.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6 text-left">

            <div className="bg-stone-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold">PhD</h3>
              <p className="text-stone-600">Plant Pathology — NC State University</p>
            </div>

            <div className="bg-stone-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold">MS</h3>
              <p className="text-stone-600">Plant Pathology — University of Georgia</p>
            </div>

            <div className="bg-stone-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold">BSc</h3>
              <p className="text-stone-600">Agriculture — UAS Bangalore</p>
            </div>

          </div>

        </div>

      </section>


      {/* LAB QUALITY SECTION */}

      <section className="py-20">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Laboratory Quality Standards
          </h2>

          <p className="mt-6 text-lg text-stone-600 max-w-3xl mx-auto">
            Every culture produced by Haywood Mushrooms is developed
            using careful sterile technique, controlled laboratory
            conditions, and scientific strain management.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">

            <div className="p-8 bg-white rounded-2xl shadow">
              <h3 className="font-semibold">Sterile Technique</h3>
              <p className="mt-3 text-stone-600">Laminar flow hood and laboratory procedures reduce contamination risk.</p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow">
              <h3 className="font-semibold">Strain Selection</h3>
              <p className="mt-3 text-stone-600">High‑performance strains selected for reliability and yield.</p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow">
              <h3 className="font-semibold">Quality Control</h3>
              <p className="mt-3 text-stone-600">Each culture batch is monitored for vigor and purity.</p>
            </div>

          </div>

        </div>

      </section>


      {/* PRODUCTS */}

      <section id="products" className="bg-white py-20">

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


      {/* CONTACT */}

      <section id="contact" className="py-20">

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

        <p className="text-lg font-semibold">
          Haywood Mushrooms
        </p>

        <p className="mt-2 text-stone-400">
          Moncure, North Carolina
        </p>

      </footer>


    </main>

  );

}
