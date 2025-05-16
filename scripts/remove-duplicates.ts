import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as child_process from 'child_process';
import * as os from 'os';

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const createBackups = args.includes('--backup');
const processZips = args.includes('--process-zips');

// Base paths
const rootDir = path.resolve(__dirname, '..');
const originalDir = path.join(rootDir, 'public/photos/original');
const backupDir = path.join(rootDir, 'public/photos/duplicates-backup');

// Create backup directory if needed
if (createBackups && !fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log(`Mode: ${dryRun ? 'Dry run (no files will be removed)' : 'Normal operation'}`);
console.log(`Backup: ${createBackups ? 'Enabled (duplicates will be moved to backup directory)' : 'Disabled'}`);
console.log(`Process ZIP files: ${processZips ? 'Enabled' : 'Disabled'}`);

/**
 * Calculate SHA-256 hash of a file
 */
function calculateFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', (err: Error) => reject(err));
    stream.on('data', (chunk: Buffer | string) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

/**
 * Extract a ZIP file to a temporary directory
 */
function extractZipFile(zipPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a temporary directory
    const tempDir = path.join(os.tmpdir(), 'photo-duplicates-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Use unzip command to extract the ZIP file
    const unzipCommand = `unzip -j "${zipPath}" -d "${tempDir}"`;
    
    child_process.exec(unzipCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error extracting ZIP file: ${stderr}`);
        reject(error);
      } else {
        console.log(`Extracted ZIP file to ${tempDir}`);
        resolve(tempDir);
      }
    });
  });
}

/**
 * Get file stats including creation and modification times
 */
function getFileStats(filePath: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err: Error | null, stats: fs.Stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 * Find and remove duplicate files, keeping the oldest version
 */
async function removeDuplicates(): Promise<void> {
  try {
    // Get all files in the original directory
    const allFiles = fs.readdirSync(originalDir);
    
    // Filter image files
    const imageFiles = allFiles.filter((file: string) => 
      file.match(/\.(jpg|jpeg|png|gif)$/i)
    );
    
    // Filter ZIP files
    const zipFiles = allFiles.filter((file: string) => 
      file.toLowerCase().endsWith('.zip')
    );
    
    console.log(`Found ${imageFiles.length} image files in the original directory`);
    if (zipFiles.length > 0) {
      console.log(`Found ${zipFiles.length} ZIP files in the original directory`);
    }
    
    // Process ZIP files if enabled
    let extractedDirs: string[] = [];
    if (processZips && zipFiles.length > 0) {
      console.log('Processing ZIP files...');
      
      for (const zipFile of zipFiles) {
        const zipPath = path.join(originalDir, zipFile);
        try {
          const extractedDir = await extractZipFile(zipPath);
          extractedDirs.push(extractedDir);
        } catch (error) {
          console.error(`Failed to process ZIP file ${zipFile}:`, error);
        }
      }
    }
    
    // Map to store file hashes and their corresponding file paths
    const fileHashes: Map<string, Array<{ path: string, stats: fs.Stats }>> = new Map();
    
    // Process original directory images
    console.log('Processing images in original directory...');
    for (const filename of imageFiles) {
      const filePath = path.join(originalDir, filename);
      
      try {
        // Calculate file hash
        const hash = await calculateFileHash(filePath);
        
        // Get file stats
        const stats = await getFileStats(filePath);
        
        // Add to hash map
        if (!fileHashes.has(hash)) {
          fileHashes.set(hash, []);
        }
        
        fileHashes.get(hash)?.push({
          path: filePath,
          stats: stats
        });
        
      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
      }
    }
    
    // Find duplicates and remove them, keeping the oldest file
    let totalDuplicates = 0;
    let totalBytesRecovered = 0;
    
    for (const [hash, fileList] of fileHashes.entries()) {
      if (fileList.length > 1) {
        // Sort files by creation time (oldest first)
        fileList.sort((a, b) => {
          // Use birthtime (creation time) if available, otherwise use mtime (modification time)
          const timeA = a.stats.birthtime.getTime();
          const timeB = b.stats.birthtime.getTime();
          return timeA - timeB;
        });
        
        // Keep the oldest file, remove the rest
        const oldestFile = fileList[0];
        const duplicates = fileList.slice(1);
        
        console.log(`\nFound ${duplicates.length} duplicates of ${path.basename(oldestFile.path)}`);
        console.log(`  Keeping oldest file: ${path.basename(oldestFile.path)} (created: ${new Date(oldestFile.stats.birthtime).toLocaleString()})`);
        
        // Remove duplicates
        for (const duplicate of duplicates) {
          const filename = path.basename(duplicate.path);
          const dateStr = new Date(duplicate.stats.birthtime).toISOString();
          
          // Track statistics
          totalDuplicates++;
          totalBytesRecovered += duplicate.stats.size;
          
          // Handle the duplicate file
          if (dryRun) {
            console.log(`  [DRY RUN] Would remove: ${filename} (created: ${new Date(duplicate.stats.birthtime).toLocaleString()})`);
          } else if (createBackups) {
            const backupPath = path.join(backupDir, filename);
            console.log(`  Moving to backup: ${filename} (created: ${new Date(duplicate.stats.birthtime).toLocaleString()})`);
            fs.copyFileSync(duplicate.path, backupPath);
            fs.unlinkSync(duplicate.path);
          } else {
            console.log(`  Removing duplicate: ${filename} (created: ${new Date(duplicate.stats.birthtime).toLocaleString()})`);
            fs.unlinkSync(duplicate.path);
          }
        }
      }
    }
    
    // Process extracted files from ZIP archives
    if (processZips && extractedDirs.length > 0) {
      console.log('\nProcessing extracted files from ZIP archives...');
      
      for (const extractedDir of extractedDirs) {
        // Get all image files in the extracted directory
        const extractedFiles = fs.readdirSync(extractedDir).filter((file: string) => 
          file.match(/\.(jpg|jpeg|png|gif)$/i)
        );
        
        console.log(`Found ${extractedFiles.length} image files in extracted directory ${extractedDir}`);
        
        // Process each extracted file
        for (const filename of extractedFiles) {
          const filePath = path.join(extractedDir, filename);
          
          try {
            // Calculate file hash
            const hash = await calculateFileHash(filePath);
            
            // Get file stats
            const stats = await getFileStats(filePath);
            
            // Check if this file is a duplicate of any file in the original directory
            if (fileHashes.has(hash)) {
              const existingFiles = fileHashes.get(hash) || [];
              
              // Sort by creation time (oldest first)
              const allFiles = [...existingFiles, { path: filePath, stats }];
              allFiles.sort((a, b) => {
                const timeA = a.stats.birthtime.getTime();
                const timeB = b.stats.birthtime.getTime();
                return timeA - timeB;
              });
              
              const oldestFile = allFiles[0];
              
              // If the oldest file is from the original directory, this extracted file is a duplicate
              if (oldestFile.path.startsWith(originalDir)) {
                console.log(`\nFound duplicate in ZIP: ${filename}`);
                console.log(`  Original file: ${path.basename(oldestFile.path)} (created: ${new Date(oldestFile.stats.birthtime).toLocaleString()})`);
                
                // Track statistics
                totalDuplicates++;
                totalBytesRecovered += stats.size;
                
                // No need to delete the extracted file as we'll clean up the temp directory later
              } 
              // If the oldest file is from the extracted directory, copy it to the original directory
              else if (!dryRun && oldestFile.path === filePath) {
                const destPath = path.join(originalDir, filename);
                console.log(`\nFound older version in ZIP: ${filename}`);
                console.log(`  Copying to original directory: ${filename} (created: ${new Date(oldestFile.stats.birthtime).toLocaleString()})`);
                
                // Copy the file to the original directory
                fs.copyFileSync(filePath, destPath);
                
                // Remove any duplicates in the original directory
                for (const existingFile of existingFiles) {
                  if (existingFile.path.startsWith(originalDir)) {
                    const existingFilename = path.basename(existingFile.path);
                    
                    // Track statistics
                    totalDuplicates++;
                    totalBytesRecovered += existingFile.stats.size;
                    
                    // Handle the duplicate file
                    if (createBackups) {
                      const backupPath = path.join(backupDir, existingFilename);
                      console.log(`  Moving to backup: ${existingFilename} (created: ${new Date(existingFile.stats.birthtime).toLocaleString()})`);
                      fs.copyFileSync(existingFile.path, backupPath);
                      fs.unlinkSync(existingFile.path);
                    } else {
                      console.log(`  Removing duplicate: ${existingFilename} (created: ${new Date(existingFile.stats.birthtime).toLocaleString()})`);
                      fs.unlinkSync(existingFile.path);
                    }
                  }
                }
                
                // Update the hash map with the new file
                fileHashes.set(hash, [{ path: destPath, stats }]);
              }
            }
          } catch (error) {
            console.error(`Error processing extracted file ${filename}:`, error);
          }
        }
      }
      
      // Clean up extracted directories
      if (!dryRun) {
        console.log('\nCleaning up temporary directories...');
        for (const extractedDir of extractedDirs) {
          try {
            // Remove all files in the directory
            const files = fs.readdirSync(extractedDir);
            for (const file of files) {
              fs.unlinkSync(path.join(extractedDir, file));
            }
            
            // Remove the directory
            fs.rmdirSync(extractedDir);
            console.log(`Removed temporary directory: ${extractedDir}`);
          } catch (error) {
            console.error(`Error cleaning up directory ${extractedDir}:`, error);
          }
        }
      }
    }
    
    // Print summary
    if (totalDuplicates > 0) {
      if (dryRun) {
        console.log(`\n[DRY RUN] Would remove ${totalDuplicates} duplicate files`);
        console.log(`[DRY RUN] Would recover approximately ${(totalBytesRecovered / (1024 * 1024)).toFixed(2)} MB of disk space`);
      } else if (createBackups) {
        console.log(`\nMoved ${totalDuplicates} duplicate files to backup directory`);
        console.log(`Recovered approximately ${(totalBytesRecovered / (1024 * 1024)).toFixed(2)} MB of disk space`);
        console.log(`Backup location: ${backupDir}`);
      } else {
        console.log(`\nRemoved ${totalDuplicates} duplicate files`);
        console.log(`Recovered approximately ${(totalBytesRecovered / (1024 * 1024)).toFixed(2)} MB of disk space`);
      }
    } else {
      console.log('\nNo duplicate files found');
    }
    
  } catch (error) {
    console.error('Error removing duplicates:', error);
  }
}

// Run the script
removeDuplicates().then(() => {
  console.log('Duplicate removal complete');
  
  // Print usage instructions
  console.log('\nUsage:');
  console.log('  npx ts-node scripts/remove-duplicates.ts [options]');
  console.log('\nOptions:');
  console.log('  --dry-run       Preview what would be deleted without removing any files');
  console.log('  --backup        Move duplicates to a backup directory instead of deleting them');
  console.log('  --process-zips  Extract and process ZIP files for duplicates');
}).catch(error => {
  console.error('Error removing duplicates:', error);
});
