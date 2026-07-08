import Image from "next/image";
import Link from "next/link";

const strains = [
  {
    name: "Pink Oyster",
    scientific: "Pleurotus djamor",
    image: "/pink-oyster.png",
    desc: "Fast, warm-loving tropical oyster with vivid coral fruiting bodies and a striking short cycle.",
    stats: { growth: "Ultra-fast", temp: "70–85°F", yield: "High" },
  },
  {
    name: "Grey Oyster",
    scientific: "Pleurotus ostreatus",
    image: "/grey-oyster-harvest.jpg",
    desc: "The dependable commercial workhorse — aggressive colonization, thick caps, wide substrate tolerance.",
    stats: { growth: "Aggressive", temp: "55–75°F", yield: "Very high" },
  },
  {
    name: "Lion's Mane",
    scientific: "Hericium erinaceus",
    image: "/lions-mane.jpg",
    desc: "Selected for vigorous mycelium and dense, cascading icicle-like fruiting bodies prized by chefs.",
    stats: { growth: "Steady", temp: "60–75°F", yield: "High" },
  },
];

export default function StrainsPreview() {
  return (
    <section id="strains" className="bg-paper py-[76px] md:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="max-w-[640px]">
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">Strains in development</span>
          <h2 className="mt-[18px] text-[clamp(30px,3.6vw,46px)]">
            Culture lines we&apos;re bringing to growers.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
          {strains.map((strain) => (
            <div
              key={strain.name}
              className="group flex flex-col overflow-hidden rounded-[3px] border border-line bg-paper transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_30px_60px_-30px_rgba(20,35,26,0.28)]"
            >
              <div className="relative h-[260px] overflow-hidden bg-[#1a1512]">
                <Image
                  src={strain.image}
                  alt={strain.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-[2px] bg-cream/90 px-[11px] py-[6px] font-mono text-[10px] uppercase tracking-[0.16em] text-forest">
                  In development
                </span>
              </div>

              <div className="flex flex-1 flex-col p-[26px] pb-7">
                <div className="font-serif text-[26px] text-ink">{strain.name}</div>
                <div className="mt-[5px] font-mono text-[12px] tracking-[0.02em] text-brass">{strain.scientific}</div>
                <p className="mt-4 flex-1 text-[14.5px] leading-[1.5] text-muted">{strain.desc}</p>

                <div className="mt-[22px] grid grid-cols-3 gap-2 border-t border-line pt-5">
                  <div>
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Growth</div>
                    <div className="mt-[3px] text-[14px] font-semibold text-ink">{strain.stats.growth}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Temp</div>
                    <div className="mt-[3px] text-[14px] font-semibold text-ink">{strain.stats.temp}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Yield</div>
                    <div className="mt-[3px] text-[14px] font-semibold text-ink">{strain.stats.yield}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/strains"
            className="inline-flex items-center gap-[9px] rounded-[2px] border border-forest px-[22px] py-[13px] text-[14.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
          >
            View all strains <span className="font-mono">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
