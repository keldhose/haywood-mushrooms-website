export default function LabSection() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/agar-cultures.jpg"
          alt="Agar cultures and fungal lab work"
          className="rounded-xl shadow-lg w-full"
        />

        <div>
          <h2 className="text-3xl font-semibold">
            Laboratory Quality Standards
          </h2>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Cultures are maintained using sterile laboratory techniques,
            including agar isolation, culture transfer, and controlled
            expansion of selected fungal strains.
          </p>

          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="bg-white p-4 rounded-lg shadow">
              Sterile agar culture isolation
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              Controlled strain selection
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              Quality-focused lab workflow
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}