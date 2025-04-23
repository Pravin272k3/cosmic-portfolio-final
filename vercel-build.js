// vercel-build.js
import fs from 'fs';
import path from 'path';

console.log('🔍 Starting Vercel pre-build checks...');
console.log(`📌 Current working directory: ${process.cwd()}`);
console.log(`📌 Node.js version: ${process.version}`);
console.log(`📌 Environment: ${process.env.NODE_ENV || 'not set'}`);

// Check if TypeScript is installed
try {
  console.log('🔍 Checking for TypeScript installation...');
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

  if (packageJson.dependencies && packageJson.dependencies.typescript) {
    console.log(`✅ TypeScript is installed: ${packageJson.dependencies.typescript}`);
  } else if (packageJson.devDependencies && packageJson.devDependencies.typescript) {
    console.log(`✅ TypeScript is installed (dev): ${packageJson.devDependencies.typescript}`);
  } else {
    console.warn('⚠️ TypeScript is not found in package.json dependencies!');
  }

  // Check for type definitions
  const hasNodeTypes = (packageJson.dependencies && packageJson.dependencies['@types/node']) ||
                      (packageJson.devDependencies && packageJson.devDependencies['@types/node']);

  const hasReactTypes = (packageJson.dependencies && packageJson.dependencies['@types/react']) ||
                       (packageJson.devDependencies && packageJson.devDependencies['@types/react']);

  console.log(`${hasNodeTypes ? '✅' : '⚠️'} @types/node: ${hasNodeTypes ? 'Installed' : 'Not found'}`);
  console.log(`${hasReactTypes ? '✅' : '⚠️'} @types/react: ${hasReactTypes ? 'Installed' : 'Not found'}`);

} catch (err) {
  console.error('❌ Error checking package.json:', err);
}

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
  'src/utils/artworkUtils.ts',
  'tsconfig.json',
  'next.config.js'
];

let allFilesExist = true;

// Check each file
console.log('\n🔍 Checking critical files:');
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

// Create a simple tsconfig.json if it doesn't exist
if (!fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))) {
  console.log('⚠️ tsconfig.json not found, creating a basic one...');
  const basicTsConfig = {
    "compilerOptions": {
      "target": "es5",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": false,
      "forceConsistentCasingInFileNames": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve",
      "incremental": true,
      "paths": {
        "@/*": ["./src/*"]
      }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'tsconfig.json'),
    JSON.stringify(basicTsConfig, null, 2)
  );
  console.log('✅ Created basic tsconfig.json');
}

// Exit with appropriate code
if (!allFilesExist) {
  console.error('\n❌ Some critical files are missing. Build may fail.');
  // Continue anyway to see what happens
  console.log('⚠️ Continuing with build despite missing files...');
  process.exit(0);
} else {
  console.log('\n✅ All critical files exist. Proceeding with build.');
  process.exit(0);
}
