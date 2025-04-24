// install-db-deps.js
import { execSync } from 'child_process';

console.log('📦 Installing MongoDB and Cloudinary dependencies...');

try {
  const installCommand = `npm install mongodb cloudinary`;
  console.log(`🔧 Running: ${installCommand}`);
  execSync(installCommand, { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully!');
} catch (err) {
  console.error('❌ Error installing dependencies:', err);
  process.exit(1);
}
