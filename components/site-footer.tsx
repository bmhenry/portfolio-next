import { Github, Instagram, Linkedin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Brandon. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
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
      </div>
    </footer>
  )
}

