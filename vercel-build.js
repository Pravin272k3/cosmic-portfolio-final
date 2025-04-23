// vercel-build.js
import fs from 'fs';
import path from 'path';

// Function to check if a file exists
function checkFileExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`✅ File exists: ${filePath}`);
      return true;
    } else {
      console.error(`❌ File missing: ${filePath}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error checking file: ${filePath}`, err);
    return false;
  }
}

// Check critical files
const criticalFiles = [
  'src/assets/images/pravin2.png',
  'src/types/artwork.ts',
  'src/components/Navigation3D.tsx',
  'src/utils/artworkUtils.ts'
];

let allFilesExist = true;

// Check each file
criticalFiles.forEach(file => {
  const exists = checkFileExists(path.join(process.cwd(), file));
  if (!exists) {
    allFilesExist = false;
  }
});

// Print directory structure for debugging
function listDir(dir, level = 0) {
  const indent = '  '.repeat(level);
  console.log(`${indent}📁 ${dir}`);
  
  try {
    const items = fs.readdirSync(path.join(process.cwd(), dir));
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(path.join(process.cwd(), itemPath));
      
      if (stats.isDirectory()) {
        listDir(itemPath, level + 1);
      } else {
        console.log(`${indent}  📄 ${item}`);
      }
    });
  } catch (err) {
    console.error(`${indent}❌ Error reading directory: ${dir}`, err);
  }
}

// List the src directory structure
console.log('\n📂 Directory Structure:');
listDir('src');

// Exit with appropriate code
if (!allFilesExist) {
  console.error('\n❌ Some critical files are missing. Build may fail.');
  process.exit(1);
} else {
  console.log('\n✅ All critical files exist. Proceeding with build.');
  process.exit(0);
}
