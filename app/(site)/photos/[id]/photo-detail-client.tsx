"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Photo } from "@/lib/photo-types"
import { PhotoFullscreenModal } from "@/components/photo-fullscreen-modal"
import { useSearchParams } from "next/navigation"

export function PhotoDetailClient({ photo, prevPhoto, nextPhoto, backToGalleryHref }: { 
  photo: Photo; 
  prevPhoto: Photo | null; 
  nextPhoto: Photo | null;
  backToGalleryHref: string;
}) {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag');
  const queryString = tagParam ? `?tag=${tagParam}` : '';
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate aspect ratio for the image
  const aspectRatio = photo.dimensions 
    ? `${photo.dimensions.width} / ${photo.dimensions.height}`
    : "auto";
  
  // Determine if the photo is in portrait orientation
  const isPortrait = photo.dimensions 
    ? photo.dimensions.height > photo.dimensions.width
    : false;

  // Create the back to gallery link with the tag parameter
  const backToGalleryLink = `${backToGalleryHref}${queryString}`;

  // Use effect to render tags in the desktop view
  useEffect(() => {
    const desktopTagsContainer = document.getElementById('photo-tags-desktop');
    if (desktopTagsContainer && photo.tags && photo.tags.length > 0) {
      const tagsHtml = document.createElement('div');
      tagsHtml.className = 'flex flex-wrap gap-2';
      
      photo.tags.forEach(tag => {
        const tagLink = document.createElement('a');
        tagLink.href = `/photos?tag=${tag}`;
        tagLink.className = `px-4 py-1.5 rounded-full text-sm font-medium ${
          tagParam === tag 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary'
        } transition-all duration-300 shadow-sm flex items-center gap-2`;
        tagLink.textContent = tag;
        
        // Add click event to handle client-side navigation with the tag
        tagLink.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = `/photos?tag=${tag}`;
        });
        
        tagsHtml.appendChild(tagLink);
      });
      
      // Clear previous content and append new tags
      desktopTagsContainer.innerHTML = '';
      desktopTagsContainer.appendChild(tagsHtml);
    }
  }, [photo.tags, tagParam]);

  // Function to render tags with the current tag filter preserved
  const renderTags = () => {
    if (!photo.tags || photo.tags.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {photo.tags.map((tag) => (
            <Link 
              key={tag} 
              href={`/photos?tag=${tag}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                tagParam === tag 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary'
              } transition-all duration-300 shadow-sm flex items-center gap-2`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Back to Gallery link (mobile only) */}
      <div className="lg:hidden mb-4">
        <Link href={backToGalleryLink} className="text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ChevronLeft size={16} />
          Back to Gallery
        </Link>
      </div>
      
      <div className="lg:col-span-2 flex flex-col">
        {/* Navigation buttons above the image */}
        <div className="flex justify-between mb-4 mt-4 sm:mt-0">
          {prevPhoto ? (
            <Link 
              href={`/photos/${prevPhoto.id}${queryString}`}
            >
              <Button variant="outline" size="sm">
                <ChevronLeft size={16} className="mr-2" />
                Previous
              </Button>
            </Link>
          ) : (
            <div></div>
          )}

          {nextPhoto ? (
            <Link 
              href={`/photos/${nextPhoto.id}${queryString}`}
            >
              <Button variant="outline" size="sm">
                Next
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        <div className={`${isPortrait ? 'flex justify-center' : ''}`}>
          <div 
            className={`
              relative overflow-hidden rounded-lg cursor-pointer
              ${isPortrait 
                ? 'max-h-[80vh] max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[65%] mx-auto' 
                : 'max-h-[65vh] sm:max-h-[70vh] md:max-h-[80vh] w-full'
              }
            `}
            style={{ 
              aspectRatio,
              height: isPortrait 
                ? 'min(calc((100vw * 0.9) * ' + (photo.dimensions ? photo.dimensions.height / photo.dimensions.width : 1) + '), calc(100vh - 220px))' 
                : 'auto',
              minHeight: isPortrait ? '300px' : '400px'
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
      </div>

      <div className="lg:hidden mt-6">
        <h1 className="text-xl font-bold mb-2">{photo.title}</h1>
        <p className="text-muted-foreground mb-4">{photo.description}</p>
        {renderTags()}
      </div>

      <PhotoFullscreenModal 
        photo={photo} 
        isOpen={isFullscreen} 
        onClose={() => setIsFullscreen(false)} 
      />
    </>
  );
}
