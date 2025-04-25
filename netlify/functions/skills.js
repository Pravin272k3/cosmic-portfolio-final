// netlify/functions/skills.js
const { MongoClient } = require('mongodb');

// MongoDB connection
let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  cachedDb = db;
  return db;
}

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
    // Connect to MongoDB
    const db = await connectToDatabase(process.env.MONGODB_URI);
    const collection = db.collection('skills');

    // Handle different HTTP methods
    if (event.httpMethod === 'GET') {
      // Check if a specific skill is requested
      if (event.queryStringParameters && event.queryStringParameters.id) {
        const id = parseInt(event.queryStringParameters.id);
        const skill = await collection.findOne({ id });
        
        if (!skill) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Skill not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(skill)
        };
      }
      
      // Return all skills
      const skills = await collection.find({}).sort({ id: 1 }).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(skills)
      };
    } else if (event.httpMethod === 'POST') {
      // Check authentication
      if (!isAuthenticated(event)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }
      
      const body = JSON.parse(event.body);
      
      // Validate required fields
      if (!body.name || body.level === undefined || body.level === null) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Name and level are required' })
        };
      }
      
      // Validate level is between 0 and 100
      if (body.level < 0 || body.level > 100) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Level must be between 0 and 100' })
        };
      }
      
      // Get all skills to determine the next ID
      const skills = await collection.find({}).toArray();
      const newId = skills.length > 0 ? Math.max(...skills.map(s => s.id)) + 1 : 1;
      
      const newSkill = {
        id: newId,
        name: body.name,
        level: body.level
      };
      
      await collection.insertOne(newSkill);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newSkill)
      };
    } else if (event.httpMethod === 'PUT') {
      // Check authentication
      if (!isAuthenticated(event)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }
      
      const body = JSON.parse(event.body);
      
      if (!body.id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Skill ID is required' })
        };
      }
      
      // Validate level is between 0 and 100 if provided
      if (body.level !== undefined && (body.level < 0 || body.level > 100)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Level must be between 0 and 100' })
        };
      }
      
      const result = await collection.findOneAndUpdate(
        { id: body.id },
        { 
          $set: { 
            name: body.name,
            level: body.level
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Skill not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      };
    } else if (event.httpMethod === 'DELETE') {
      // Check authentication
      if (!isAuthenticated(event)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }
      
      if (!event.queryStringParameters || !event.queryStringParameters.id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Skill ID is required' })
        };
      }
      
      const id = parseInt(event.queryStringParameters.id);
      const result = await collection.deleteOne({ id });
      
      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Skill not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
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

// Helper function to check if the request is authenticated
function isAuthenticated(event) {
  // Check for admin_authenticated cookie
  const cookies = parseCookies(event.headers.cookie || '');
  return cookies.admin_authenticated === 'true';
}

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
