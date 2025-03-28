"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { filterPhotosByTags, Photo } from "@/lib/photo-types"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { motion, AnimatePresence } from "framer-motion"

type Category = {
  id: string;
  name: string;
}

type PhotoGalleryProps = {
  photos: Photo[];
  allTags: string[];
}

// Helper function to count photos with a specific tag
function countPhotosWithTag(photos: Photo[], tag: string): number {
  return photos.filter(photo => photo.tags.includes(tag)).length;
}

// Helper to determine if a photo is landscape orientation
function isLandscape(photo: Photo): boolean {
  // Check if dimensions exist in the metadata
  if (photo.dimensions?.width && photo.dimensions?.height) {
    return photo.dimensions.width > photo.dimensions.height;
  }
  return false;
}

// Component that uses useSearchParams
function PhotoGalleryContent({ photos, allTags }: PhotoGalleryProps) {
  const searchParams = useSearchParams();
  
  // Client-side state for selected tags, initialized from URL query parameter
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagParam = searchParams.get('tag');
    return tagParam && allTags.includes(tagParam) ? [tagParam] : [];
  });
  
  // Handle tag selection (single select only)
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? [] // If tag is already selected, deselect it
        : [tag] // Otherwise, select only this tag
    );
  };
  
  // Filter photos by selected tags
  const getFilteredPhotos = () => {
    return filterPhotosByTags(photos, selectedTags);
  };

  return (
    <div className="space-y-8">
      {/* Tag filtering */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mb-8 px-4">
          {allTags.map(tag => {
            const count = countPhotosWithTag(photos, tag);
            return (
              <motion.button
                key={tag}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm flex items-center gap-2 ${
                  selectedTags.includes(tag) 
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2' 
                    : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary'
                }`}
                onClick={() => handleTagSelect(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
                <span className={`inline-flex items-center justify-center rounded-full text-xs w-5 h-5 ${
                  selectedTags.includes(tag) 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-secondary-foreground/10 text-secondary-foreground'
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="w-full">
        <style jsx global>{`
          .landscape-photo {
            grid-column-end: span 2;
          }
          
          @media (max-width: 750px) {
            .landscape-photo {
              grid-column-end: span 1;
            }
          }
        `}</style>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3, 1400: 4, 1800: 5 }}
            className="animate-in fade-in duration-500"
          >
            <Masonry gutter="2rem">
              {getFilteredPhotos().map((photo, index) => {
                      const landscape = isLandscape(photo);
                      const isFirstImage = index === 0;
                      
                      return (
                        <motion.div 
                          key={photo.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className={`${landscape ? 'landscape-photo' : ''}`}
                        >
                          <Link 
                            href={`/photos/${photo.category}/${photo.id}`} 
                            className="group block"
                          >
                            <div className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                              landscape 
                                ? 'shadow-lg hover:shadow-xl border border-primary/10' 
                                : 'shadow-md hover:shadow-lg'
                            }`}>
                              <Image
                                src={photo.src || "/placeholder.svg"}
                                alt={photo.alt}
                                width={landscape ? 1200 : 500}
                                height={landscape ? 750 : 350}
                                className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105"
                                sizes={landscape 
                                  ? "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 85vw" 
                                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                }
                                priority={isFirstImage}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                                <div className="p-6 w-full">
                                  <h3 className="text-white font-semibold text-lg">{photo.title}</h3>
                                  {photo.description && photo.description !== "No description provided." && (
                                    <p className="text-white/90 text-sm mt-1 line-clamp-2">{photo.description}</p>
                                  )}
                                  {photo.tags && photo.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {photo.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                                          {tag}
                                        </span>
                                      ))}
                                      {photo.tags.length > 3 && (
                                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                                          +{photo.tags.length - 3}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </Masonry>
          </ResponsiveMasonry>
          
          {getFilteredPhotos().length === 0 && (
                  <motion.div 
                    className="text-center py-16 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">No matching photos</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      No photos match the selected tags. Try selecting different tags or clearing your current selection.
                    </p>
                    <button 
                      onClick={() => setSelectedTags([])}
                      className="mt-4 px-4 py-2 bg-secondary rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
        </motion.div>
      </div>
    </div>
  )
}

// Wrapper component with Suspense boundary
export function PhotoGallery(props: PhotoGalleryProps) {
  return (
    <Suspense fallback={
      <div className="text-center py-16">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-muted-foreground">Loading gallery...</p>
      </div>
    }>
      <PhotoGalleryContent {...props} />
    </Suspense>
  )
}
