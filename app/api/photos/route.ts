import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Photo, PhotoMetadata } from '@/lib/photos';

// Configure this route for static export
export const dynamic = "force-static";
export const revalidate = false;
export const fetchCache = "force-cache";

// Base paths
const photosDirectory = path.join(process.cwd(), 'public/photos');
const metadataPath = path.join(process.cwd(), 'content/photos/metadata.json');

/**
 * Read the photo metadata from the JSON file
 */
function readPhotoMetadata(): Record<string, PhotoMetadata> {
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
function getAllPhotoCategories(): string[] {
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
function getAllPhotos(): Photo[] {
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
 * Get a specific photo by and id
 */
function getPhotoById(id: string): Photo | null {
  const photo = getAllPhotos().find(p => p.id === id);
  return photo || null;
}

/**
 * Get all unique tags from all photos
 */
function getAllTags(): string[] {
  const photos = getAllPhotos();
  const tagsSet = new Set<string>();
  
  photos.forEach(photo => {
    photo.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}

// Generate static data for all photos
export async function GET() {
  // Return all photos data in a single response
  const data = {
    categories: getAllPhotoCategories(),
    tags: getAllTags(),
    photos: getAllPhotos()
  };
  
  return NextResponse.json(data);
}
