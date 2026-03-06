export default function Hero() {
  return (
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
          Premium mushroom spawn developed by plant pathologists
        </p>

        <p className="mt-6 text-lg opacity-90">
          Scientifically developed mushroom spawn produced using rigorous
          sterile technique in Cary, North Carolina.
        </p>

      </div>

      <div className="absolute bottom-4 w-full text-center text-sm text-white/80 italic px-4">
        Pink Oyster Mushrooms grown during early cultivation experiments at Haywood Mushrooms.
      </div>

    </section>
  )
}