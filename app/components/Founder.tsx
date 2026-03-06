export default function Founder() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="/lab-work.jpg"
          alt="Dr. Anna Thomas working in the lab"
          className="rounded-xl shadow-lg w-full"
        />

        <div>
          <h2 className="text-3xl font-semibold">Scientific Leadership</h2>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Dr. Anna Thomas leads the scientific development of Haywood
            Mushrooms, bringing advanced training in plant pathology and
            extensive experience working with fungi.
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
  );
}