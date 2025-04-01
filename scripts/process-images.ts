const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Base paths
const rootDir = path.resolve(__dirname, '..');
const photosDirectory = path.join(rootDir, 'public/photos');
const originalDir = path.join(photosDirectory, 'original');
const webDir = path.join(photosDirectory, 'web');
const metadataPath = path.join(rootDir, 'content/photos/metadata.json');

// Configuration
const WEB_IMAGE_WIDTH = 1200;
const THUMBNAIL_WIDTH = 300;
const IMAGE_QUALITY = 80;

/**
 * Read the photo metadata from the JSON file
 */
function readPhotoMetadata(): Record<string, any> {
  try {
    if (fs.existsSync(metadataPath)) {
      const jsonData = fs.readFileSync(metadataPath, 'utf8');
      return JSON.parse(jsonData);
    }
    return {};
  } catch (error) {
    console.error('Error reading photo metadata:', error);
    return {};
  }
}

/**
 * Write the photo metadata to the JSON file
 */
function writePhotoMetadata(metadata: Record<string, any>): void {
  try {
    const jsonData = JSON.stringify(metadata, null, 2);
    fs.writeFileSync(metadataPath, jsonData, 'utf8');
    console.log('Metadata file updated successfully');
  } catch (error) {
    console.error('Error writing photo metadata:', error);
  }
}

/**
 * Process a single image
 */
async function processImage(
  category: string,
  filename: string,
  metadata: Record<string, any>
): Promise<{ width: number; height: number } | null> {
  const originalPath = path.join(originalDir, category, filename);
  const webPath = path.join(webDir, category, filename);
  const fileNameWithoutExt = path.parse(filename).name;
  const thumbnailPath = path.join(webDir, category, `${fileNameWithoutExt}-thumb.jpg`);
  
  // Create category directory in web if it doesn't exist
  const webCategoryDir = path.join(webDir, category);
  if (!fs.existsSync(webCategoryDir)) {
    fs.mkdirSync(webCategoryDir, { recursive: true });
  }
  
  try {
    // Get image dimensions
    const imageMetadata = await sharp(originalPath).metadata();
    const width = imageMetadata.width;
    const height = imageMetadata.height;
    
    // Process web-optimized version
    await sharp(originalPath)
      .rotate() // Preserve EXIF orientation
      .resize(WEB_IMAGE_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: IMAGE_QUALITY })
      .toFile(webPath);
    
    // Process thumbnail
    await sharp(originalPath)
      .rotate() // Preserve EXIF orientation
      .resize(THUMBNAIL_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: IMAGE_QUALITY })
      .toFile(thumbnailPath);
    
    console.log(`Processed ${category}/${filename}`);
    
    // Return dimensions for metadata update
    return { width, height };
  } catch (error) {
    console.error(`Error processing ${category}/${filename}:`, error);
    return null;
  }
}

/**
 * Process all images in the original directory
 */
async function processAllImages(): Promise<void> {
  // Read existing metadata
  const metadata = readPhotoMetadata();
  let metadataUpdated = false;
  
  // Get all categories
  const categories = fs.readdirSync(originalDir).filter((file: string) => 
    fs.statSync(path.join(originalDir, file)).isDirectory()
  );
  
  // Process each category
  for (const category of categories) {
    const categoryPath = path.join(originalDir, category);
    const files = fs.readdirSync(categoryPath).filter((file: string) => 
      file.match(/\.(jpg|jpeg|png|gif)$/i)
    );
    
    // Process each image in the category
    for (const filename of files) {
      const relPath = `${category}/${filename}`;
      
      // Check if metadata exists for this image
      if (!metadata[relPath]) {
        // Add default metadata
        metadata[relPath] = {
          title: filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
          description: "No description provided.",
          tags: [category],
          metadata: {
            camera: "Unknown",
            lens: "Unknown",
            aperture: "Unknown",
            shutterSpeed: "Unknown",
            iso: "Unknown",
            location: "Unknown",
            date: new Date().toISOString().split('T')[0]
          }
        };
        metadataUpdated = true;
        console.log(`Added metadata for ${relPath}`);
      }
      
      // Process the image and get dimensions
      const dimensions = await processImage(category, filename, metadata);
      
      // Update metadata with dimensions if available
      if (dimensions) {
        if (!metadata[relPath].dimensions) {
          metadata[relPath].dimensions = dimensions;
          metadataUpdated = true;
          console.log(`Added dimensions for ${relPath}`);
        }
      }
    }
  }
  
  // Save updated metadata if needed
  if (metadataUpdated) {
    writePhotoMetadata(metadata);
  }
}

// Run the script
processAllImages().then(() => {
  console.log('Image processing complete');
}).catch(error => {
  console.error('Error processing images:', error);
});
