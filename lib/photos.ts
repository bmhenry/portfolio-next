import fs from 'fs';
import path from 'path';
import { Photo, PhotoMetadata } from './photo-types';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// Re-export types for convenience
export type { Photo, PhotoMetadata } from './photo-types';

/**
 * Parse markdown content to HTML
 */
export async function parseMarkdown(content: string): Promise<string> {
  if (!content) return '';
  
  const processedContent = await remark()
    .use(remarkGfm) // Adds support for GitHub Flavored Markdown
    .use(html)
    .process(content);
    
  return processedContent.toString();
}

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
  Object.entries(metadata).forEach(([filename, data]) => {
    const id = filename.replace(/\.[^/.]+$/, ''); // Remove file extension
    
    photos.push({
      id,
      src: `/photos/web/${filename}`,
      thumbSrc: `/photos/web/${id}-thumb.jpg`,
      alt: data.title,
      ...data
    });
  });

  return photos;
}

/**
 * Get a specific photo by id
 */
export function getPhotoById(id: string): Photo | null {
  const photo = getAllPhotos().find(p => p.id === id);
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

/**
 * Get all photos with parsed markdown descriptions
 */
export async function getAllPhotosWithParsedDescriptions(): Promise<Photo[]> {
  const photos = getAllPhotos();
  
  // Parse descriptions for all photos
  const photosWithParsedDescriptions = await Promise.all(
    photos.map(async (photo) => {
      const descriptionHtml = await parseMarkdown(photo.description);
      return {
        ...photo,
        descriptionHtml
      };
    })
  );
  
  return photosWithParsedDescriptions;
}

/**
 * Get a specific photo by id with parsed markdown description
 */
export async function getPhotoByIdWithParsedDescription(id: string): Promise<Photo | null> {
  const photo = getPhotoById(id);
  if (!photo) return null;
  
  const descriptionHtml = await parseMarkdown(photo.description);
  return {
    ...photo,
    descriptionHtml
  };
}
