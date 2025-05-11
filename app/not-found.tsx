import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link 
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}
