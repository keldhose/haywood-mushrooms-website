const credentials = [
  { degree: "PhD", field: "Plant Pathology", school: "NC State University" },
  { degree: "MS", field: "Plant Pathology", school: "University of Georgia" },
  { degree: "BSc", field: "Agriculture", school: "UAS Bangalore" },
];

const checklist = [
  {
    title: "Sterile agar culture isolation",
    desc: "Pure lines started and maintained on plates for genetic stability.",
  },
  {
    title: "Deliberate strain selection",
    desc: "Lines chosen for colonization speed, resilience, and fruiting quality.",
  },
  {
    title: "Controlled inoculation environment",
    desc: "Transfers performed in a filtered, still-air workspace.",
  },
  {
    title: "Multi-stage contamination screening",
    desc: "Cultures held and inspected before they're cleared for growers.",
  },
];

export default function Science() {
  return (
    <section id="science" className="bg-paper py-[76px] md:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-11 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">The science</span>
            <h2 className="mt-[18px] text-[clamp(30px,3.6vw,46px)]">
              Grown from plant pathology, not guesswork.
            </h2>
            <p className="mt-6 max-w-[34em] text-[20px] leading-[1.55] text-muted">
              Most spawn fails for one reason: contamination that was invisible until it wasn&apos;t. Our work starts upstream of that — in the discipline of diagnosing and controlling fungal and microbial disease.
            </p>
            <p className="mt-[18px] max-w-[32em] text-[16px] text-muted">
              We apply the same rigor to cultures we serve growers: clean isolation on agar, deliberate strain selection, periodic transfer to hold vigor, and multi-stage screening before anything leaves the lab.
            </p>
            <div className="mt-[34px] flex flex-wrap gap-3">
              {credentials.map((c) => (
                <div key={c.degree} className="rounded-[2px] border border-line bg-paper px-[18px] py-[14px]">
                  <div className="font-serif text-[22px] leading-none text-forest">{c.degree}</div>
                  <div className="mt-1 text-[14px] font-semibold">{c.field}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-muted">{c.school}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {checklist.map((item, i) => (
              <div key={item.title} className="flex gap-4 border-t border-line py-4 last:border-b">
                <span className="w-7 flex-none font-mono text-[12px] text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[16px] font-medium">{item.title}</div>
                  <div className="mt-0.5 text-[14px] text-muted">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
