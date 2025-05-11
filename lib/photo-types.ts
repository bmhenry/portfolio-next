// Types for photo data that can be used in both server and client components
export type PhotoMetadata = {
  title: string;
  description: string;
  tags: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  metadata: Record<string, any>; // Allows any metadata attributes
};

export type Photo = {
  id: string;
  src: string;
  thumbSrc: string;
  alt: string;
} & PhotoMetadata;

/**
 * Filter photos by multiple tags (AND logic)
 */
export function filterPhotosByTags(photos: Photo[], tags: string[]): Photo[] {
  if (tags.length === 0) return photos;
  
  return photos.filter(photo => 
    tags.every(tag => photo.tags.includes(tag))
  );
}
