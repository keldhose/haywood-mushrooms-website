import Link from "next/link"
import { posts } from "./posts"

export default function Blog() {

  return (
    <main className="min-h-screen bg-stone-50 py-20">

      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-4xl font-semibold text-center">
          Mushroom Growing Guides
        </h1>

        <div className="grid gap-8 mt-12">

          {Object.entries(posts).map(([slug, post]) => (

            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">
                {post.title}
              </h2>

              <p className="mt-2 text-stone-600">
                {post.description}
              </p>

            </Link>

          ))}

        </div>

      </div>

    </main>
  )
}