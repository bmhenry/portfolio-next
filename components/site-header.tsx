"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Instagram, Linkedin, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Me" },
    { href: "/photos", label: "Photos" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-navy">
          Brandon
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === route.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}

          <div className="flex items-center gap-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-navy"
            >
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-navy"
            >
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-navy"
            >
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-8">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    pathname === route.href ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {route.label}
                </Link>
              ))}

              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-navy"
                >
                  <Linkedin size={24} />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-navy"
                >
                  <Instagram size={24} />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-navy"
                >
                  <Github size={24} />
                  <span className="sr-only">GitHub</span>
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

