// netlify-build.js
console.log('Running Netlify build script...');

// This script can be used to perform any pre-build tasks specific to Netlify
// For example, you could validate environment variables or set up database migrations

// Check for required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EMAILJS_SERVICE_ID',
  'EMAILJS_TEMPLATE_ID',
  'EMAILJS_PUBLIC_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: The following environment variables are missing: ${missingEnvVars.join(', ')}`);
  console.warn('Some functionality may not work correctly without these variables.');
} else {
  console.log('All required environment variables are present.');
}

console.log('Netlify build script completed successfully.');
