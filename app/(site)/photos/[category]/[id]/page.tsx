import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getPhotoById, getPhotosByCategory, getAllPhotoCategories, getAllPhotos } from "@/lib/photos"
import { Photo } from "@/lib/photo-types"
import { notFound } from "next/navigation"

// Generate static params for all photo pages at build time
export async function generateStaticParams() {
  const photos = getAllPhotos();
  return photos.map((photo) => ({
    category: photo.category,
    id: photo.id,
  }));
}

export async function generateMetadata({ params }: { params: { category: string; id: string } }) {
  const { category, id } = await params;
  const photo = await getPhotoById(category, id);
  
  if (!photo) {
    return {
      title: 'Photo Not Found',
    };
  }
  
  return {
    title: photo.title,
    description: photo.description,
  };
}

export default async function PhotoDetailPage({ params }: { params: { category: string; id: string } }) {
  const { category, id } = await params;
  const photo = await getPhotoById(category, id);
  
  if (!photo) {
    notFound();
  }
  
  // Get all photos in this category for navigation
  const categoryPhotos = await getPhotosByCategory(category);
  const currentIndex = categoryPhotos.findIndex((p: any) => p.id === id);
  
  // Determine previous and next photos
  const prevPhoto = currentIndex > 0 ? categoryPhotos[currentIndex - 1] : null;
  const nextPhoto = currentIndex < categoryPhotos.length - 1 ? categoryPhotos[currentIndex + 1] : null;

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
            <Image 
              src={photo.src || "/placeholder.svg"} 
              alt={photo.alt} 
              fill 
              className="object-cover" 
              priority 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="flex justify-between mt-4">
            {prevPhoto ? (
              <Link href={`/photos/${category}/${prevPhoto.id}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </Button>
              </Link>
            ) : (
              <div></div>
            )}

            {nextPhoto ? (
              <Link href={`/photos/${category}/${nextPhoto.id}`}>
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
          
          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag: string) => (
                  <Link 
                    key={tag} 
                    href={`/photos?tag=${tag}`}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Photo Details</h2>
            <div className="grid grid-cols-2 gap-2">
              {/* Dynamically render all metadata fields */}
              {Object.entries(photo.metadata).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div className="text-sm text-muted-foreground">{value}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
