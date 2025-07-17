"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  alt,
  width = 200,
  height = 200,
  className = "",
  fallbackSrc = "/placeholder.svg"
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    } else {
      setHasError(true)
    }
  }

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted ${className}`}
        style={{ width, height }}
      >
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={false}
    />
  )
} 