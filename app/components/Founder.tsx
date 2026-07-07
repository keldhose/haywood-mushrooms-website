import Image from "next/image";

export default function Founder() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <Image
          src="/lab-work.jpg"
          alt="Dr. Anna Thomas working in the lab"
          width={752}
          height={576}
          className="rounded-xl shadow-lg w-full h-auto"
        />

        <div>
          <h2 className="text-3xl font-semibold">Scientific Leadership</h2>

          <p className="mt-6 text-lg text-stone-600 leading-relaxed">
            Dr. Anna Thomas leads the scientific development of Haywood
            Mushrooms, bringing advanced training in plant pathology and
            extensive experience working with fungi.
          </p>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-800">
            PhD, Plant Pathology — NC State University
          </p>
        </div>
      </div>
    </section>
  );
}