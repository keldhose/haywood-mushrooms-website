export default function Home() {

  const products = [
    {
      name: "Lion's Mane Spawn",
      image: "/lions-mane.jpg",
      desc: "Hericium erinaceus strain selected for vigorous growth and dense fruiting."
    },
    {
      name: "Grey Oyster Spawn",
      image: "/grey-oyster-harvest.jpg",
      desc: "Reliable oyster variety known for aggressive colonization and consistent yields."
    },
    {
      name: "Pink Oyster Spawn",
      image: "/pink-oyster-hero.jpg",
      desc: "Fast growing tropical oyster strain with beautiful coral-colored fruiting bodies."
    }
  ];

  return (

    <main className="min-h-screen bg-stone-50 text-stone-900">

      {/* NAVBAR */}

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



      {/* HERO */}

      <section className="relative h-[75vh] flex items-center justify-center text-center text-white">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/pink-oyster-hero.jpg')" }}
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

        <div className="absolute bottom-4 w-full text-center text-sm text-white/80 italic px-4">
          Pink Oyster Mushrooms grown during early cultivation experiments at Haywood Mushrooms.
        </div>

      </section>



      {/* CREDIBILITY STRIP */}

      <section className="bg-emerald-900 text-white py-10">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">

          <div>
            <h3 className="font-semibold text-lg">Scientific Expertise</h3>
            <p className="mt-2 text-emerald-100">
              PhD Plant Pathology — NC State University
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Laboratory Production</h3>
            <p className="mt-2 text-emerald-100">
              Sterile technique and controlled culture development
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">North Carolina Based</h3>
            <p className="mt-2 text-emerald-100">
              Spawn production rooted in Moncure agricultural land
            </p>
          </div>

        </div>

      </section>



      {/* ORIGIN */}

      <section className="bg-white py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Our Origin
          </h2>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Haywood Mushrooms began with the purchase of agricultural
            land in Moncure, North Carolina. What started as a plan
            for a small orchard and herb garden evolved into a focused
            mushroom spawn business built around deep fungal science
            expertise.
          </p>

        </div>

      </section>



      {/* SCIENCE */}

      <section id="science" className="py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold">
            Built on fungal science
          </h2>

          <p className="mt-6 text-lg text-stone-600">
            Our spawn production approach is grounded in scientific
            training in plant pathology and years of experience
            studying fungi and plant-microbe interactions.
          </p>

        </div>

      </section>



      {/* FOUNDER */}

      <section className="bg-white py-20">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <img
            src="/lab-work.jpg"
            alt="Dr Anna Thomas working in lab"
            className="rounded-xl shadow-lg"
          />

          <div>

            <h2 className="text-3xl font-semibold">
              Scientific Leadership
            </h2>

            <p className="mt-6 text-lg text-stone-600">
              Dr. Anna Thomas leads the scientific development of
              Haywood Mushrooms.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-8">

              <div className="bg-stone-50 p-4 rounded-lg shadow">
                PhD — Plant Pathology, NC State University
              </div>

              <div className="bg-stone-50 p-4 rounded-lg shadow">
                MS — Plant Pathology, University of Georgia
              </div>

              <div className="bg-stone-50 p-4 rounded-lg shadow">
                BSc — Agriculture, UAS Bangalore
              </div>

            </div>

          </div>

        </div>

      </section>



      {/* LAB QUALITY */}

      <section className="py-20">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <img
            src="/agar-cultures.jpg"
            alt="Agar cultures and fungal lab work"
            className="rounded-xl shadow-lg"
          />

          <div>

            <h2 className="text-3xl font-semibold">
              Laboratory Quality Standards
            </h2>

            <p className="mt-6 text-stone-600 text-lg">
              Cultures are maintained using sterile laboratory
              techniques including agar culture isolation and
              controlled expansion of selected fungal strains.
            </p>

          </div>

        </div>

      </section>



      {/* SPAWN PROCESS */}

      <section className="bg-white py-20">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-semibold text-center">
            Our Spawn Production Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mt-12 text-center">

            <div className="bg-stone-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold">Agar Culture</h3>
              <p className="text-stone-600 mt-2">
                Pure fungal cultures isolated and maintained on agar plates.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold">Liquid Culture</h3>
              <p className="text-stone-600 mt-2">
                Selected strains expanded in sterile liquid culture.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold">Grain Spawn</h3>
              <p className="text-stone-600 mt-2">
                Cultures transferred to sterilized grain for colonization.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold">Grower Substrate</h3>
              <p className="text-stone-600 mt-2">
                Spawn used to inoculate production substrates.
              </p>
            </div>

          </div>

          <div className="mt-12 flex justify-center">

            <img
              src="/oyster-grow-bag.jpg"
              alt="Oyster mushrooms growing from substrate bag"
              className="rounded-xl shadow-lg max-w-xl"
            />

          </div>

        </div>

      </section>



      {/* PRODUCTS */}

      <section id="products" className="py-20">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-semibold text-center">
            Our Products
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-12">

            {products.map((p)=> (

              <div key={p.name} className="bg-white rounded-xl shadow overflow-hidden">

                <img src={p.image} className="h-60 w-full object-cover"/>

                <div className="p-6">

                  <h3 className="text-xl font-semibold">
                    {p.name}
                  </h3>

                  <p className="mt-3 text-stone-600">
                    {p.desc}
                  </p>

                </div>

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
            Haywood Mushrooms is preparing to launch premium mushroom
            spawn for growers across North Carolina and beyond.
          </p>

          <p className="mt-4 font-semibold">
            info@haywoodmushrooms.com
          </p>

        </div>

      </section>



      {/* FOOTER */}

      <footer className="bg-stone-900 text-white py-10 text-center">

        <p className="font-semibold">
          Haywood Mushrooms
        </p>

        <p className="text-stone-400 mt-2">
          Moncure, North Carolina
        </p>

      </footer>

    </main>

  );
}