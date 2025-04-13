"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const isMobile = useIsMobile()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Extract headings from the DOM
    const allHeadings = Array.from(
      document.querySelectorAll("article h1, article h2, article h3, article h4, article h5, article h6")
    );
    
    const articleHeadings = allHeadings
      .filter((el) => el.id) // Only include headings with IDs
      .map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: parseInt(el.tagName.substring(1)), // Extract level from h1, h2, etc.
      }))
    setHeadings(articleHeadings)

    // Set up intersection observer to detect which heading is currently in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 1.0,
      }
    )

    // Observe all headings
    articleHeadings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      articleHeadings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [])


  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Offset to account for fixed header
        behavior: "smooth",
      })
      setActiveId(id)
      
      // Close the sheet if on mobile
      if (isMobile) {
        setOpen(false)
      }
    }
  }

  // Table of contents content component - reused in both desktop and mobile views
  const TableOfContentsContent = () => (
    <div className="p-4 text-sm bg-background">
      <h4 className="font-semibold mb-3 text-foreground text-base border-b pb-2">On this page</h4>
      <nav>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{
                paddingLeft: `${(heading.level - 1) * 12}px`,
              }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleLinkClick(e, heading.id)}
                className={cn(
                  "block py-1 hover:text-primary transition-colors",
                  activeId === heading.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )

  // If no headings found, show a debug message in development or return null
  if (headings.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="hidden lg:block sticky top-24 border-2 border-red-500 p-4 bg-red-50 text-red-800 rounded-md">
          <h4 className="font-semibold mb-2">Table of Contents Debug</h4>
          <p className="text-sm">No headings with IDs found in the article.</p>
          <p className="text-sm mt-2">Check if rehype-slug is working correctly.</p>
        </div>
      )
    }
    return null
  }

  // Mobile view with floating button and sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="fixed top-24 right-4 z-40 rounded-full shadow-md opacity-80 hover:opacity-100 toc-mobile-button"
            aria-label="Table of contents"
          >
            <List className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-[85vw] max-w-xs pt-12 overflow-auto toc-sheet-content"
        >
          <TableOfContentsContent />
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop view
  return (
    <div className={cn("hidden lg:block sticky top-24 overflow-auto", className)}>
      <TableOfContentsContent />
    </div>
  )
}
