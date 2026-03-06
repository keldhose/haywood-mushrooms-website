export default function Species() {

  const species = [
    "Blue Oyster",
    "Gray Oyster",
    "Pink Oyster",
    "Lion's Mane",
    "Shiitake"
  ]

  return (
    <section className="py-20 bg-white">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-semibold">
          Cultures & Spawn We Produce
        </h2>

        <div className="grid md:grid-cols-5 gap-6 mt-12">

          {species.map((s) => (
            <div key={s} className="bg-stone-50 p-6 rounded-xl shadow">
              <h3 className="font-semibold">{s}</h3>
            </div>
          ))}

        </div>

      </div>

    </section>
  )
}