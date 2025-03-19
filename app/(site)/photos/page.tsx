import { getAllPhotos, getAllTags, Photo } from "@/lib/photos"
import { PhotoGallery } from "./photo-gallery"

// Generate static metadata for the photos page
export const metadata = {
  title: "Photography Portfolio",
  description: "A collection of my favorite photographs from around the world."
}

export default async function PhotosPage() {
  // Fetch all photos and tags at build time
  const photos = await getAllPhotos();
  const allTags = await getAllTags();
  
  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Photography Portfolio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of my favorite photographs from around the world. Use the tags to filter and explore landscapes,
            urban scenes, portraits, and travel photography.
          </p>
        </div>
        
        {/* Client component for interactive gallery */}
        <PhotoGallery 
          photos={photos}
          allTags={allTags}
        />
      </div>
    </div>
  )
}
