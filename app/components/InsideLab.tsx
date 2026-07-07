import Image from "next/image";

export default function InsideLab() {
  return (
    <section className="bg-cream py-[76px] md:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-11 md:grid-cols-2 md:gap-[72px]">
          <div className="relative">
            <Image
              src="/agar-cultures.jpg"
              alt="Agar plates and culture tubes on a lab tray"
              width={600}
              height={450}
              className="w-full rounded-[3px] object-cover"
              style={{ aspectRatio: "4/3" }}
            />
            <div className="absolute -bottom-[22px] -right-[18px] rounded-[2px] bg-forest-deep px-5 py-4 text-cream shadow-[0_20px_40px_-18px_rgba(20,35,26,0.5)]">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">Lab status</div>
              <div className="mt-[5px] font-serif text-[19px]">Sterile grade · ISO-ready</div>
            </div>
          </div>

          <div>
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-brass">Inside the lab</span>
            <h2 className="mt-[18px] text-[clamp(30px,3.6vw,46px)]">
              Purity you can trace to the plate.
            </h2>
            <p className="mt-6 max-w-[34em] text-[20px] leading-[1.55] text-muted">
              Cultures begin as isolated tissue on agar and are advanced only after they prove clean and vigorous. Tubes of nutrient broth and stacked plates aren&apos;t props here — they&apos;re the working record of every line we keep.
            </p>
            <p className="mt-[18px] max-w-[32em] text-[16px] text-muted">
              Nothing moves to grain spawn until it earns it. That discipline is why our growers open a bag to healthy, aggressive mycelium instead of a diagnosis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
