"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Image as ImageIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CollapsibleImageProps {
  title: string;
  src: string;
  alt: string;
}

export function CollapsibleImage({
  title,
  src,
  alt
}: CollapsibleImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="my-4 border rounded-md overflow-hidden bg-gray-100/50 dark:bg-gray-800/20"
    >
      <CollapsibleTrigger className="flex items-center w-full p-3 text-left font-medium hover:bg-gray-200/50 dark:hover:bg-gray-700/20 transition-colors">
        <ChevronRight
          className={`mr-2 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-90" : ""
          }`}
        />
        <ImageIcon className="mr-2 h-4 w-4" />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="pt-2">
          <img src={src} alt={alt || title} className="w-full" />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// This component is used to hydrate the collapsible images from HTML
export function HydrateCollapsibleImages() {
  useEffect(() => {
    const collapsibleElements = document.querySelectorAll('[data-collapsible-image]');
    
    collapsibleElements.forEach((element) => {
      const titleEl = element.querySelector('[data-collapsible-image-title]');
      const contentEl = element.querySelector('[data-collapsible-image-content]');
      
      if (!titleEl || !contentEl) return;
      
      // Type assertions
      const titleElement = titleEl as HTMLElement;
      const contentElement = contentEl as HTMLElement;
      
      // Apply styling to the existing elements
      element.className = 'my-4 border rounded-md overflow-hidden bg-gray-100/50 dark:bg-gray-800/20';
      element.setAttribute('data-state', 'closed');
      
      // Style the title element as a button
      titleElement.className = 'flex items-center w-full p-3 text-left font-medium hover:bg-gray-200/50 dark:hover:bg-gray-700/20 transition-colors cursor-pointer';
      titleElement.setAttribute('role', 'button');
      titleElement.setAttribute('aria-expanded', 'false');
      
      // Add the chevron icon
      const chevron = document.createElement('span');
      chevron.className = 'inline-block mr-2 transition-transform duration-200';
      chevron.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      
      // Add the image icon
      const imageIcon = document.createElement('span');
      imageIcon.className = 'inline-block mr-2';
      imageIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
      
      // Insert the icons at the beginning of the title
      titleElement.insertBefore(imageIcon, titleElement.firstChild);
      titleElement.insertBefore(chevron, titleElement.firstChild);
      
      // Style the content element
      contentElement.className = 'p-4 pt-0';
      contentElement.style.display = 'none';
      contentElement.setAttribute('data-state', 'closed');
      
      // Add event listener for toggling
      titleElement.addEventListener('click', () => {
        const isCurrentlyOpen = element.getAttribute('data-state') === 'open';
        element.setAttribute('data-state', isCurrentlyOpen ? 'closed' : 'open');
        titleElement.setAttribute('aria-expanded', isCurrentlyOpen ? 'false' : 'true');
        
        if (isCurrentlyOpen) {
          contentElement.style.display = 'none';
          chevron.classList.remove('transform', 'rotate-90');
        } else {
          contentElement.style.display = 'block';
          chevron.classList.add('transform', 'rotate-90');
        }
        
        contentElement.setAttribute('data-state', isCurrentlyOpen ? 'closed' : 'open');
      });
    });
  }, []);
  
  return null;
}
