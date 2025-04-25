// Mark this file as server-only
import 'server-only';
import { MongoClient, MongoClientOptions } from 'mongodb';

// Connection URI
const uri = process.env.MONGODB_URI || '';
const options: MongoClientOptions = {};

// Cache the MongoDB connection to reuse it across function invocations
let cachedClient: MongoClient | null = null;
let cachedClientPromise: Promise<MongoClient> | null = null;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

export default async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedClientPromise) {
    return {
      client: cachedClient,
      clientPromise: cachedClientPromise,
    };
  }

  // Create a new client and connect
  const client = new MongoClient(uri, options);
  const clientPromise = client.connect();

  // Cache the client and promise for reuse
  cachedClient = client;
  cachedClientPromise = clientPromise;

  return {
    client,
    clientPromise,
  };
}

// This is a utility function to get a database connection
// It's designed to work well with Netlify Functions
export async function getMongoDb() {
  const { clientPromise } = await connectToDatabase();
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB);
}
