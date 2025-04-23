import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllBlogPosts, 
  getBlogPostById, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} from '@/utils/blogUtils';
import { isAuthenticated } from '@/utils/auth';

// GET all blog posts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (id) {
    const post = getBlogPostById(Number(id));
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  }
  
  const posts = getAllBlogPosts();
  return NextResponse.json(posts);
}

// POST a new blog post
export async function POST(request: NextRequest) {
  // Check authentication
  const cookies = request.cookies;
  const isAdmin = cookies.get('admin_authenticated')?.value === 'true';
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.excerpt || !data.content) {
      return NextResponse.json(
        { error: 'Title, excerpt, and content are required' }, 
        { status: 400 }
      );
    }
    
    const newPost = addBlogPost({
      title: data.title,
      excerpt: data.excerpt,
      content: data.content
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' }, 
      { status: 500 }
    );
  }
}

// PUT to update a blog post
export async function PUT(request: NextRequest) {
  // Check authentication
  const cookies = request.cookies;
  const isAdmin = cookies.get('admin_authenticated')?.value === 'true';
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' }, 
        { status: 400 }
      );
    }
    
    const updatedPost = updateBlogPost(data.id, {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content
    });
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Blog post not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' }, 
      { status: 500 }
    );
  }
}

// DELETE a blog post
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
      { error: 'Blog post ID is required' }, 
      { status: 400 }
    );
  }
  
  const success = deleteBlogPost(Number(id));
  
  if (!success) {
    return NextResponse.json(
      { error: 'Blog post not found' }, 
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true });
}
