import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Strains | Haywood Mushrooms",
  description:
    "Culture lines Haywood Mushrooms is developing and cultivating, from tropical oysters to shiitake, each isolated on agar and screened for vigor.",
};

const strains = [
  {
    name: "Pink Oyster",
    scientific: "Pleurotus djamor",
    image: "/pink-oyster.png",
    desc: "A tropical oyster that fruits in vivid coral clusters and moves fast — often the quickest way from inoculation to harvest. Loves warmth, rewards humidity, and makes an unmistakable market display.",
    specs: { colonization: "Ultra-fast", temp: "70–85°F", yield: "High", difficulty: "Easy" },
  },
  {
    name: "Grey Oyster",
    scientific: "Pleurotus ostreatus",
    image: "/grey-oyster-harvest.jpg",
    desc: "The commercial standard for a reason — aggressive colonization, forgiving across substrates, and thick, meaty caps. A dependable base for any production room and the easiest strain to keep contamination-free.",
    specs: { colonization: "Aggressive", temp: "55–75°F", yield: "Very high", difficulty: "Easy" },
  },
  {
    name: "Blue Oyster",
    scientific: "Pleurotus ostreatus var.",
    image: "/oyster-grow-bag.jpg",
    desc: "A cool-weather oyster with steel-blue young caps that fade to silver-grey. Prized for firm texture and clean flavor, and a strong performer through the colder months of the growing calendar.",
    specs: { colonization: "Fast", temp: "50–70°F", yield: "High", difficulty: "Easy" },
  },
  {
    name: "Lion's Mane",
    scientific: "Hericium erinaceus",
    image: "/lions-mane.jpg",
    desc: "A gourmet and functional favorite that fruits as dense, cascading white icicles. Selected for vigorous mycelium and clean fruiting — more technique-sensitive than oysters, and worth it.",
    specs: { colonization: "Steady", temp: "60–75°F", yield: "High", difficulty: "Moderate" },
  },
  {
    name: "Shiitake",
    scientific: "Lentinula edodes",
    image: null,
    desc: "The classic hardwood mushroom — deep umami, firm texture, and a loyal market. Slower to colonize and fruit than oysters, with a browning-then-fruiting cycle that rewards patient, controlled conditions.",
    specs: { colonization: "Slow", temp: "55–70°F", yield: "Moderate", difficulty: "Advanced" },
  },
];

export default function StrainsPage() {
  return (
    <main>
      <header className="px-6 pb-16 pt-24 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Haywood Mushrooms / Strains
          </div>
          <h1 className="mt-[22px] max-w-[14em] text-[clamp(40px,5.4vw,74px)] leading-[1.05] tracking-[-0.025em]">
            Culture lines we <em className="font-serif italic text-forest">develop</em> and cultivate.
          </h1>
          <p className="mt-[26px] max-w-[34em] text-[20px] leading-[1.55] text-muted">
            Each strain below is under active development in our lab — isolated on agar, screened for vigor, and selected for real-world growing conditions. Specs are working targets from our own cultivation, not marketing numbers.
          </p>
        </div>
      </header>

      <section className="px-6 pb-[76px] md:px-10 md:pb-[120px]">
        <div className="mx-auto max-w-[1200px]">
          {strains.map((strain, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={strain.name}
                className={`grid grid-cols-1 items-center gap-9 border-t border-line py-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-16 ${
                  reversed ? "md:grid-cols-[1.1fr_0.9fr]" : ""
                }`}
              >
                <div className={`relative overflow-hidden rounded-[3px] bg-[#1a1512] ${reversed ? "md:order-2" : ""}`}>
                  {strain.image ? (
                    <Image
                      src={strain.image}
                      alt={strain.name}
                      width={600}
                      height={480}
                      className="w-full object-cover"
                      style={{ aspectRatio: "5/4" }}
                    />
                  ) : (
                    <div
                      className="flex w-full flex-col items-center justify-center p-5 text-center font-mono text-[12px] tracking-[0.1em] text-muted"
                      style={{
                        aspectRatio: "5/4",
                        backgroundImage:
                          "repeating-linear-gradient(135deg, #ece9e0, #ece9e0 12px, #e6e2d7 12px, #e6e2d7 24px)",
                      }}
                    >
                      [ PHOTO ]<br />Shiitake fruiting block<br />— to be supplied
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-[2px] bg-cream/90 px-[11px] py-[6px] font-mono text-[10px] uppercase tracking-[0.16em] text-forest">
                    In development
                  </span>
                </div>

                <div>
                  <div className="font-serif text-[clamp(34px,4vw,52px)] tracking-[-0.02em] text-ink">
                    {strain.name}
                  </div>
                  <div className="mt-2 font-mono text-[13px] tracking-[0.02em] text-brass">{strain.scientific}</div>
                  <p className="mt-[22px] max-w-[34em] text-[17px] leading-[1.6] text-muted">{strain.desc}</p>

                  <div className="mt-[30px] grid grid-cols-2 gap-2.5 border-t border-line pt-[26px] sm:grid-cols-4">
                    <div>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Colonization</div>
                      <div className="mt-1.5 font-serif text-[22px] text-ink">{strain.specs.colonization}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Fruiting temp</div>
                      <div className="mt-1.5 font-serif text-[22px] text-ink">{strain.specs.temp}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Yield</div>
                      <div className="mt-1.5 font-serif text-[22px] text-ink">{strain.specs.yield}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Difficulty</div>
                      <div className="mt-1.5 font-serif text-[22px] text-ink">{strain.specs.difficulty}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-forest-deep px-6 py-24 text-cream md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">Pre-orders open</span>
          <h2 className="mt-4 max-w-[16em] text-[clamp(30px,3.4vw,44px)] text-cream">
            Want a line reserved as it comes online?
          </h2>
          <p className="mt-5 max-w-[34em] text-[17px] text-cream/70">
            Tell us which strains fit your operation and we&apos;ll flag availability and timing the moment they&apos;re ready.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3.5">
            <Link
              href="/contact"
              className="inline-flex items-center gap-[9px] rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06]"
            >
              Request spawn <span className="font-mono">→</span>
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-[9px] rounded-[2px] border border-white/30 px-[22px] py-[13px] text-[14.5px] font-semibold text-cream transition hover:bg-forest"
            >
              Read the grow guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
