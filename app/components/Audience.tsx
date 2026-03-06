export default function Audience() {
  return (
    <section className="py-20 bg-stone-50">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-semibold">
          Who We Serve
        </h2>

        <p className="mt-6 text-lg text-stone-600 max-w-3xl mx-auto">
          Haywood Mushrooms develops fungal cultures and spawn designed
          to support growers, researchers, and agricultural innovators
          working with gourmet and functional mushrooms.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          <div className="bg-white p-8 rounded-xl shadow">
            <h3 className="font-semibold text-lg">
              Gourmet Mushroom Growers
            </h3>
            <p className="mt-3 text-stone-600">
              Reliable spawn for small farms and commercial mushroom production.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow">
            <h3 className="font-semibold text-lg">
              Researchers & Mycology Labs
            </h3>
            <p className="mt-3 text-stone-600">
              High-quality cultures for fungal research and experimentation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow">
            <h3 className="font-semibold text-lg">
              Agricultural Innovators
            </h3>
            <p className="mt-3 text-stone-600">
              Strains suited for developing new mushroom cultivation systems.
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}