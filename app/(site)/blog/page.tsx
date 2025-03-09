import Image from "next/image"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Sample blog posts data
const posts = [
  {
    id: 1,
    title: "Building Scalable Web Applications with React and Next.js",
    excerpt:
      "Learn how to architect and build web applications that can scale to millions of users using React and Next.js.",
    date: "March 5, 2023",
    category: "Web Development",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "The Art of Landscape Photography: Capturing the Perfect Shot",
    excerpt: "Discover techniques for capturing stunning landscape photographs in any lighting condition.",
    date: "February 18, 2023",
    category: "Photography",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Machine Learning for Image Recognition: A Practical Guide",
    excerpt: "A step-by-step guide to building your own image recognition system using TensorFlow and Python.",
    date: "January 30, 2023",
    category: "Machine Learning",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "12 min read",
  },
  {
    id: 4,
    title: "Exploring Remote Trails: My Backpacking Journey Through Patagonia",
    excerpt: "A personal account of my three-week backpacking adventure through the wilderness of Patagonia.",
    date: "December 12, 2022",
    category: "Travel",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "10 min read",
  },
  {
    id: 5,
    title: "The Future of Cloud Computing: Trends to Watch in 2023",
    excerpt: "An analysis of emerging trends in cloud computing and how they will shape the technology landscape.",
    date: "November 28, 2022",
    category: "Technology",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "Designing User Interfaces That Delight: Principles and Practices",
    excerpt: "Learn the key principles of UI design that create delightful user experiences across platforms.",
    date: "October 15, 2022",
    category: "Design",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "9 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts, stories, and ideas on technology, photography, travel, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {post.category}
                    </span>
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
          ))}
        </div>
      </div>
    </div>
  )
}

