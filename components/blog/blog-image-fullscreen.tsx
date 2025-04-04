"use client"

import { useEffect, useState } from "react"
import { PhotoFullscreenModal } from "@/components/photo-fullscreen-modal"
import { Photo } from "@/lib/photo-types"

export function BlogImageFullscreen() {
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Find all images in the blog content
    const blogContentElement = document.querySelector('.prose')
    if (!blogContentElement) return

    // Get images from the main content
    const contentImages = blogContentElement.querySelectorAll('img')
    
    // Get the header image
    const headerImage = document.querySelector('.aspect-\\[2\\/1\\] img') as HTMLImageElement | null
    
    // Combine all images
    const allImages = [...Array.from(contentImages)] as HTMLImageElement[]
    if (headerImage) {
      allImages.push(headerImage)
    }
    
    // Add click handlers to each image
    allImages.forEach((img) => {
      img.style.cursor = 'pointer'
      
      img.addEventListener('click', (e) => {
        e.preventDefault()
        
        // Create a Photo object from the img element
        const photo: Photo = {
          id: img.getAttribute('alt') || 'blog-image',
          category: 'blog',
          src: img.getAttribute('src') || '',
          thumbSrc: img.getAttribute('src') || '',
          alt: img.getAttribute('alt') || 'Blog image',
          title: img.getAttribute('alt') || 'Blog image',
          description: '',
          tags: [],
          metadata: {},
          dimensions: {
            width: img.naturalWidth,
            height: img.naturalHeight
          }
        }
        
        setSelectedImage(photo)
        setIsFullscreen(true)
      })
    })
  }, []) // Empty dependency array ensures this runs once after initial render

  return (
    <>
      {selectedImage && (
        <PhotoFullscreenModal
          photo={selectedImage}
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </>
  )
}
