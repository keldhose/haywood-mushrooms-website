import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";

type HeroPhoto = { imageUrl: string; name: string; scientificName: string };

const FALLBACK_PHOTO: HeroPhoto = {
  imageUrl: "/pink-oyster.png",
  name: "Pink oyster mushroom cluster grown at Haywood Mushrooms",
  scientificName: "Pleurotus djamor",
};

type Slot = { top: string; left: string; width: string; height: string; rotate: string; z: number };

// Scattered "cut photo pinned to a board" placements, one layout per photo
// count so the collage fills the whole container at any count instead of
// just occupying a corner (slicing a 5-photo layout down to 3 left the rest
// of the board empty). Percentages of the collage container.
const SLOT_LAYOUTS: Record<number, Slot[]> = {
  1: [{ top: "6%", left: "10%", width: "78%", height: "86%", rotate: "-2deg", z: 1 }],
  2: [
    { top: "3%", left: "3%", width: "58%", height: "58%", rotate: "-3deg", z: 1 },
    { top: "48%", left: "38%", width: "58%", height: "48%", rotate: "4deg", z: 2 },
  ],
  3: [
    { top: "2%", left: "5%", width: "54%", height: "48%", rotate: "-4deg", z: 2 },
    { top: "30%", left: "46%", width: "50%", height: "44%", rotate: "5deg", z: 3 },
    { top: "58%", left: "9%", width: "52%", height: "40%", rotate: "-3deg", z: 1 },
  ],
  4: [
    { top: "2%", left: "3%", width: "48%", height: "42%", rotate: "-4deg", z: 2 },
    { top: "0%", left: "50%", width: "46%", height: "38%", rotate: "5deg", z: 1 },
    { top: "56%", left: "36%", width: "48%", height: "42%", rotate: "-3deg", z: 4 },
    { top: "40%", left: "2%", width: "42%", height: "38%", rotate: "4deg", z: 3 },
  ],
  5: [
    { top: "6%", left: "3%", width: "54%", height: "56%", rotate: "-3deg", z: 3 },
    { top: "0%", left: "55%", width: "40%", height: "34%", rotate: "5deg", z: 2 },
    { top: "40%", left: "60%", width: "37%", height: "36%", rotate: "-4deg", z: 4 },
    { top: "65%", left: "8%", width: "34%", height: "30%", rotate: "4deg", z: 1 },
    { top: "34%", left: "31%", width: "27%", height: "25%", rotate: "-8deg", z: 5 },
  ],
};
const MAX_PHOTOS = 5;

export default async function Hero() {
  const products = await getAllProducts();
  const photos: HeroPhoto[] = products
    .filter((p) => p.imageUrl)
    .slice(0, MAX_PHOTOS)
    .map((p) => ({ imageUrl: p.imageUrl, name: p.name, scientificName: p.scientificName }));

  if (photos.length === 0) {
    photos.push(FALLBACK_PHOTO);
  }

  const slots = SLOT_LAYOUTS[photos.length];

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
            href="/shop"
            className="inline-flex items-center gap-[9px] rounded-[2px] bg-brass px-[22px] py-[13px] text-[14.5px] font-semibold text-forest-deep transition hover:brightness-[1.06]"
          >
            Shop now <span className="font-mono">→</span>
          </Link>
          <Link
            href="/#science"
            className="inline-flex items-center gap-[9px] rounded-[2px] border border-forest px-[22px] py-[13px] text-[14.5px] font-semibold text-forest transition hover:bg-forest hover:text-paper"
          >
            See the science
          </Link>
        </div>
      </div>

      <div
        className="relative h-[64vh] overflow-hidden bg-[#22140f] bg-cover bg-center md:h-auto"
        style={{ backgroundImage: "url(/grain-substrate.jpg)" }}
      >
        <div className="absolute inset-0 bg-[#1a1108]/72" />
        {photos.map((photo, i) => {
          const slot = slots[i];
          return (
            <div
              key={photo.imageUrl}
              className="absolute overflow-hidden rounded-[2px] border-[3px] border-[#fbfaf7] shadow-[0_10px_28px_rgba(0,0,0,0.4)]"
              style={{
                top: slot.top,
                left: slot.left,
                width: slot.width,
                height: slot.height,
                transform: `rotate(${slot.rotate})`,
                zIndex: slot.z,
              }}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.name}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              {i === 0 && (
                <div className="absolute bottom-2 left-2 right-2 rounded-[2px] bg-[rgba(20,20,18,0.5)] px-[10px] py-[6px] font-mono text-[10px] text-white/90 backdrop-blur-md">
                  {photo.scientificName} — {photo.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
