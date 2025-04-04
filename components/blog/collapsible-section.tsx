"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // This ensures the component works with SSR and static exports
  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="my-4 border rounded-md overflow-hidden bg-blue-50/50 dark:bg-blue-950/20"
    >
      <CollapsibleTrigger className="flex items-center w-full p-3 text-left font-medium hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
        <ChevronRight
          className={`mr-2 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-90" : ""
          }`}
        />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="pt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// This component is used to hydrate the collapsible sections from HTML
export function HydrateCollapsibleSections() {
  useEffect(() => {
    const collapsibleElements = document.querySelectorAll('[data-collapsible]')
    
    collapsibleElements.forEach(element => {
      const titleElement = element.querySelector('[data-collapsible-title]')
      const contentElement = element.querySelector('[data-collapsible-content]')
      
      if (titleElement && contentElement) {
        const title = titleElement.textContent || ''
        const isOpen = element.hasAttribute('data-collapsible-open')
        
        // Apply styling to the existing elements instead of replacing them
        // This preserves the content and structure
        element.className = 'my-4 border rounded-md overflow-hidden bg-blue-50/50 dark:bg-blue-950/20'
        element.setAttribute('data-state', isOpen ? 'open' : 'closed')
        
        // Style the title element as a button
        titleElement.className = 'flex items-center w-full p-3 text-left font-medium hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer'
        titleElement.setAttribute('role', 'button')
        titleElement.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
        
        // Add the chevron icon
        const chevron = document.createElement('span')
        chevron.className = `inline-block mr-2 transition-transform duration-200 ${isOpen ? "transform rotate-90" : ""}`
        chevron.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><polyline points="9 18 15 12 9 6"></polyline></svg>`
        
        // Insert the chevron at the beginning of the title
        titleElement.insertBefore(chevron, titleElement.firstChild)
        
        // Style the content element
        contentElement.className = 'p-4 pt-0'
        if (!isOpen) {
          (contentElement as HTMLElement).style.display = 'none'
        }
        contentElement.setAttribute('data-state', isOpen ? 'open' : 'closed')
        
        // Add event listener for toggling
        titleElement.addEventListener('click', () => {
          const isCurrentlyOpen = element.getAttribute('data-state') === 'open'
          element.setAttribute('data-state', isCurrentlyOpen ? 'closed' : 'open')
          titleElement.setAttribute('aria-expanded', isCurrentlyOpen ? 'false' : 'true')
          
          if (isCurrentlyOpen) {
            (contentElement as HTMLElement).style.display = 'none'
            chevron.classList.remove('transform', 'rotate-90')
          } else {
            (contentElement as HTMLElement).style.display = 'block'
            chevron.classList.add('transform', 'rotate-90')
          }
          
          contentElement.setAttribute('data-state', isCurrentlyOpen ? 'closed' : 'open')
        })
      }
    })
  }, [])
  
  return null
}
