import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink px-6 pb-10 pt-20 text-cream md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/haywood-mark.png" alt="" width={44} height={44} className="flex-none object-contain" />
              <span>
                <span className="block font-serif text-[23px] leading-none tracking-[0.01em] text-cream">
                  Haywood Mushrooms
                </span>
                <span className="mt-[3px] block font-mono text-[9.5px] uppercase tracking-[0.26em] text-white/50">
                  Spawn Laboratory
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-[30em] text-[13.5px] leading-[1.55] text-white/55">
              Premium mushroom spawn and fungal cultures, developed with plant-pathology rigor in North Carolina.
            </p>
          </div>

          <div>
            <h5 className="mb-[18px] font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brass">
              Explore
            </h5>
            <Link href="/#science" className="block py-[5px] text-[14.5px] text-white/70 hover:text-brass">
              Science
            </Link>
            <Link href="/strains" className="block py-[5px] text-[14.5px] text-white/70 hover:text-brass">
              Strains
            </Link>
            <Link href="/blog" className="block py-[5px] text-[14.5px] text-white/70 hover:text-brass">
              Grow Guides
            </Link>
          </div>

          <div>
            <h5 className="mb-[18px] font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brass">
              Company
            </h5>
            <Link href="/#request" className="block py-[5px] text-[14.5px] text-white/70 hover:text-brass">
              Request spawn
            </Link>
            <Link href="/contact" className="block py-[5px] text-[14.5px] text-white/70 hover:text-brass">
              Contact
            </Link>
            <Link href="/#science" className="block py-[5px] text-[14.5px] text-white/70 hover:text-brass">
              Our method
            </Link>
          </div>

          <div>
            <h5 className="mb-[18px] font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brass">
              Reach us
            </h5>
            <a href="mailto:info@haywoodmushrooms.com" className="block py-[5px] text-[14.5px] text-white/70 hover:text-brass">
              info@haywoodmushrooms.com
            </a>
            <span className="block py-[5px] text-[14.5px] text-white/70">Cary · research lab</span>
            <span className="block py-[5px] text-[14.5px] text-white/70">Moncure · production</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-8 font-mono text-[11.5px] tracking-[0.06em] text-white/45">
          <span>© {new Date().getFullYear()} Haywood Mushrooms. All rights reserved.</span>
          <span>Cary + Moncure, North Carolina</span>
        </div>
      </div>
    </footer>
  );
}
