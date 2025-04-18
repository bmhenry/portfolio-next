"use client"

import * as React from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function BackToTop() {
  const isMobile = useIsMobile()
  const [showButton, setShowButton] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Handle scroll event to show/hide the button
  React.useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      // Only update if no modal is open
      if (!isModalOpen) {
        setShowButton(window.scrollY > 300)
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)
    
    // Initial check
    handleScroll()
    
    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isModalOpen])

  // Listen for photo modal events
  React.useEffect(() => {
    const handleModalOpen = () => {
      setIsModalOpen(true)
      setShowButton(false) // Hide button when modal opens
    }
    
    const handleModalClose = () => {
      setIsModalOpen(false)
      // Check scroll position to determine if button should be shown
      setShowButton(window.scrollY > 300)
    }
    
    // Add event listeners
    window.addEventListener("photoModalOpen", handleModalOpen)
    window.addEventListener("photoModalClose", handleModalClose)
    
    // Clean up
    return () => {
      window.removeEventListener("photoModalOpen", handleModalOpen)
      window.removeEventListener("photoModalClose", handleModalClose)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  // Use the same floating button for both mobile and desktop
  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "fixed z-50 rounded-full opacity-80 hover:opacity-100 shadow-md transition-all duration-300",
        // Adjust position based on device type
        isMobile 
          ? "bottom-6 right-6" 
          : "bottom-8 right-8",
        // Show/hide based on scroll position
        showButton ? "translate-y-0" : "translate-y-20"
      )}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ChevronUp className={cn(
        "h-5 w-5",
        // Slightly smaller icon on mobile if needed
        isMobile && "h-4 w-4"
      )} />
    </Button>
  )
}
