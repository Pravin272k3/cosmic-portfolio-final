// netlify/functions/api.js
const { createRequestHandler } = require('@netlify/next');

// Create a Netlify Function handler that will handle Next.js API routes
module.exports.handler = createRequestHandler({
  // The absolute path to the Next.js application
  dir: __dirname,
  
  // Set to true if you're using API Routes
  enableAPI: true,
  
  // Optional: Specify the maximum duration of a function in seconds
  timeout: 30,
  
  // Optional: Specify the memory limit for the function in MB
  memory: 1024,
});
