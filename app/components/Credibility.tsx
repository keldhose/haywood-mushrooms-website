const stats = [
  {
    label: "Led by",
    value: "Industry experts",
    detail: "Decades of combined fungal & plant-microbe science",
  },
  {
    label: "Method",
    value: "Sterile agar isolation",
    detail: "Every line screened for purity & vigor before release",
  },
  {
    label: "In development",
    value: "5 gourmet strains",
    detail: "Oyster, lion's mane & shiitake culture lines",
  },
  {
    label: "Based in",
    value: "North Carolina",
    detail: "Cary research lab · Moncure production facility",
  },
];

export default function Credibility() {
  return (
    <section className="bg-forest text-cream">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => {
          const isLeftCol = i % 2 === 0;
          const isTopRow = i < 2;
          const isLastDesktop = i === stats.length - 1;
          return (
          <div
            key={stat.label}
            className={`p-[34px] border-white/10 ${isLeftCol ? "border-r" : ""} ${isTopRow ? "border-b" : ""} md:border-b-0 ${isLastDesktop ? "md:border-r-0" : "md:border-r"}`}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">{stat.label}</div>
            <div className="mt-3 font-serif text-[26px] leading-[1.12] text-cream">{stat.value}</div>
            <div className="mt-[7px] text-[13.5px] text-cream/60">{stat.detail}</div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
