import { posts } from "../posts"

export default function BlogPost({ params }: { params: { slug: string } }) {

  const post = posts[params.slug]

  if (!post) {
    return <div className="p-20">Article not found</div>
  }

  return (
    <main className="min-h-screen bg-white py-20">

      <div className="max-w-4xl mx-auto px-6">

        <h1 className="text-4xl font-semibold">
          {post.title}
        </h1>

        <p className="mt-6 text-lg text-stone-600 whitespace-pre-line">
          {post.content}
        </p>

      </div>

    </main>
  )
}