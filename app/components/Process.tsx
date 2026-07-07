const steps = [
  {
    title: "Agar culture",
    desc: "Pure fungal tissue isolated and held on plates for stable genetics.",
  },
  {
    title: "Liquid culture",
    desc: "Proven strains expanded in sterile nutrient broth for fast, even colonization.",
  },
  {
    title: "Grain spawn",
    desc: "Sterilized grain inoculated in a filtered environment and fully colonized.",
  },
  {
    title: "Grower-ready",
    desc: "Vigorous spawn shipped clean, ready to inoculate your production substrate.",
  },
];

export default function Process() {
  return (
    <section className="bg-cream py-[76px] md:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="max-w-[640px]">
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">The workflow</span>
          <h2 className="mt-[18px] text-[clamp(30px,3.6vw,46px)]">
            From a single plate to your grow room.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-0 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`border-b border-line py-[34px] pr-6 lg:border-b-0 lg:pr-[30px] ${
                i % 2 === 0 ? "sm:border-r sm:border-line" : ""
              } ${i < steps.length - 1 ? "lg:border-r lg:border-line" : "lg:pr-0"}`}
            >
              <div className="font-mono text-[13px] tracking-[0.1em] text-brass">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-[22px] font-serif text-[23px] text-ink">{step.title}</div>
              <div className="mt-3 text-[14.5px] leading-[1.5] text-muted">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
