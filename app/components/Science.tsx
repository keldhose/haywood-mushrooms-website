export default function Science() {
  const credentials = [
    { title: "PhD", field: "Plant Pathology", school: "NC State University" },
    { title: "MS", field: "Plant Pathology", school: "University of Georgia" },
    { title: "BSc", field: "Agriculture", school: "UAS Bangalore" }
  ];

  return (
    <section id="science" className="py-24 bg-stone-50 border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight">
            Built on Plant Pathology & Fungal Science
          </h2>
          <div className="mt-4 h-1 w-20 bg-green-700 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: The "Why" */}
          <div className="space-y-6">
            <p className="text-xl text-stone-700 leading-relaxed">
              Our approach to mushroom spawn production is grounded in professional
              training in plant pathology and years of experience studying fungi and
              plant–microbe interactions.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              We apply rigorous sterile technique, strain selection, and quality
              control to ensure growers receive reliable cultures and consistent
              results. By leveraging a scientific foundation, we minimize 
              contamination risks and maximize biological vigor.
            </p>
            
            {/* Accreditation/Education Pills */}
            <div className="flex flex-wrap gap-4 pt-4">
              {credentials.map((edu) => (
                <div key={edu.title} className="bg-white border border-stone-200 px-4 py-3 rounded-lg shadow-sm">
                  <span className="block font-bold text-green-800 text-sm">{edu.title}</span>
                  <span className="block text-stone-800 font-medium">{edu.field}</span>
                  <span className="block text-stone-500 text-xs">{edu.school}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lab Standards List */}
          <div className="bg-green-900 text-white p-10 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-6">Laboratory Quality Standards</h3>
            <ul className="space-y-4">
              {[
                "ISO-grade sterile agar culture isolation",
                "Advanced genetic strain selection",
                "HEPA-filtered inoculation environment",
                "Rigorous multi-stage contamination screening",
                "Optimized substrate colonization protocols"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-green-50/90 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}