import Image from "next/image"
import Link from "next/link"
import { SocialLinks } from "@/components/social-links"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile headshot - only visible on small screens */}
      <div className="flex justify-center py-6 md:hidden mt-6">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100">
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
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 space-y-12 mt-5">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-navy">I'm Brandon.</h1>
          <p className="text-xl text-gray-600">Engineer. Programmer. Maker. Photographer. Backpacker. Explorer.</p>
        </div>

        <ul className="space-y-4 w-full max-w-md">
          <li className="flex flex-row justify-center">
            <Link href="/about" className="nav-button block text-center">
              About Me
            </Link>
          </li>
          <li className="flex flex-row justify-center">
            <Link href="/photos" className="nav-button block text-center">
              Photos
            </Link>
          </li>
          <li className="flex flex-row justify-center">
            <Link href="/blog" className="nav-button block text-center">
              Blog
            </Link>
          </li>
          <li className="flex flex-row justify-center">
            <Link href="/contact" className="nav-button block text-center">
              Contact
            </Link>
          </li>
        </ul>

        <SocialLinks size={"xl"} className="mt-5 text-gray-500 hover:text-navy"/>
      </div>
    </main>
  )
}
