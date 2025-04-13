const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const exifr = require('exifr');

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
 * Extract EXIF metadata from an image
 */
async function extractExifMetadata(imagePath: string): Promise<Record<string, any> | null> {
  try {
    // Parse EXIF data from the image
    const exif = await exifr.parse(imagePath, {
      // Specify which tags to extract
      tiff: true,
      exif: true,
      gps: true,
      ifd0: true,
      // Include all EXIF tags
      all: true
    });
    
    if (!exif) return null;
    
    // Map EXIF data to our metadata structure
    const metadata: Record<string, any> = {};
    
    // Camera model
    if (exif.Make && exif.Model) {
      metadata.camera = `${exif.Make} ${exif.Model}`.trim();
    } else if (exif.Model) {
      metadata.camera = exif.Model;
    }
    
    // Lens information
    if (exif.LensModel) {
      metadata.lens = exif.LensModel;
    } else if (exif.Lens) {
      metadata.lens = exif.Lens;
    }
    
    // Aperture
    if (exif.FNumber) {
      metadata.aperture = `f/${exif.FNumber.toFixed(1)}`;
    } else if (exif.ApertureValue) {
      metadata.aperture = `f/${Math.pow(Math.sqrt(2), exif.ApertureValue).toFixed(1)}`;
    }
    
    // Shutter speed
    if (exif.ExposureTime) {
      // Format exposure time as a fraction if less than 1 second
      if (exif.ExposureTime < 1) {
        const denominator = Math.round(1 / exif.ExposureTime);
        metadata.shutterSpeed = `1/${denominator}`;
      } else {
        metadata.shutterSpeed = `${exif.ExposureTime.toFixed(1)} seconds`;
      }
    } else if (exif.ShutterSpeedValue) {
      const exposureTime = Math.pow(2, -exif.ShutterSpeedValue);
      if (exposureTime < 1) {
        const denominator = Math.round(1 / exposureTime);
        metadata.shutterSpeed = `1/${denominator}`;
      } else {
        metadata.shutterSpeed = `${exposureTime.toFixed(1)} seconds`;
      }
    }
    
    // ISO
    if (exif.ISO) {
      metadata.iso = exif.ISO.toString();
    }
    
    // Date
    if (exif.DateTimeOriginal) {
      const date = new Date(exif.DateTimeOriginal);
      metadata.date = date.toISOString().split('T')[0];
    } else if (exif.CreateDate) {
      const date = new Date(exif.CreateDate);
      metadata.date = date.toISOString().split('T')[0];
    }
    
    // Location (if GPS data is available)
    if (exif.latitude && exif.longitude) {
      metadata.location = `${exif.latitude.toFixed(6)}, ${exif.longitude.toFixed(6)}`;
    }
    
    return metadata;
  } catch (error) {
    console.error('Error extracting EXIF metadata:', error);
    return null;
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
      
      // Extract EXIF metadata from the image
      const originalPath = path.join(originalDir, category, filename);
      const exifData = await extractExifMetadata(originalPath);
      
      if (exifData) {
        let imageMetadataUpdated = false;
        const imageMetadata = metadata[relPath].metadata;
        
        // Update "Unknown" fields with extracted EXIF data
        if (imageMetadata.camera === "Unknown" && exifData.camera) {
          imageMetadata.camera = exifData.camera;
          imageMetadataUpdated = true;
          console.log(`Updated camera for ${relPath}: ${exifData.camera}`);
        }
        
        if (imageMetadata.lens === "Unknown" && exifData.lens) {
          imageMetadata.lens = exifData.lens;
          imageMetadataUpdated = true;
          console.log(`Updated lens for ${relPath}: ${exifData.lens}`);
        }
        
        if (imageMetadata.aperture === "Unknown" && exifData.aperture) {
          imageMetadata.aperture = exifData.aperture;
          imageMetadataUpdated = true;
          console.log(`Updated aperture for ${relPath}: ${exifData.aperture}`);
        }
        
        if (imageMetadata.shutterSpeed === "Unknown" && exifData.shutterSpeed) {
          imageMetadata.shutterSpeed = exifData.shutterSpeed;
          imageMetadataUpdated = true;
          console.log(`Updated shutterSpeed for ${relPath}: ${exifData.shutterSpeed}`);
        }
        
        if (imageMetadata.iso === "Unknown" && exifData.iso) {
          imageMetadata.iso = exifData.iso;
          imageMetadataUpdated = true;
          console.log(`Updated iso for ${relPath}: ${exifData.iso}`);
        }
        
        if (imageMetadata.location === "Unknown" && exifData.location) {
          imageMetadata.location = exifData.location;
          imageMetadataUpdated = true;
          console.log(`Updated location for ${relPath}: ${exifData.location}`);
        }
        
        // Always update date if available from EXIF data
        if (exifData.date) {
          const oldValue = imageMetadata.date;
          imageMetadata.date = exifData.date;
          imageMetadataUpdated = true;
          console.log(`Updated date for ${relPath}: ${oldValue} -> ${exifData.date}`);
        }
        
        if (imageMetadataUpdated) {
          metadataUpdated = true;
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
