import { posts } from "../posts"

export default function BlogPost({ params }: { params: { slug: string } }) {

  const post = posts[params.slug as keyof typeof posts]

  if (!post) {
    return <div className="p-20">Article not found</div>
  }

  return (
    <main className="max-w-3xl mx-auto py-20 px-6">

      <h1 className="text-4xl font-bold mb-6">
        {post.title}
      </h1>

      <p className="text-lg text-stone-600 mb-10">
        {post.description}
      </p>

      <article className="prose prose-lg">
        {post.content}
      </article>

    </main>
  )
}