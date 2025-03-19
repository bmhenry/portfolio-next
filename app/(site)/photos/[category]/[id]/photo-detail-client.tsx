"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Photo } from "@/lib/photo-types"
import { PhotoFullscreenModal } from "@/components/photo-fullscreen-modal"

export function PhotoDetailClient({ photo, prevPhoto, nextPhoto, category }: { 
  photo: Photo; 
  prevPhoto: Photo | null; 
  nextPhoto: Photo | null;
  category: string;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate aspect ratio for the image
  const aspectRatio = photo.dimensions 
    ? `${photo.dimensions.width} / ${photo.dimensions.height}`
    : "auto";
  
  // Determine if the photo is in portrait orientation
  const isPortrait = photo.dimensions 
    ? photo.dimensions.height > photo.dimensions.width
    : false;

  return (
    <>
      <div className="lg:col-span-2 flex flex-col">
        <div className={`${isPortrait ? 'flex justify-center' : ''}`}>
          <div 
            className={`
              relative overflow-hidden rounded-lg cursor-pointer
              ${isPortrait 
                ? 'max-h-[75vh] max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[65%] mx-auto' 
                : 'max-h-[80vh] w-full'
              }
            `}
            style={{ 
              aspectRatio,
              height: isPortrait ? '85vh' : 'auto',
              minHeight: '400px'
            }}
            onClick={() => setIsFullscreen(true)}
          >
            <Image 
              src={photo.src || "/placeholder.svg"} 
              alt={photo.alt} 
              fill 
              className="object-contain" 
              priority 
              sizes={isPortrait
                ? "(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 40vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
            />
          </div>
        </div>

        <div className={`flex justify-between mt-4 ${isPortrait ? 'w-full px-4 md:px-8 lg:px-12' : ''}`}>
          {prevPhoto ? (
            <Link href={`/photos/${prevPhoto.category}/${prevPhoto.id}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft size={16} className="mr-2" />
                Previous
              </Button>
            </Link>
          ) : (
            <div></div>
          )}

          {nextPhoto ? (
            <Link href={`/photos/${nextPhoto.category}/${nextPhoto.id}`}>
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

      <PhotoFullscreenModal 
        photo={photo} 
        isOpen={isFullscreen} 
        onClose={() => setIsFullscreen(false)} 
      />
    </>
  );
}
