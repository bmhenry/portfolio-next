"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

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

  // If no headings found, show a debug message in development
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Offset to account for fixed header
        behavior: "smooth",
      })
      setActiveId(id)
    }
  }

  return (
    <div className={cn("hidden lg:block top-24 overflow-auto", className)}>
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
    </div>
  )
}
