// Mark this file as server-only
import 'server-only';
import clientPromise from './dbConnect';
import { ObjectId } from 'mongodb';

// For file uploads, we'll use Cloudinary
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface Artwork {
  id: number;
  title: string;
  filename: string;
  imageUrl: string; // New field for Cloudinary URL
  category: string;
  createdAt: string;
}

export type ArtworkCategory = 'All' | 'Charcoal' | 'Graphite' | 'Painting' | 'Scribble';

export const ARTWORK_CATEGORIES: ArtworkCategory[] = [
  'All', 'Charcoal', 'Graphite', 'Painting', 'Scribble'
];

// Get all artworks
export const getAllArtworks = async (): Promise<Artwork[]> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const artworks = await db
      .collection('artworks')
      .find({})
      .sort({ id: 1 })
      .toArray();
    
    return artworks as Artwork[];
  } catch (error) {
    console.error('Error reading artworks from database:', error);
    return [];
  }
};

// Get artworks by category
export const getArtworksByCategory = async (category: ArtworkCategory): Promise<Artwork[]> => {
  const artworks = await getAllArtworks();
  if (category === 'All') {
    return artworks;
  }
  return artworks.filter(artwork => artwork.category === category);
};

// Get a single artwork by ID
export const getArtworkById = async (id: number): Promise<Artwork | null> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const artwork = await db.collection('artworks').findOne({ id });
    
    return artwork as Artwork;
  } catch (error) {
    console.error('Error getting artwork by ID:', error);
    return null;
  }
};

// Add a new artwork
export const addArtwork = async (artwork: Omit<Artwork, 'id'>): Promise<Artwork> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Get all artworks to determine the next ID
    const artworks = await getAllArtworks();
    
    // Generate a new ID (max ID + 1)
    const newId = artworks.length > 0
      ? Math.max(...artworks.map(a => a.id)) + 1
      : 1;
    
    // Create new artwork
    const newArtwork: Artwork = {
      id: newId,
      ...artwork
    };
    
    // Insert into database
    await db.collection('artworks').insertOne(newArtwork);
    
    return newArtwork;
  } catch (error) {
    console.error('Error adding artwork to database:', error);
    throw new Error('Failed to add artwork');
  }
};

// Update an existing artwork
export const updateArtwork = async (id: number, updatedData: Partial<Omit<Artwork, 'id'>>): Promise<Artwork | null> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Update the artwork
    const result = await db.collection('artworks').findOneAndUpdate(
      { id },
      { $set: updatedData },
      { returnDocument: 'after' }
    );
    
    return result as unknown as Artwork;
  } catch (error) {
    console.error('Error updating artwork in database:', error);
    return null;
  }
};

// Delete an artwork
export const deleteArtwork = async (id: number): Promise<boolean> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Get the artwork to delete its image from Cloudinary
    const artwork = await getArtworkById(id);
    
    if (!artwork) return false;
    
    // Delete from Cloudinary if it exists
    if (artwork.imageUrl) {
      try {
        // Extract the public_id from the Cloudinary URL
        const publicId = artwork.imageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with deletion from database even if Cloudinary deletion fails
      }
    }
    
    // Delete from database
    const result = await db.collection('artworks').deleteOne({ id });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting artwork from database:', error);
    return false;
  }
};

// Upload artwork file to Cloudinary
export const uploadArtworkToCloudinary = async (file: Buffer, filename: string): Promise<string> => {
  try {
    // Convert buffer to base64
    const base64Data = `data:image/jpeg;base64,${file.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'portfolio-artworks',
      public_id: filename.split('.')[0], // Use filename without extension as public_id
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload artwork file');
  }
};

// Save uploaded artwork file and return the Cloudinary URL
export const saveArtworkFile = async (file: Buffer, filename: string): Promise<string> => {
  try {
    return await uploadArtworkToCloudinary(file, filename);
  } catch (error) {
    console.error('Error saving artwork file:', error);
    throw new Error('Failed to save artwork file');
  }
};
