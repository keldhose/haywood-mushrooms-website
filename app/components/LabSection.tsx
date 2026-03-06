import Image from "next/image";

export default function LabSection() {
  const steps = [
    { 
      title: "Agar Culture", 
      desc: "Pure fungal cultures isolated and maintained on agar plates for genetic stability." 
    },
    { 
      title: "Liquid Culture", 
      desc: "Selected strains expanded in sterile liquid nutrient broth for rapid colonization." 
    },
    { 
      title: "Grain Spawn", 
      desc: "Sterilized grains inoculated with liquid culture in a HEPA-filtered environment." 
    },
    { 
      title: "Grower Substrate", 
      desc: "Final colonized spawn ready to inoculate production substrates for the grower." 
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Top: Lab Standards */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative group">
            <Image
              src="/agar-cultures.jpg"
              alt="Agar cultures and fungal lab work"
              width={600}
              height={450}
              className="rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Subtle Lab Label Overlay */}
            <div className="absolute -bottom-4 -right-4 bg-green-900 text-white px-6 py-4 rounded-xl shadow-lg">
              <span className="text-xs uppercase tracking-widest font-bold opacity-70">Lab Status</span>
              <p className="font-semibold text-sm">Sterile Grade / ISO-Ready</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-stone-900 tracking-tight">
              Laboratory Quality Standards
            </h2>

            <p className="mt-6 text-lg text-stone-600 leading-relaxed">
              Our cultures are maintained using rigorous plant pathology protocols. 
              This includes agar isolation for strain purity, periodic culture transfer 
              to maintain vigor, and controlled expansion under strictly monitored conditions.
            </p>

            <div className="space-y-4 mt-10">
              {[
                "Sterile agar culture isolation",
                "Controlled strain selection",
                "Quality-focused lab workflow"
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <div className="h-2 w-2 rounded-full bg-green-700"></div>
                  <span className="font-medium text-stone-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: The Workflow Timeline */}
        <div className="pt-16 border-t border-stone-100">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-stone-900 uppercase tracking-widest">Spawn Production Workflow</h3>
            <p className="text-stone-500 mt-2 text-sm">A professional path from laboratory to farm</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative p-6 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="absolute -top-4 left-6 bg-white border border-stone-200 text-green-800 font-black px-3 py-1 rounded-full text-sm">
                  0{index + 1}
                </span>
                <h4 className="mt-2 font-bold text-stone-900 text-lg">{step.title}</h4>
                <p className="mt-3 text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}