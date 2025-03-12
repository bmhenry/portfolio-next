import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Photo, PhotoMetadata } from '@/lib/photos';

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
function getPhotosByCategory(category: string): Photo[] {
  return getAllPhotos().filter(photo => photo.category === category);
}

/**
 * Get a specific photo by category and id
 */
function getPhotoById(category: string, id: string): Photo | null {
  const photos = getPhotosByCategory(category);
  const photo = photos.find(p => p.id === id);
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

// API route handlers
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const category = searchParams.get('category');
  const id = searchParams.get('id');
  const tag = searchParams.get('tag');

  switch (action) {
    case 'getAllCategories':
      return NextResponse.json(getAllPhotoCategories());
    
    case 'getAllTags':
      return NextResponse.json(getAllTags());
    
    case 'getAllPhotos':
      return NextResponse.json(getAllPhotos());
    
    case 'getPhotosByCategory':
      if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
      }
      return NextResponse.json(getPhotosByCategory(category));
    
    case 'getPhotoById':
      if (!category || !id) {
        return NextResponse.json({ error: 'Category and ID are required' }, { status: 400 });
      }
      const photo = getPhotoById(category, id);
      if (!photo) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
      }
      return NextResponse.json(photo);
    
    case 'getPhotosByTag':
      if (!tag) {
        return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
      }
      const photos = getAllPhotos().filter(photo => photo.tags.includes(tag));
      return NextResponse.json(photos);
    
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
