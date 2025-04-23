// install-typescript.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Checking TypeScript installation...');

try {
  // Check if TypeScript is installed
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  
  const hasTypeScript = (packageJson.dependencies && packageJson.dependencies.typescript) || 
                       (packageJson.devDependencies && packageJson.devDependencies.typescript);
  
  const hasNodeTypes = (packageJson.dependencies && packageJson.dependencies['@types/node']) || 
                      (packageJson.devDependencies && packageJson.devDependencies['@types/node']);
  
  const hasReactTypes = (packageJson.dependencies && packageJson.dependencies['@types/react']) || 
                       (packageJson.devDependencies && packageJson.devDependencies['@types/react']);
  
  // Install missing packages
  if (!hasTypeScript || !hasNodeTypes || !hasReactTypes) {
    console.log('📦 Installing missing TypeScript packages...');
    
    const packagesToInstall = [];
    if (!hasTypeScript) packagesToInstall.push('typescript');
    if (!hasNodeTypes) packagesToInstall.push('@types/node');
    if (!hasReactTypes) packagesToInstall.push('@types/react');
    
    if (packagesToInstall.length > 0) {
      const installCommand = `npm install ${packagesToInstall.join(' ')}`;
      console.log(`🔧 Running: ${installCommand}`);
      execSync(installCommand, { stdio: 'inherit' });
      console.log('✅ TypeScript packages installed successfully!');
    }
  } else {
    console.log('✅ All TypeScript packages are already installed.');
  }
} catch (err) {
  console.error('❌ Error:', err);
  process.exit(1);
}
