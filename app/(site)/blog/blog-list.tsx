"use client"

import { useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PostMetadata } from "@/lib/markdown"
import { filterPostsByTags, countPostsWithTag } from "@/lib/blog-client"
import { motion } from "framer-motion"

type BlogListProps = {
  posts: PostMetadata[];
  allTags: string[];
}


// Component that uses useSearchParams
function BlogListContent({ posts, allTags }: BlogListProps) {
  const searchParams = useSearchParams();
  
  // Client-side state for selected tags, initialized from URL query parameter
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagParam = searchParams.get('tag');
    return tagParam && allTags.includes(tagParam) ? [tagParam] : [];
  });
  
  // Handle tag selection (single select only)
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? [] // If tag is already selected, deselect it
        : [tag] // Otherwise, select only this tag
    );
  };
  
  // Filter posts by selected tags
  const getFilteredPosts = () => {
    return filterPostsByTags(posts, selectedTags);
  };

  return (
    <div className="space-y-8">
      {/* Tag filtering */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mb-8 px-4">
          {allTags.map(tag => {
            const count = countPostsWithTag(posts, tag);
            return (
              <motion.button
                key={tag}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm flex items-center gap-2 ${
                  selectedTags.includes(tag) 
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2' 
                    : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary'
                }`}
                onClick={() => handleTagSelect(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
                <span className={`inline-flex items-center justify-center rounded-full text-xs w-5 h-5 ${
                  selectedTags.includes(tag) 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-secondary-foreground/10 text-secondary-foreground'
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredPosts().map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map(tag => (
                              <span 
                                key={tag} 
                                className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                +{post.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">{post.date}</p>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {getFilteredPosts().length === 0 && (
            <motion.div 
              className="text-center py-16 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">No matching posts</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No blog posts match the selected tags. Try selecting different tags or clearing your current selection.
              </p>
              <button 
                onClick={() => setSelectedTags([])}
                className="mt-4 px-4 py-2 bg-secondary rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// Wrapper component with Suspense boundary
export function BlogList(props: BlogListProps) {
  return (
    <Suspense fallback={
      <div className="text-center py-16">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
      </div>
    }>
      <BlogListContent {...props} />
    </Suspense>
  )
}
