import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// This would typically come from a database or API
const getPhotoData = (category: string, id: string) => {
  return {
    id: Number.parseInt(id),
    src: "/placeholder.svg?height=1200&width=1600",
    alt: `Photo ${id} in ${category} category`,
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Photo ${id}`,
    description:
      "This photograph was taken during a trip to capture the beauty of nature. The lighting conditions were perfect, allowing for a balanced exposure that highlights both the foreground and background elements.",
    metadata: {
      camera: "Sony A7R IV",
      lens: "24-70mm f/2.8",
      aperture: "f/8",
      shutterSpeed: "1/125s",
      iso: "100",
      location: "Yosemite National Park, CA",
      date: "October 15, 2022",
    },
  }
}

export default function PhotoDetailPage({ params }: { params: { category: string; id: string } }) {
  const { category, id } = params
  const photo = getPhotoData(category, id)
  const prevId = photo.id > 1 ? photo.id - 1 : null
  const nextId = photo.id < 10 ? photo.id + 1 : null

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link href="/photos" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ChevronLeft size={16} />
          Back to Gallery
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src={photo.src || "/placeholder.svg"} alt={photo.alt} fill className="object-cover" priority />
          </div>

          <div className="flex justify-between mt-4">
            {prevId ? (
              <Link href={`/photos/${category}/${prevId}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </Button>
              </Link>
            ) : (
              <div></div>
            )}

            {nextId ? (
              <Link href={`/photos/${category}/${nextId}`}>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4">{photo.title}</h1>
          <p className="text-muted-foreground mb-6">{photo.description}</p>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Photo Details</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Camera</div>
              <div className="text-sm text-muted-foreground">{photo.metadata.camera}</div>

              <div className="text-sm font-medium">Lens</div>
              <div className="text-sm text-muted-foreground">{photo.metadata.lens}</div>

              <div className="text-sm font-medium">Aperture</div>
              <div className="text-sm text-muted-foreground">{photo.metadata.aperture}</div>

              <div className="text-sm font-medium">Shutter Speed</div>
              <div className="text-sm text-muted-foreground">{photo.metadata.shutterSpeed}</div>

              <div className="text-sm font-medium">ISO</div>
              <div className="text-sm text-muted-foreground">{photo.metadata.iso}</div>

              <div className="text-sm font-medium">Location</div>
              <div className="text-sm text-muted-foreground">{photo.metadata.location}</div>

              <div className="text-sm font-medium">Date</div>
              <div className="text-sm text-muted-foreground">{photo.metadata.date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

