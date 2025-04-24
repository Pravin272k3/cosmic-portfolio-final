import { NextRequest, NextResponse } from 'next/server';
// This file is a Server Component by default
import {
  getAllArtworks,
  getArtworkById,
  getArtworksByCategory,
  addArtwork,
  updateArtwork,
  deleteArtwork,
  saveArtworkFile
} from '@/utils/artworkUtilsDB'; // Using the DB version
import { ArtworkCategory } from '@/types/artwork';

// GET all artworks or filtered by category
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const category = searchParams.get('category') as ArtworkCategory | null;

  try {
    if (id) {
      const artwork = await getArtworkById(Number(id));
      if (!artwork) {
        return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
      }
      return NextResponse.json(artwork);
    }

    if (category) {
      const artworks = await getArtworksByCategory(category);
      return NextResponse.json(artworks);
    }

    const artworks = await getAllArtworks();
    return NextResponse.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 });
  }
}

// POST a new artwork
export async function POST(request: NextRequest) {
  // Check authentication
  const cookies = request.cookies;
  const isAdmin = cookies.get('admin_authenticated')?.value === 'true';

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const file = formData.get('file') as File;

    if (!title || !category || !file) {
      return NextResponse.json(
        { error: 'Title, category, and file are required' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Only image files (jpg, jpeg, png, webp, gif) are allowed' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const filename = `artwork-${Date.now()}.${fileExtension}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save the file to Cloudinary and get the URL
    const imageUrl = await saveArtworkFile(buffer, filename);

    // Add artwork to database
    const newArtwork = await addArtwork({
      title,
      filename,
      imageUrl, // Store the Cloudinary URL
      category,
      createdAt: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    });

    return NextResponse.json(newArtwork, { status: 201 });
  } catch (error) {
    console.error('Error creating artwork:', error);
    return NextResponse.json(
      { error: 'Failed to create artwork' },
      { status: 500 }
    );
  }
}

// PUT to update an artwork
export async function PUT(request: NextRequest) {
  // Check authentication
  const cookies = request.cookies;
  const isAdmin = cookies.get('admin_authenticated')?.value === 'true';

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const file = formData.get('file') as File | null;

    if (!id || !title || !category) {
      return NextResponse.json(
        { error: 'ID, title, and category are required' },
        { status: 400 }
      );
    }

    const artworkId = Number(id);
    const existingArtwork = await getArtworkById(artworkId);

    if (!existingArtwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    let filename = existingArtwork.filename;
    let imageUrl = existingArtwork.imageUrl;

    // If a new file is provided, save it
    if (file) {
      // Get file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return NextResponse.json(
          { error: 'Only image files (jpg, jpeg, png, webp, gif) are allowed' },
          { status: 400 }
        );
      }

      // Generate a unique filename
      filename = `artwork-${Date.now()}.${fileExtension}`;

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Save the file to Cloudinary and get the URL
      imageUrl = await saveArtworkFile(buffer, filename);
    }

    // Update artwork in database
    const updatedArtwork = await updateArtwork(artworkId, {
      title,
      filename,
      imageUrl,
      category
    });

    if (!updatedArtwork) {
      return NextResponse.json(
        { error: 'Failed to update artwork' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedArtwork);
  } catch (error) {
    console.error('Error updating artwork:', error);
    return NextResponse.json(
      { error: 'Failed to update artwork' },
      { status: 500 }
    );
  }
}

// DELETE an artwork
export async function DELETE(request: NextRequest) {
  // Check authentication
  const cookies = request.cookies;
  const isAdmin = cookies.get('admin_authenticated')?.value === 'true';

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Artwork ID is required' },
      { status: 400 }
    );
  }

  try {
    const success = await deleteArtwork(Number(id));

    if (!success) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return NextResponse.json(
      { error: 'Failed to delete artwork' },
      { status: 500 }
    );
  }
}
