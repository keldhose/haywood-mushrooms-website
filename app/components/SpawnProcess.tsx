export default function SpawnProcess() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center">
          Our Spawn Production Process
        </h2>

        <p className="mt-6 text-lg text-stone-600 max-w-3xl mx-auto text-center">
          Professional mushroom spawn production follows a carefully controlled
          workflow to ensure purity, vigor, and reliable cultivation
          performance.
        </p>

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
            className="rounded-xl shadow-lg max-w-xl w-full"
          />
        </div>
      </div>
    </section>
  );
}