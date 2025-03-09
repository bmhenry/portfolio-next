import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

// This would typically come from a database or API
const getBlogPost = (id: string) => {
  return {
    id: Number.parseInt(id),
    title: "Building Scalable Web Applications with React and Next.js",
    date: "March 5, 2023",
    category: "Web Development",
    readTime: "8 min read",
    image: "/placeholder.svg?height=600&width=1200",
    content: `
      <p>In today's digital landscape, building web applications that can scale to accommodate millions of users is a critical challenge for developers. React and Next.js provide a powerful combination for creating such applications, offering both performance and developer experience benefits.</p>
      
      <h2>Why React and Next.js?</h2>
      
      <p>React has established itself as the leading library for building user interfaces. Its component-based architecture allows for reusable code, making it easier to maintain and scale applications. Next.js builds on top of React, adding features like server-side rendering, static site generation, and API routes, which are essential for building modern web applications.</p>
      
      <p>Here are some key advantages of using React and Next.js for scalable applications:</p>
      
      <ul>
        <li><strong>Performance optimization:</strong> Next.js provides automatic code splitting, which means only the JavaScript needed for a specific page is loaded, reducing initial load times.</li>
        <li><strong>SEO-friendly:</strong> Server-side rendering ensures that search engines can crawl your content effectively.</li>
        <li><strong>Developer experience:</strong> Hot module replacement, TypeScript support, and a well-defined file-based routing system make development faster and more enjoyable.</li>
        <li><strong>Scalability:</strong> The architecture naturally supports scaling as your application grows.</li>
      </ul>
      
      <h2>Architecture for Scalable Applications</h2>
      
      <p>When building for scale, the architecture of your application becomes crucial. Here's a recommended approach:</p>
      
      <h3>1. Component Structure</h3>
      
      <p>Organize your components into a clear hierarchy:</p>
      
      <ul>
        <li><strong>Atoms:</strong> Basic building blocks like buttons, inputs, and icons.</li>
        <li><strong>Molecules:</strong> Combinations of atoms that form more complex UI elements.</li>
        <li><strong>Organisms:</strong> Sections of a page composed of molecules and atoms.</li>
        <li><strong>Templates:</strong> Page layouts that arrange organisms.</li>
        <li><strong>Pages:</strong> Complete views composed of templates and organisms.</li>
      </ul>
      
      <h3>2. State Management</h3>
      
      <p>For small to medium applications, React's Context API might be sufficient. For larger applications, consider using a state management library like Redux or Zustand. Next.js also provides built-in support for server state through getServerSideProps and getStaticProps.</p>
      
      <h3>3. API Strategy</h3>
      
      <p>Next.js API routes provide a convenient way to create serverless functions. For more complex applications, consider implementing a GraphQL API using Apollo Client or React Query for efficient data fetching.</p>
      
      <h2>Performance Optimization Techniques</h2>
      
      <p>Even with the best architecture, performance optimization is essential for scalability. Here are some techniques to consider:</p>
      
      <ul>
        <li><strong>Image optimization:</strong> Use Next.js's Image component to automatically optimize images.</li>
        <li><strong>Code splitting:</strong> Break your application into smaller chunks that can be loaded on demand.</li>
        <li><strong>Memoization:</strong> Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders.</li>
        <li><strong>Lazy loading:</strong> Load components only when they're needed using React.lazy and Suspense.</li>
        <li><strong>Incremental Static Regeneration:</strong> Update static pages in the background without rebuilding the entire site.</li>
      </ul>
      
      <h2>Deployment and Scaling</h2>
      
      <p>When it comes to deployment, platforms like Vercel (created by the team behind Next.js) provide an excellent experience. They offer:</p>
      
      <ul>
        <li>Automatic deployments from Git</li>
        <li>Preview deployments for pull requests</li>
        <li>Global CDN for fast content delivery</li>
        <li>Serverless functions for API routes</li>
        <li>Analytics and monitoring</li>
      </ul>
      
      <p>For applications requiring more control, you can deploy Next.js to any Node.js server or even containerize it with Docker for deployment to Kubernetes clusters.</p>
      
      <h2>Conclusion</h2>
      
      <p>Building scalable web applications with React and Next.js involves thoughtful architecture, performance optimization, and choosing the right deployment strategy. By leveraging the strengths of these technologies and following best practices, you can create applications that provide excellent user experiences while handling millions of users.</p>
      
      <p>Remember that scalability is not just about handling large numbers of users but also about maintaining developer productivity as your codebase grows. The component-based nature of React and the conventions provided by Next.js help ensure that your application remains maintainable even as it scales.</p>
    `,
    author: {
      name: "Brandon",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Software Engineer & Photographer",
    },
    relatedPosts: [
      { id: 2, title: "The Art of Landscape Photography: Capturing the Perfect Shot" },
      { id: 5, title: "The Future of Cloud Computing: Trends to Watch in 2023" },
    ],
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = getBlogPost(params.id)

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

          <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="border-t pt-8 mt-12">
          <h2 className="text-xl font-bold mb-4">Related Posts</h2>
          <div className="space-y-4">
            {post.relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="block hover:underline">
                {relatedPost.title}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

