import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid min-h-[calc(100vh-78px)] grid-cols-1 md:grid-cols-[1.02fr_0.98fr]">
      <div className="flex flex-col justify-center px-6 py-16 md:px-[72px] md:py-0">
        <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">
          Plant-pathology-led spawn laboratory
        </span>
        <h1 className="mt-6 text-[clamp(44px,5.6vw,82px)] leading-[1.05] tracking-[-0.025em]">
          Spawn engineered with a <em className="font-serif italic text-forest">scientist&apos;s</em> precision.
        </h1>
        <p className="mt-6 max-w-[30em] text-[20px] leading-[1.55] text-muted">
          We isolate, screen, and multiply high-vigor mushroom cultures under strict sterile technique — so growers start clean, colonize fast, and harvest with confidence.
        </p>
        <div className="mt-9 flex flex-wrap gap-3.5">
          <Link
            href="/#request"
            className="inline-flex items-center gap-[9px] rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06]"
          >
            Request spawn <span className="font-mono">→</span>
          </Link>
          <Link
            href="/#science"
            className="inline-flex items-center gap-[9px] rounded-[2px] border border-forest px-[22px] py-[13px] text-[14.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
          >
            See the science
          </Link>
        </div>
      </div>

      <div className="relative h-[56vh] overflow-hidden bg-[#22140f] md:h-auto">
        <Image
          src="/pink-oyster.png"
          alt="Pink oyster mushroom cluster grown at Haywood Mushrooms"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute bottom-5 left-5 right-5 rounded-[2px] bg-[rgba(20,20,18,0.42)] px-[13px] py-[9px] font-mono text-[11px] text-white/90 backdrop-blur-md">
          Pleurotus djamor — pink oyster raised from a Haywood culture line, Cary NC.
        </div>
      </div>
    </section>
  );
}
