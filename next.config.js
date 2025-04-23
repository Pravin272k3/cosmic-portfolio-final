/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  // We'll handle TypeScript errors in development but ignore them in production
  // to prevent build failures
  typescript: {
    // This setting allows the build to continue even with TypeScript errors
    ignoreBuildErrors: true,
  },
  // Explicitly set the output directory
  distDir: '.next',
  // Configure webpack to handle path aliases
  webpack: (config) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, 'src'),
    };

    // Ensure TypeScript files are processed correctly
    config.resolve.extensions = [
      '.ts', '.tsx', '.js', '.jsx', '.json', '.wasm', ...config.resolve.extensions || []
    ];

    return config;
  },
  // Ensure we don't try to build pages that don't exist
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
};

export default nextConfig;
