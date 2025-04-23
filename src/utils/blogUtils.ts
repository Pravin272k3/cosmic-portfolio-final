import fs from 'fs';
import path from 'path';

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const blogsFilePath = path.join(process.cwd(), 'src/data/blogs.json');

// Get all blog posts
export const getAllBlogPosts = (): BlogPost[] => {
  try {
    const fileContents = fs.readFileSync(blogsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
};

// Get a single blog post by ID
export const getBlogPostById = (id: number): BlogPost | null => {
  const posts = getAllBlogPosts();
  return posts.find(post => post.id === id) || null;
};

// Add a new blog post
export const addBlogPost = (post: Omit<BlogPost, 'id' | 'date'>): BlogPost => {
  const posts = getAllBlogPosts();
  
  // Generate a new ID (max ID + 1)
  const newId = posts.length > 0 
    ? Math.max(...posts.map(p => p.id)) + 1 
    : 1;
  
  // Create new post with current date
  const newPost: BlogPost = {
    id: newId,
    date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    ...post
  };
  
  // Add to posts array and save
  const updatedPosts = [...posts, newPost];
  fs.writeFileSync(blogsFilePath, JSON.stringify(updatedPosts, null, 2));
  
  return newPost;
};

// Update an existing blog post
export const updateBlogPost = (id: number, updatedData: Partial<Omit<BlogPost, 'id'>>): BlogPost | null => {
  const posts = getAllBlogPosts();
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) return null;
  
  // Update the post
  const updatedPost = { ...posts[postIndex], ...updatedData };
  posts[postIndex] = updatedPost;
  
  // Save updated posts
  fs.writeFileSync(blogsFilePath, JSON.stringify(posts, null, 2));
  
  return updatedPost;
};

// Delete a blog post
export const deleteBlogPost = (id: number): boolean => {
  const posts = getAllBlogPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length === posts.length) {
    return false; // Post not found
  }
  
  // Save updated posts
  fs.writeFileSync(blogsFilePath, JSON.stringify(filteredPosts, null, 2));
  
  return true;
};
