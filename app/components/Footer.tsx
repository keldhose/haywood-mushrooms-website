export default function Footer() {
  return (
    <>
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold">Coming Soon</h2>

          <p className="mt-6 text-lg text-stone-600">
            Haywood Mushrooms is preparing to launch premium mushroom spawn for
            growers across North Carolina and beyond.
          </p>

          <p className="mt-4 font-semibold">info@haywoodmushrooms.com</p>
        </div>
      </section>

      <footer className="bg-stone-900 text-white py-10 text-center">
        <p className="font-semibold">Haywood Mushrooms</p>
        <p className="text-stone-400 mt-2">
          Cary research operations · Moncure cultivation expansion
        </p>
      </footer>
    </>
  );
}