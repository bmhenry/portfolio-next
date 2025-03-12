import fs from 'fs';
import path from 'path';
import { Photo, PhotoMetadata } from './photo-types';

// Re-export types for convenience
export type { Photo, PhotoMetadata } from './photo-types';

// Base paths
const photosDirectory = path.join(process.cwd(), 'public/photos');
const metadataPath = path.join(process.cwd(), 'content/photos/metadata.json');

/**
 * Read the photo metadata from the JSON file
 */
export function readPhotoMetadata(): Record<string, PhotoMetadata> {
  try {
    const jsonData = fs.readFileSync(metadataPath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading photo metadata:', error);
    return {};
  }
}

/**
 * Get all photo categories
 */
export function getAllPhotoCategories(): string[] {
  try {
    const originalDir = path.join(photosDirectory, 'original');
    return fs.readdirSync(originalDir).filter(file => 
      fs.statSync(path.join(originalDir, file)).isDirectory()
    );
  } catch (error) {
    console.error('Error getting photo categories:', error);
    return [];
  }
}

/**
 * Get all photos
 */
export function getAllPhotos(): Photo[] {
  const metadata = readPhotoMetadata();
  const photos: Photo[] = [];

  // Process each entry in the metadata
  Object.entries(metadata).forEach(([key, data]) => {
    const [category, filename] = key.split('/');
    const id = filename.replace(/\.[^/.]+$/, ''); // Remove file extension
    
    photos.push({
      id,
      category,
      src: `/photos/web/${category}/${filename}`,
      thumbSrc: `/photos/web/${category}/${id}-thumb.jpg`,
      alt: data.title,
      ...data
    });
  });

  return photos;
}

/**
 * Get photos by category
 */
export function getPhotosByCategory(category: string): Photo[] {
  return getAllPhotos().filter(photo => photo.category === category);
}

/**
 * Get a specific photo by category and id
 */
export function getPhotoById(category: string, id: string): Photo | null {
  const photos = getPhotosByCategory(category);
  const photo = photos.find(p => p.id === id);
  return photo || null;
}

/**
 * Get all unique tags from all photos
 */
export function getAllTags(): string[] {
  const photos = getAllPhotos();
  const tagsSet = new Set<string>();
  
  photos.forEach(photo => {
    if (photo.tags) {
      photo.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Filter photos by multiple tags (AND logic)
 */
export function filterPhotosByTags(photos: Photo[], tags: string[]): Photo[] {
  if (tags.length === 0) return photos;
  
  return photos.filter(photo => 
    tags.every(tag => photo.tags.includes(tag))
  );
}

/**
 * Get photos by tag
 */
export function getPhotosByTag(tag: string): Photo[] {
  return getAllPhotos().filter(photo => photo.tags && photo.tags.includes(tag));
}
