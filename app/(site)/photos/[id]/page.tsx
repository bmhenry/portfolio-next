import React, { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getPhotoById, getAllPhotos, getPhotoByIdWithParsedDescription } from "@/lib/photos"
import { Photo } from "@/lib/photo-types"
import { notFound } from "next/navigation"
import { PhotoDetailClient } from "@/app/(site)/photos/[id]/photo-detail-client"

// Generate static params for all photo pages at build time
export async function generateStaticParams() {
  const photos = getAllPhotos();
  return photos.map((photo) => ({
    id: photo.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const photo = await getPhotoById(id);
  
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

// This ensures the page is statically rendered
export const dynamic = 'force-static';

export default async function PhotoDetailPage({ 
  params,
}: { 
  params: { id: string },
}) {
  const { id } = await params;
  const photo = await getPhotoByIdWithParsedDescription(id);
  
  if (!photo) {
    notFound();
  }
  
  // Get all photos for navigation
  const allPhotos = await getAllPhotos();
  
  // Find the current photo's index in the collection
  const currentIndex = allPhotos.findIndex((p) => p.id === id);
  
  // Determine previous and next photos
  const prevPhoto = currentIndex > 0 ? allPhotos[currentIndex - 1] : null;
  const nextPhoto = currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1] : null;
  
  // Determine if the photo is in portrait orientation
  const isPortrait = photo.dimensions 
    ? photo.dimensions.height > photo.dimensions.width
    : false;

  return (
    <div className="container py-6 md:py-8 lg:py-12">
      <div className="sm:mb-6 md:mb-8 hidden lg:block">
        <Link href="/photos" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ChevronLeft size={16} />
          Back to Gallery
        </Link>
      </div>

      <div className={`grid grid-cols-1 ${isPortrait ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3'} gap-4 sm:gap-6 md:gap-8`}>
        <Suspense fallback={
          <div className="lg:col-span-2 flex flex-col">
            <div className="animate-pulse bg-secondary/50 rounded-lg" style={{ 
              aspectRatio: photo.dimensions ? `${photo.dimensions.width} / ${photo.dimensions.height}` : "16/9",
              height: "auto",
              minHeight: "400px"
            }}></div>
          </div>
        }>
          <PhotoDetailClient 
            photo={photo} 
            prevPhoto={prevPhoto} 
            nextPhoto={nextPhoto} 
            backToGalleryHref={`/photos`}
            allPhotos={allPhotos}
          />
        </Suspense>

        <div className={isPortrait ? 'lg:col-span-1 xl:col-span-1' : ''}>
          <h1 className="text-2xl font-bold mb-4">{photo.title}</h1>
          {photo.descriptionHtml ? (
            <div 
              className="text-muted-foreground mb-6 prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: photo.descriptionHtml }}
            />
          ) : (
            <p className="text-muted-foreground mb-6">{photo.description}</p>
          )}
          
          {/* Tags will be rendered by the client component */}
          <div id="photo-tags-desktop" className="hidden lg:block mb-6"></div>

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
