"use client"

import { useEffect, useRef } from "react"

function getOriginalSrc(webSrc: string): string {
  return webSrc.replace("/web/", "/original/")
}

export function ImageGallery() {
  const preloadedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const gallery = document.querySelector(".image-gallery")
    if (!gallery) return

    const images = Array.from(
      gallery.querySelectorAll("img")
    ) as HTMLImageElement[]

    // Background preload originals sequentially
    let cancelled = false
    const preloadOriginals = async () => {
      for (const img of images) {
        if (cancelled) break
        const webSrc = img.getAttribute("src")
        if (!webSrc) continue
        const originalSrc = getOriginalSrc(webSrc)
        if (preloadedRef.current.has(originalSrc)) continue

        await new Promise<void>((resolve) => {
          const preloadImg = new Image()
          preloadImg.onload = () => {
            preloadedRef.current.add(originalSrc)
            resolve()
          }
          preloadImg.onerror = () => resolve()
          preloadImg.src = originalSrc
        })
      }
    }

    // Delay preloading so it doesn't compete with initial page load
    const timer = setTimeout(preloadOriginals, 2000)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return null
}
