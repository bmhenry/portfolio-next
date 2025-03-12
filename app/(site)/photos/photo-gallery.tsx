"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { filterPhotosByTags, Photo } from "@/lib/photo-types"

type Category = {
  id: string;
  name: string;
}

type PhotoGalleryProps = {
  categories: Category[];
  photosByCategory: Record<string, Photo[]>;
  allTags: string[];
  defaultCategory: string;
}

export function PhotoGallery({ categories, photosByCategory, allTags, defaultCategory }: PhotoGalleryProps) {
  // Client-side state for selected tags
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory)
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Filter photos by selected tags
  const getFilteredPhotos = (categoryId: string) => {
    if (!photosByCategory[categoryId]) return [];
    return filterPhotosByTags(photosByCategory[categoryId], selectedTags);
  };

  return (
    <div className="space-y-6">
      {/* Tag filtering */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory}
        className="w-full"
      >
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
              {getFilteredPhotos(category.id).map((photo) => (
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
                        {photo.tags && photo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {photo.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs text-white/80">#{tag}</span>
                            ))}
                            {photo.tags.length > 3 && (
                              <span className="text-xs text-white/80">+{photo.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {getFilteredPhotos(category.id).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No photos match the selected tags.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
