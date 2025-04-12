"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { X, ZoomIn, ZoomOut, Minus, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Photo } from "@/lib/photo-types"

interface PhotoFullscreenModalProps {
  photo: Photo
  isOpen: boolean
  onClose: () => void
}


const minZoomLevel = 1
const maxZoomLevel = 3
const zoomIncrement = 1


export function PhotoFullscreenModal({ photo, isOpen, onClose }: PhotoFullscreenModalProps) {
  // State for zoom level
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  // State for panning when zoomed in
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showPanHint, setShowPanHint] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset position when zoom level changes or modal closes
  useEffect(() => {
    setPosition({ x: 0, y: 0 })
    
    // Show pan hint briefly when zoomed in
    if (zoomLevel > minZoomLevel) {
      setShowPanHint(true)
      const timer = setTimeout(() => {
        setShowPanHint(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [zoomLevel, isOpen])

  // Handle ESC key press to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "+" || e.key === "=") {
        // Zoom in with + key
        setZoomLevel(prev => Math.min(prev + zoomIncrement, maxZoomLevel))
      } else if (e.key === "-" || e.key === "_") {
        // Zoom out with - key
        setZoomLevel(prev => Math.max(prev - zoomIncrement, minZoomLevel))
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // Dispatch custom events when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Dispatch event when modal opens
      window.dispatchEvent(new CustomEvent('photoModalOpen'))
    } else {
      // Dispatch event when modal closes
      window.dispatchEvent(new CustomEvent('photoModalClose'))
    }
  }, [isOpen])

  // Calculate aspect ratio for the image
  const aspectRatio = photo.dimensions 
    ? `${photo.dimensions.width} / ${photo.dimensions.height}`
    : "auto"

  // Mouse event handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > minZoomLevel) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > minZoomLevel) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // Apply bounds to prevent panning too far
      const boundedPosition = getBoundedPosition(newX, newY)
      setPosition(boundedPosition)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle mouse leaving the container
  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel > minZoomLevel && e.touches.length === 1) {
      setIsDragging(true)
      const touch = e.touches[0]
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoomLevel > minZoomLevel && e.touches.length === 1) {
      e.preventDefault() // Prevent scrolling while panning
      const touch = e.touches[0]
      const newX = touch.clientX - dragStart.x
      const newY = touch.clientY - dragStart.y
      
      // Apply bounds to prevent panning too far
      const boundedPosition = getBoundedPosition(newX, newY)
      setPosition(boundedPosition)
    }
  }

  // Helper function to limit panning within reasonable bounds
  const getBoundedPosition = (x: number, y: number) => {
    if (!imageRef.current || !containerRef.current) {
      return { x, y }
    }

    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    
    // Estimate image dimensions based on aspect ratio and container
    const imgWidth = photo.dimensions ? 
      (containerHeight * (photo.dimensions.width / photo.dimensions.height)) : 
      containerWidth
    const imgHeight = photo.dimensions ? 
      (containerWidth * (photo.dimensions.height / photo.dimensions.width)) : 
      containerHeight
    
    // Calculate maximum panning distance based on zoom level
    // Allow panning until at least 20% of the image is still visible
    const zoomFactor = zoomLevel
    const scaledImgWidth = imgWidth * zoomFactor
    const scaledImgHeight = imgHeight * zoomFactor
    
    const maxPanX = Math.max(0, (scaledImgWidth - containerWidth) / 2 + containerWidth * 0.2)
    const maxPanY = Math.max(0, (scaledImgHeight - containerHeight) / 2 + containerHeight * 0.2)
    
    // Apply bounds
    const boundedX = Math.min(Math.max(x, -maxPanX), maxPanX)
    const boundedY = Math.min(Math.max(y, -maxPanY), maxPanY)
    
    return { x: boundedX, y: boundedY }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Determine object-fit style - always contain when using zoom levels
  const objectFitClass = "object-contain"

  // Determine cursor style based on zoom level and dragging state
  const cursorClass = zoomLevel > minZoomLevel
    ? isDragging ? "cursor-grabbing" : "cursor-grab" 
    : ""
    
  // Function to handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + zoomIncrement, maxZoomLevel))
  }
  
  // Function to handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - zoomIncrement, minZoomLevel))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full max-w-[95vw] max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
            ref={containerRef}
          >
            <div 
              className="relative overflow-hidden w-full h-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              ref={imageRef}
            >
              <div 
                style={{
                  transform: zoomLevel > minZoomLevel
                    ? `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})` 
                    : 'none',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformOrigin: 'center'
                }}
              >
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  className={`${objectFitClass} ${cursorClass}`}
                  sizes="95vw"
                  priority
                  quality={90}
                  draggable={false}
                />
              </div>
              
              {/* Pan hint */}
              {showPanHint && zoomLevel > minZoomLevel && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 text-foreground px-4 py-2 rounded-full shadow-lg backdrop-blur-sm text-sm font-medium animate-fade-out pointer-events-none">
                  Click and drag to pan
                </div>
              )}
            </div>
            
            {/* Zoom level indicator */}
            <div className="absolute bottom-4 left-4 bg-background/80 text-foreground px-3 py-1 rounded-full shadow-lg backdrop-blur-sm text-sm font-medium">
              {zoomLevel.toFixed(1)}x
            </div>
            
            {/* Zoom in button */}
            <button
              onClick={handleZoomIn}
              className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg hover:bg-background transition-colors backdrop-blur-sm disabled:opacity-50"
              aria-label="Zoom in"
              disabled={zoomLevel >= maxZoomLevel}
            >
              <Plus size={20} />
            </button>
            
            {/* Zoom out button */}
            <button
              onClick={handleZoomOut}
              className="absolute bottom-4 right-16 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg hover:bg-background transition-colors backdrop-blur-sm disabled:opacity-50"
              aria-label="Zoom out"
              disabled={zoomLevel <= minZoomLevel}
            >
              <Minus size={20} />
            </button>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg hover:bg-background transition-colors backdrop-blur-sm"
              aria-label="Close fullscreen view"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
