// Mark this file as server-only
import 'server-only';

import fs from 'fs';
import path from 'path';

export interface Artwork {
  id: number;
  title: string;
  filename: string;
  category: string;
  createdAt: string;
}

export type ArtworkCategory = 'All' | 'Charcoal' | 'Graphite' | 'Painting' | 'Scribble';

export const ARTWORK_CATEGORIES: ArtworkCategory[] = [
  'All', 'Charcoal', 'Graphite', 'Painting', 'Scribble'
];

const artworksFilePath = path.join(process.cwd(), 'src/data/artworks.json');
const artworksDirectory = path.join(process.cwd(), 'public/artworks');

// Get all artworks
export const getAllArtworks = (): Artwork[] => {
  try {
    const fileContents = fs.readFileSync(artworksFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading artworks:', error);
    return [];
  }
};

// Get artworks by category
export const getArtworksByCategory = (category: ArtworkCategory): Artwork[] => {
  const artworks = getAllArtworks();
  if (category === 'All') {
    return artworks;
  }
  return artworks.filter(artwork => artwork.category === category);
};

// Get a single artwork by ID
export const getArtworkById = (id: number): Artwork | null => {
  const artworks = getAllArtworks();
  return artworks.find(artwork => artwork.id === id) || null;
};

// Add a new artwork
export const addArtwork = (artwork: Omit<Artwork, 'id'>): Artwork => {
  const artworks = getAllArtworks();

  // Generate a new ID (max ID + 1)
  const newId = artworks.length > 0
    ? Math.max(...artworks.map(a => a.id)) + 1
    : 1;

  // Create new artwork
  const newArtwork: Artwork = {
    id: newId,
    ...artwork
  };

  // Add to artworks array and save
  const updatedArtworks = [...artworks, newArtwork];
  fs.writeFileSync(artworksFilePath, JSON.stringify(updatedArtworks, null, 2));

  return newArtwork;
};

// Update an existing artwork
export const updateArtwork = (id: number, updatedData: Partial<Omit<Artwork, 'id'>>): Artwork | null => {
  const artworks = getAllArtworks();
  const artworkIndex = artworks.findIndex(artwork => artwork.id === id);

  if (artworkIndex === -1) return null;

  // Update the artwork
  const updatedArtwork = { ...artworks[artworkIndex], ...updatedData };
  artworks[artworkIndex] = updatedArtwork;

  // Save updated artworks
  fs.writeFileSync(artworksFilePath, JSON.stringify(artworks, null, 2));

  return updatedArtwork;
};

// Delete an artwork
export const deleteArtwork = (id: number): boolean => {
  const artworks = getAllArtworks();
  const artwork = artworks.find(a => a.id === id);

  if (!artwork) return false;

  // Delete the image file if it exists
  try {
    const filePath = path.join(artworksDirectory, artwork.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting artwork file:', error);
    // Continue with deletion from JSON even if file deletion fails
  }

  // Remove from artworks array
  const filteredArtworks = artworks.filter(artwork => artwork.id !== id);

  if (filteredArtworks.length === artworks.length) {
    return false; // Artwork not found
  }

  // Save updated artworks
  fs.writeFileSync(artworksFilePath, JSON.stringify(filteredArtworks, null, 2));

  return true;
};

// Save uploaded artwork file
export const saveArtworkFile = async (file: Buffer, filename: string): Promise<void> => {
  try {
    // Ensure the artworks directory exists
    if (!fs.existsSync(artworksDirectory)) {
      fs.mkdirSync(artworksDirectory, { recursive: true });
    }

    // Save the file
    const filePath = path.join(artworksDirectory, filename);
    fs.writeFileSync(filePath, file);
  } catch (error) {
    console.error('Error saving artwork file:', error);
    throw new Error('Failed to save artwork file');
  }
};
