import Image from "next/image"
import Link from "next/link"
import { SocialLinks } from "@/components/social-links"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile headshot - only visible on small screens */}
      <div className="flex justify-center py-6 md:hidden">
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100">
          <Image
            src="/portrait_web_small.jpg"
            alt="Brandon portrait"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Desktop image - hidden on mobile */}
      <div className="hidden md:block md:w-1/2 relative bg-gray-100">
        <Image
          src="/portrait_web_small.jpg"
          alt="Brandon portrait"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Right side - Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-navy">I'm Brandon.</h1>
          <p className="text-xl text-gray-600">Engineer. Programmer. Maker. Photographer. Backpacker. Explorer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
          <Link href="/about" className="nav-button text-center">
            About Me
          </Link>
          <Link href="/photos" className="nav-button text-center">
            Photos
          </Link>
          <Link href="/blog" className="nav-button text-center">
            Blog
          </Link>
          <Link href="/contact" className="nav-button text-center">
            Contact
          </Link>
        </div>

        <SocialLinks size={"xl"} className="text-gray-500 hover:text-navy"/>
      </div>
    </main>
  )
}
