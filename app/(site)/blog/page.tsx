import { getAllPosts, getAllBlogTags } from "@/lib/markdown"
import { BlogList } from "./blog-list"

export default function BlogPage() {
  // Get all blog posts and tags
  const posts = getAllPosts()
  const allTags = getAllBlogTags()
  
  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts, stories, and ideas on technology, photography, travel, and more.
          </p>
        </div>
        
        {/* Client component for interactive blog list with tag filtering */}
        <BlogList 
          posts={posts}
          allTags={allTags}
        />
      </div>
    </div>
  )
}
