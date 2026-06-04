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

// Re-encode every image even if outputs already exist
const FORCE = process.argv.includes('--force');

// EXIF fields we copy into a photo's `metadata`, in display order
const EXIF_FIELDS = ['camera', 'lens', 'aperture', 'shutterSpeed', 'iso', 'location', 'date'];

/**
 * Read the photo metadata from the JSON file
 */
function readPhotoMetadata(): Record<string, any> {
  try {
    if (fs.existsSync(metadataPath)) {
      return JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
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
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    console.log('Metadata file updated successfully');
  } catch (error) {
    console.error('Error writing photo metadata:', error);
  }
}

/**
 * Extract EXIF metadata from an image, mapped to our metadata structure
 */
async function extractExifMetadata(imagePath: string): Promise<Record<string, any> | null> {
  try {
    const exif = await exifr.parse(imagePath, { all: true });
    if (!exif) return null;

    const metadata: Record<string, any> = {};

    // Camera model
    if (exif.Make && exif.Model) {
      metadata.camera = `${exif.Make} ${exif.Model}`.trim();
    } else if (exif.Model) {
      metadata.camera = exif.Model;
    }
    // Map the camera make to something more readable
    if (metadata.camera === 'FUJIFILM X-T30 II') {
      metadata.camera = 'Fuji X-T30 II';
    }

    // Lens information
    if (exif.LensModel) {
      metadata.lens = exif.LensModel;
    } else if (exif.Lens) {
      metadata.lens = exif.Lens;
    }
    // Map the lens names to something more readable
    if (metadata.lens === 'XF18-55mmF2.8-4 R LM OIS') {
      metadata.lens = 'Fuji 18-55mm f/2.8-4';
    } else if (metadata.lens === 'XF70-300mmF4-5.6 R LM OIS WR') {
      metadata.lens = 'Fuji 70-300mm f/4-5.6';
    }

    // Aperture
    if (exif.FNumber) {
      metadata.aperture = `f/${exif.FNumber.toFixed(1)}`;
    } else if (exif.ApertureValue) {
      metadata.aperture = `f/${Math.pow(Math.sqrt(2), exif.ApertureValue).toFixed(1)}`;
    }

    // Shutter speed
    const exposureTime = exif.ExposureTime ?? (exif.ShutterSpeedValue != null
      ? Math.pow(2, -exif.ShutterSpeedValue)
      : undefined);
    if (exposureTime != null) {
      metadata.shutterSpeed = exposureTime < 1
        ? `1/${Math.round(1 / exposureTime)}`
        : `${exposureTime.toFixed(1)} seconds`;
    }

    // ISO
    if (exif.ISO) {
      metadata.iso = exif.ISO.toString();
    }

    // Date
    const dateValue = exif.DateTimeOriginal ?? exif.CreateDate;
    if (dateValue) {
      metadata.date = new Date(dateValue).toISOString().split('T')[0];
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
 * Generate the web-optimized image and thumbnail, returning the oriented
 * (display) dimensions of the original.
 */
async function processImage(filename: string): Promise<{ width: number; height: number } | null> {
  const originalPath = path.join(originalDir, filename);
  const webPath = path.join(webDir, filename);
  const thumbnailPath = path.join(webDir, `${path.parse(filename).name}-thumb.jpg`);

  try {
    // Dimensions as displayed: swap when EXIF orientation is a 90° rotation
    // (5-8), since the web/thumbnail outputs below are auto-rotated.
    const { width, height, orientation } = await sharp(originalPath).metadata();
    const dimensions = orientation && orientation >= 5
      ? { width: height, height: width }
      : { width, height };

    await sharp(originalPath)
      .rotate() // Apply EXIF orientation
      .resize(WEB_IMAGE_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: IMAGE_QUALITY })
      .toFile(webPath);

    await sharp(originalPath)
      .rotate() // Apply EXIF orientation
      .resize(THUMBNAIL_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: IMAGE_QUALITY })
      .toFile(thumbnailPath);

    return dimensions;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    return null;
  }
}

/**
 * True if the image already has both outputs and a metadata entry with
 * dimensions, so it can be skipped unless --force is passed.
 */
function isAlreadyProcessed(filename: string, metadata: Record<string, any>): boolean {
  const thumbnailPath = path.join(webDir, `${path.parse(filename).name}-thumb.jpg`);
  return (
    fs.existsSync(path.join(webDir, filename)) &&
    fs.existsSync(thumbnailPath) &&
    !!metadata[filename]?.dimensions
  );
}

/**
 * Process all images in the original directory
 */
async function processAllImages(): Promise<void> {
  const metadata = readPhotoMetadata();
  let metadataUpdated = false;

  if (!fs.existsSync(webDir)) {
    fs.mkdirSync(webDir, { recursive: true });
  }

  const files = fs.readdirSync(originalDir).filter((file: string) =>
    file.match(/\.(jpg|jpeg|png|gif)$/i)
  );

  for (const filename of files) {
    if (!FORCE && isAlreadyProcessed(filename, metadata)) {
      console.log(`Skipping ${filename} (already processed)`);
      continue;
    }

    // Seed default metadata for images we haven't seen before
    if (!metadata[filename]) {
      metadata[filename] = {
        title: filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
        description: 'No description provided.',
        tags: [],
        metadata: {
          camera: 'Unknown',
          lens: 'Unknown',
          aperture: 'Unknown',
          shutterSpeed: 'Unknown',
          iso: 'Unknown',
          location: 'Unknown',
          date: 'Unknown',
        },
      };
      metadataUpdated = true;
      console.log(`Added metadata for ${filename}`);
    }

    console.log(`Processing ${filename}…`);
    const dimensions = await processImage(filename);

    if (dimensions) {
      const existing = metadata[filename].dimensions;
      if (!existing || existing.width !== dimensions.width || existing.height !== dimensions.height) {
        metadata[filename].dimensions = dimensions;
        metadataUpdated = true;
      }
    }

    // Fill any still-Unknown metadata fields from EXIF
    const exifData = await extractExifMetadata(path.join(originalDir, filename));
    if (exifData) {
      const imageMetadata = metadata[filename].metadata;
      for (const field of EXIF_FIELDS) {
        const current = imageMetadata[field];
        if ((current === undefined || current === 'Unknown') && exifData[field]) {
          imageMetadata[field] = exifData[field];
          metadataUpdated = true;
          console.log(`  ${field}: ${exifData[field]}`);
        }
      }
    }
  }

  if (metadataUpdated) {
    writePhotoMetadata(metadata);
  } else {
    console.log('Metadata unchanged');
  }
}

// Run the script
processAllImages().then(() => {
  console.log('Image processing complete');
}).catch(error => {
  console.error('Error processing images:', error);
});
