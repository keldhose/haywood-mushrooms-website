import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "../posts";

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Haywood Mushrooms`,
    description: post.description,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug as keyof typeof posts];

  if (!post) {
    notFound();
  }

  return (
    <main className="px-6 py-24 md:px-10">
      <article className="mx-auto max-w-[720px]">
        <Link href="/blog" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-forest">
          ← Grow guides
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          <span>{post.tag}</span>
          <span>· {post.readTime}</span>
        </div>

        <h1 className="mt-5 text-[clamp(32px,4vw,48px)] tracking-[-0.02em]">{post.title}</h1>

        <p className="mt-6 text-[18px] leading-[1.6] text-muted">{post.description}</p>

        <div className="mt-10 flex flex-col gap-6">
          {post.body.map((block, i) =>
            block.type === "h2" ? (
              <h2 key={i} className="mt-4 font-serif text-[26px] text-ink">
                {block.text}
              </h2>
            ) : (
              <p key={i} className="text-[16px] leading-[1.7] text-muted">
                {block.text}
              </p>
            )
          )}
        </div>
      </article>
    </main>
  );
}
