// netlify/functions/auth.js

// Main handler function
exports.handler = async (event, context) => {
  // For local development support
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS requests (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    // Handle login (POST)
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      
      // Check credentials
      if (body.email === process.env.ADMIN_EMAIL && body.password === process.env.ADMIN_PASSWORD) {
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Set-Cookie': 'admin_authenticated=true; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400'
          },
          body: JSON.stringify({ success: true })
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }
    } 
    // Handle logout (DELETE)
    else if (event.httpMethod === 'DELETE') {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': 'admin_authenticated=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
        },
        body: JSON.stringify({ success: true })
      };
    }
    // Handle check auth status (GET)
    else if (event.httpMethod === 'GET') {
      const cookies = parseCookies(event.headers.cookie || '');
      const isAuthenticated = cookies.admin_authenticated === 'true';
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ authenticated: isAuthenticated })
      };
    }
    
    // Default response for unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

// Helper function to parse cookies
function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) return cookies;
  
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    const value = parts[1] || '';
    cookies[name] = value.trim();
  });
  
  return cookies;
}
