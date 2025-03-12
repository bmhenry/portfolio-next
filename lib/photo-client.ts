import { 
  Photo, 
  getAllPhotoCategories as getCategories,
  getAllPhotos as getPhotos,
  getPhotosByCategory as getByCategory,
  getPhotosByTag as getByTag,
  getPhotoById as getById,
  getAllTags as getTags
} from './photos';

/**
 * @deprecated This client API module is deprecated. 
 * Use direct functions from lib/photos.ts instead for static site generation.
 */

/**
 * Get all photo categories
 * @deprecated Use getAllPhotoCategories from lib/photos.ts instead
 */
export async function getAllPhotoCategories(): Promise<string[]> {
  console.warn('Deprecated: Use getAllPhotoCategories from lib/photos.ts instead');
  return getCategories();
}

/**
 * Get all photos
 * @deprecated Use getAllPhotos from lib/photos.ts instead
 */
export async function getAllPhotos(): Promise<Photo[]> {
  console.warn('Deprecated: Use getAllPhotos from lib/photos.ts instead');
  return getPhotos();
}

/**
 * Get photos by category
 * @deprecated Use getPhotosByCategory from lib/photos.ts instead
 */
export async function getPhotosByCategory(category: string): Promise<Photo[]> {
  console.warn('Deprecated: Use getPhotosByCategory from lib/photos.ts instead');
  return getByCategory(category);
}

/**
 * Get photos by tag
 * @deprecated Use getPhotosByTag from lib/photos.ts instead
 */
export async function getPhotosByTag(tag: string): Promise<Photo[]> {
  console.warn('Deprecated: Use getPhotosByTag from lib/photos.ts instead');
  return getByTag(tag);
}

/**
 * Get a specific photo by category and id
 * @deprecated Use getPhotoById from lib/photos.ts instead
 */
export async function getPhotoById(category: string, id: string): Promise<Photo | null> {
  console.warn('Deprecated: Use getPhotoById from lib/photos.ts instead');
  return getById(category, id);
}

/**
 * Get all unique tags from all photos
 * @deprecated Use getAllTags from lib/photos.ts instead
 */
export async function getAllTags(): Promise<string[]> {
  console.warn('Deprecated: Use getAllTags from lib/photos.ts instead');
  return getTags();
}
