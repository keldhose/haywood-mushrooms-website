const audiences = [
  {
    title: "Gourmet growers",
    desc: "Reliable, clean spawn for small farms and commercial fruiting rooms that can't afford a bad flush.",
  },
  {
    title: "Researchers & labs",
    desc: "Traceable, well-characterized cultures for mycology research and controlled experimentation.",
  },
  {
    title: "Agricultural innovators",
    desc: "Strains and support for teams developing new cultivation systems and functional-mushroom products.",
  },
];

export default function Audience() {
  return (
    <section className="bg-cream py-[76px] md:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="max-w-[640px]">
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">Who we serve</span>
          <h2 className="mt-[18px] text-[clamp(30px,3.6vw,46px)]">
            Built for people who grow seriously.
          </h2>
        </div>

        <div className="mt-[52px] overflow-hidden rounded-[3px] border border-line bg-paper md:grid md:grid-cols-3">
          {audiences.map((a, i) => (
            <div
              key={a.title}
              className={`border-b border-line p-9 md:border-b-0 ${
                i < audiences.length - 1 ? "md:border-r" : ""
              }`}
            >
              <div className="font-mono text-[12px] text-brass">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-5 font-serif text-[25px] text-ink">{a.title}</div>
              <p className="mt-3 text-[14.5px] leading-[1.5] text-muted">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
