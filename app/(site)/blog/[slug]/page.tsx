import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getPostBySlug, getAllPostSlugs } from "@/lib/markdown"
import { notFound } from "next/navigation"

// Generate static params for all blog posts
export function generateStaticParams() {
  // Directly return the required slugs
  // return [
  //   { slug: 'building-scalable-web-apps' },
  //   { slug: 'landscape-photography-guide' }
  // ];
  const slugs = getAllPostSlugs();
  return slugs;
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string }
}) {
  // Await the params object if it's a promise
  const resolvedParams = await Promise.resolve(params);
  
  // Get the slug from params
  const post = await getPostBySlug(resolvedParams.slug).catch(() => null)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link href="/blog" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ChevronLeft size={16} />
          Back to Blog
        </Link>
      </div>

      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground">{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.date}</p>
            </div>
          </div>

          <div className="relative aspect-[2/1] rounded-lg overflow-hidden mb-8">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill priority className="object-cover" />
          </div>

          <div 
            className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-ul:my-6 prose-ol:my-6 prose-li:my-2" 
            dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
          />
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="border-t pt-8 mt-12">
            <h2 className="text-xl font-bold mb-4">Related Posts</h2>
            <div className="space-y-4">
              {post.relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="block hover:underline">
                  {relatedPost.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
