export default function LabFeature() {
  return (
    <section className="relative h-[500px] w-full my-20">

      <img
        src="/agar-cultures.jpg"
        alt="Fungal cultures on agar plates"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative h-full flex items-center justify-center text-center text-white px-6">

        <div className="max-w-3xl">

          <h2 className="text-4xl md:text-5xl font-semibold">
            Fungal Cultures Developed With Laboratory Precision
          </h2>

          <p className="mt-6 text-lg opacity-90">
            Sterile agar culture isolation and strain selection form the
            scientific foundation of reliable mushroom spawn production.
          </p>

        </div>

      </div>

    </section>
  )
}