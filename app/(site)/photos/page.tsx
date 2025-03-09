import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample photo categories and data
const categories = [
  { id: "landscapes", name: "Landscapes" },
  { id: "urban", name: "Urban" },
  { id: "portraits", name: "Portraits" },
  { id: "travel", name: "Travel" },
]

const photos = {
  landscapes: [
    { id: 1, src: "/placeholder.svg?height=600&width=800", alt: "Mountain landscape", title: "Mountain Vista" },
    { id: 2, src: "/placeholder.svg?height=600&width=800", alt: "Ocean sunset", title: "Ocean Sunset" },
    { id: 3, src: "/placeholder.svg?height=600&width=800", alt: "Forest path", title: "Forest Path" },
    { id: 4, src: "/placeholder.svg?height=600&width=800", alt: "Desert dunes", title: "Desert Dunes" },
    { id: 5, src: "/placeholder.svg?height=600&width=800", alt: "Lake reflection", title: "Lake Reflection" },
    { id: 6, src: "/placeholder.svg?height=600&width=800", alt: "Snowy mountains", title: "Winter Mountains" },
  ],
  urban: [
    { id: 1, src: "/placeholder.svg?height=600&width=800", alt: "City skyline", title: "City Skyline" },
    { id: 2, src: "/placeholder.svg?height=600&width=800", alt: "Street photography", title: "Urban Streets" },
    { id: 3, src: "/placeholder.svg?height=600&width=800", alt: "Night city", title: "City Lights" },
    { id: 4, src: "/placeholder.svg?height=600&width=800", alt: "Architecture", title: "Modern Architecture" },
  ],
  portraits: [
    { id: 1, src: "/placeholder.svg?height=600&width=800", alt: "Professional portrait", title: "Professional" },
    { id: 2, src: "/placeholder.svg?height=600&width=800", alt: "Candid portrait", title: "Candid Moment" },
    { id: 3, src: "/placeholder.svg?height=600&width=800", alt: "Environmental portrait", title: "Environmental" },
  ],
  travel: [
    { id: 1, src: "/placeholder.svg?height=600&width=800", alt: "Paris", title: "Paris, France" },
    { id: 2, src: "/placeholder.svg?height=600&width=800", alt: "Tokyo", title: "Tokyo, Japan" },
    { id: 3, src: "/placeholder.svg?height=600&width=800", alt: "New York", title: "New York, USA" },
    { id: 4, src: "/placeholder.svg?height=600&width=800", alt: "Bali", title: "Bali, Indonesia" },
    { id: 5, src: "/placeholder.svg?height=600&width=800", alt: "Santorini", title: "Santorini, Greece" },
  ],
}

export default function PhotosPage() {
  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Photography Portfolio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of my favorite photographs from around the world. Browse by category to explore landscapes,
            urban scenes, portraits, and travel photography.
          </p>
        </div>

        <Tabs defaultValue="landscapes" className="w-full">
          <TabsList className="flex justify-center mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos[category.id].map((photo) => (
                  <Link key={photo.id} href={`/photos/${category.id}/${photo.id}`} className="group">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={photo.src || "/placeholder.svg"}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 w-full">
                          <h3 className="text-white font-medium">{photo.title}</h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

