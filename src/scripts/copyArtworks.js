const fs = require('fs');
const path = require('path');

// Source and destination directories
const sourceDir = path.join(__dirname, '../../src/assets/sketches');
const destDir = path.join(__dirname, '../../public/artworks');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Read all files from source directory
try {
  const files = fs.readdirSync(sourceDir);
  
  // Copy each file to destination
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    // Check if it's a file
    if (fs.statSync(sourcePath).isFile()) {
      // Copy the file
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file}`);
    }
  });
  
  console.log('All artwork files copied successfully!');
} catch (error) {
  console.error('Error copying files:', error);
}
