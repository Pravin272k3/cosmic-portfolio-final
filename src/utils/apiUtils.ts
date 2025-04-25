// Utility functions for API calls that work with both Netlify and Vercel

// Check if we're running on Netlify
export const isNetlify = (): boolean => {
  return typeof window !== 'undefined' &&
    (window.location.hostname.includes('netlify.app') ||
     window.location.hostname.includes('netlify.com'));
};

// Get the correct API base URL
export const getApiBaseUrl = (): string => {
  if (isNetlify()) {
    // When running on Netlify, we'll use the specific function endpoints
    // but the frontend code will still use /api paths
    return '/api';
  } else {
    // When running on Vercel or locally, use the standard Next.js API routes
    return '/api';
  }
};

// Helper function to construct API URLs
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash from endpoint if it exists
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};
