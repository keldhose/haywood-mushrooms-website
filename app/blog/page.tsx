import Image from "next/image";
import Link from "next/link";
import { posts } from "./posts";
import NewsletterSignup from "../components/NewsletterSignup";

export const metadata = {
  title: "Grow Guides | Haywood Mushrooms",
  description:
    "Practical, science-backed guidance on running clean cultures and healthy grows, written by a plant pathologist.",
};

const comingSoon = [
  {
    title: "Fruiting conditions, strain by strain",
    desc: "Temperature, humidity, and fresh-air targets that get each of our lines to pin and flush.",
  },
  {
    title: "From grain spawn to first harvest",
    desc: "A start-to-finish timeline for inoculating production substrate with Haywood spawn.",
  },
  {
    title: "Storing & refreshing cultures",
    desc: "Keeping lines vigorous over time with proper transfer and cold storage.",
  },
];

export default function GrowGuidesPage() {
  const entries = Object.entries(posts);
  const featuredEntry = entries.find(([, post]) => post.featured);
  const libraryEntries = entries.filter(([, post]) => !post.featured);

  return (
    <main>
      <header className="px-6 pb-14 pt-24 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Haywood Mushrooms / Grow Guides
          </div>
          <h1 className="mt-[22px] max-w-[13em] text-[clamp(40px,5.4vw,74px)] leading-[1.05] tracking-[-0.025em]">
            Grow guides from the <em className="font-serif italic text-forest">lab bench</em>.
          </h1>
          <p className="mt-[26px] max-w-[34em] text-[20px] leading-[1.55] text-muted">
            Practical, science-backed guidance on running clean cultures and healthy grows — written by a plant pathologist, for growers who want to understand the &ldquo;why,&rdquo; not just the steps.
          </p>
        </div>
      </header>

      <section className="px-6 pb-[76px] md:px-10 md:pb-[110px]">
        <div className="mx-auto max-w-[1200px]">
          {featuredEntry && (
            <FeaturedCard slug={featuredEntry[0]} post={featuredEntry[1]} />
          )}

          <div className="mb-9 flex flex-wrap items-baseline justify-between gap-2.5 border-t border-line pt-7">
            <h3 className="font-serif text-[26px] text-ink">The library</h3>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              New guides published as we grow
            </span>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {libraryEntries.map(([slug, post], i) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="flex min-h-[230px] flex-col rounded-[3px] border border-line bg-paper p-[30px] transition duration-[250ms] hover:-translate-y-[3px] hover:shadow-[0_26px_52px_-30px_rgba(20,35,26,0.26)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] tracking-[0.1em] text-brass">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{post.tag}</span>
                </div>
                <h4 className="mt-6 font-serif text-[25px] leading-[1.15] text-ink">{post.title}</h4>
                <p className="mt-3.5 flex-1 text-[14.5px] leading-[1.55] text-muted">{post.description}</p>
                <span className="mt-[22px] font-mono text-[12px] tracking-[0.06em] text-forest">Read →</span>
              </Link>
            ))}

            {comingSoon.map((item, i) => (
              <div
                key={item.title}
                className="flex min-h-[230px] flex-col rounded-[3px] border border-line bg-paper p-[30px] opacity-70"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] tracking-[0.1em] text-brass">
                    {String(i + 1 + libraryEntries.length).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Coming soon</span>
                </div>
                <h4 className="mt-6 font-serif text-[25px] leading-[1.15] text-muted">{item.title}</h4>
                <p className="mt-3.5 flex-1 text-[14.5px] leading-[1.55] text-muted">{item.desc}</p>
                <span className="mt-[22px] font-mono text-[12px] tracking-[0.06em] text-muted">In progress</span>
              </div>
            ))}
          </div>

          <NewsletterSignup />
        </div>
      </section>
    </main>
  );
}

function FeaturedCard({ slug, post }: { slug: string; post: (typeof posts)[string] }) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="mb-16 grid grid-cols-1 overflow-hidden rounded-[4px] border border-line bg-paper md:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="relative min-h-[240px] bg-[#1a1512] md:min-h-[340px]">
        <Image src="/agar-cultures.jpg" alt="Agar plates and culture tubes" fill className="object-cover" />
      </div>
      <div className="p-7 md:py-[52px] md:pl-2 md:pr-[52px]">
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          <span className="rounded-[2px] bg-forest px-[11px] py-[5px] text-[10px] tracking-[0.14em] text-cream">
            Featured
          </span>
          <span>{post.tag}</span>
          <span>· {post.readTime}</span>
        </div>
        <h2 className="mt-5 text-[clamp(28px,3vw,40px)] tracking-[-0.02em] text-ink">{post.title}</h2>
        <p className="mt-4 max-w-[32em] text-[16px] leading-[1.6] text-muted">{post.description}</p>
        <div className="mt-[26px] inline-flex items-center gap-[9px] rounded-[2px] border border-forest px-[22px] py-[13px] text-[14.5px] font-semibold text-forest">
          Read the guide <span className="font-mono">→</span>
        </div>
      </div>
    </Link>
  );
}
