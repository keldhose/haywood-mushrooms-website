export default function Hero() {
  return (
    <section className="relative h-[85vh] flex items-center justify-center text-center text-white overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/pink-oyster.png')" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl px-6">

        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
          Haywood Mushrooms
        </h1>

        <p className="mt-4 text-xl drop-shadow-md">
          Premium mushroom spawn developed by plant pathologists
        </p>

        <p className="mt-6 text-lg opacity-90">
          Scientifically developed mushroom spawn produced using rigorous
          sterile technique in Cary, North Carolina.
        </p>

      </div>

      {/* Caption */}
      <div className="absolute bottom-6 w-full text-center text-sm text-white/80 italic px-4">
        Pink Oyster Mushrooms grown during early cultivation experiments at Haywood Mushrooms.
      </div>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-stone-50"></div>

    </section>
  )
}