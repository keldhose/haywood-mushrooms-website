import Image from "next/image";

export default function Founder() {
  return (
    <section className="bg-paper py-[76px] md:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-11 md:grid-cols-2 md:gap-[72px]">
          <div>
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">Scientific leadership</span>
            <blockquote className="mt-[22px] font-serif text-[clamp(24px,2.6vw,34px)] italic leading-[1.28] tracking-[-0.01em] text-ink">
              &ldquo;I spent years learning how fungi behave, spread, and fail. Haywood is that knowledge turned toward helping people grow — starting with cultures I&apos;d trust on my own bench.&rdquo;
            </blockquote>
            <div className="mt-[26px] flex items-center gap-3.5">
              <span className="h-px w-[34px] bg-brass" />
              <div>
                <div className="text-[15px] font-bold">Dr. Anna Thomas</div>
                <div className="mt-0.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted">
                  Founder · PhD Plant Pathology, NC State
                </div>
              </div>
            </div>
          </div>

          <Image
            src="/lab-work.jpg"
            alt="Dr. Anna Thomas pouring cultures at a still-air workspace"
            width={752}
            height={576}
            className="w-full rounded-[3px] object-cover"
            style={{ aspectRatio: "4/3" }}
          />
        </div>
      </div>
    </section>
  );
}
