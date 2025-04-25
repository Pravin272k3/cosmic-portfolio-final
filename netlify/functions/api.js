// netlify/functions/api.js
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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Handle OPTIONS requests (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    // Parse the path to determine which API to call
    const path = event.path.replace('/.netlify/functions/api/', '');
    const segments = path.split('/');
    const apiName = segments[0];

    // Connect to MongoDB
    const db = await connectToDatabase(process.env.MONGODB_URI);

    // Handle different API endpoints
    if (apiName === 'skills') {
      return await handleSkillsApi(event, db, headers);
    } else if (apiName === 'projects') {
      return await handleProjectsApi(event, db, headers);
    } else if (apiName === 'settings') {
      return await handleSettingsApi(event, db, headers, segments);
    } else if (apiName === 'artworks') {
      return await handleArtworksApi(event, db, headers);
    } else if (apiName === 'blogs') {
      return await handleBlogsApi(event, db, headers);
    } else if (apiName === 'auth') {
      return await handleAuthApi(event, headers);
    }

    // Default response for unknown API
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'API not found' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

// Handle skills API
async function handleSkillsApi(event, db, headers) {
  const collection = db.collection('skills');

  if (event.httpMethod === 'GET') {
    const skills = await collection.find({}).sort({ id: 1 }).toArray();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(skills)
    };
  } else if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);

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
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(newSkill)
    };
  } else if (event.httpMethod === 'PUT') {
    const body = JSON.parse(event.body);

    const result = await collection.findOneAndUpdate(
      { id: body.id },
      { $set: { name: body.name, level: body.level } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ error: 'Skill not found' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(result)
    };
  } else if (event.httpMethod === 'DELETE') {
    const params = new URLSearchParams(event.queryStringParameters);
    const id = parseInt(params.get('id'));

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ error: 'Skill not found' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({ success: true })
    };
  }
}

// Placeholder functions for other APIs
async function handleProjectsApi(event, db, headers) {
  // Similar implementation to skills API
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({ message: 'Projects API not fully implemented yet' })
  };
}

async function handleSettingsApi(event, db, headers, segments) {
  // Similar implementation to skills API
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({ message: 'Settings API not fully implemented yet' })
  };
}

async function handleArtworksApi(event, db, headers) {
  // Similar implementation to skills API
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({ message: 'Artworks API not fully implemented yet' })
  };
}

async function handleBlogsApi(event, db, headers) {
  // Similar implementation to skills API
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({ message: 'Blogs API not fully implemented yet' })
  };
}

async function handleAuthApi(event, headers) {
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);

    // Check credentials
    if (body.email === process.env.ADMIN_EMAIL && body.password === process.env.ADMIN_PASSWORD) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'admin_authenticated=true; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400',
          ...headers
        },
        body: JSON.stringify({ success: true })
      };
    } else {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }
  } else if (event.httpMethod === 'DELETE') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'admin_authenticated=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
        ...headers
      },
      body: JSON.stringify({ success: true })
    };
  }
}
