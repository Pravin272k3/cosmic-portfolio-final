// Client-side types for artwork data

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
