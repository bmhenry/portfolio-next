import { SocialLinks } from "@/components/social-links"

export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Brandon Henry. All rights reserved.
          </p>
        </div>

        <SocialLinks className="text-gray-600 hover:text-navy" />
      </div>
    </footer>
  )
}
