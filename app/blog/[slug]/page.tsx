import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

  const blocks = post.content.trim().split(/\n\n+/);

  return (
    <main className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-6">
        {post.title}
      </h1>

      <p className="text-lg text-stone-600 mb-10">
        {post.description}
      </p>

      <article className="prose prose-lg">
        {blocks.map((block) => {
          const lines = block.split("\n").map((line) => line.trim());
          const heading = /^Step \d+/.test(lines[0]) ? lines[0] : null;
          const text = (heading ? lines.slice(1) : lines).join(" ");

          return (
            <div key={block} className="mb-6">
              {heading && (
                <h2 className="text-2xl font-semibold mt-8 mb-2">{heading}</h2>
              )}
              <p className="text-stone-700 leading-relaxed">{text}</p>
            </div>
          );
        })}
      </article>
    </main>
  )
}
