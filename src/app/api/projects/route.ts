import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllProjects, 
  getProjectById, 
  addProject, 
  updateProject, 
  deleteProject 
} from '@/utils/projectUtils';

// GET all projects or a specific project by ID
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (id) {
    const project = getProjectById(Number(id));
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  }
  
  const projects = getAllProjects();
  return NextResponse.json(projects);
}

// POST a new project
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
    if (!data.title || !data.description || !data.url) {
      return NextResponse.json(
        { error: 'Title, description, and URL are required' }, 
        { status: 400 }
      );
    }
    
    const newProject = addProject({
      title: data.title,
      description: data.description,
      url: data.url
    });
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' }, 
      { status: 500 }
    );
  }
}

// PUT to update a project
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
        { error: 'Project ID is required' }, 
        { status: 400 }
      );
    }
    
    const updatedProject = updateProject(data.id, {
      title: data.title,
      description: data.description,
      url: data.url
    });
    
    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' }, 
      { status: 500 }
    );
  }
}

// DELETE a project
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
      { error: 'Project ID is required' }, 
      { status: 400 }
    );
  }
  
  const success = deleteProject(Number(id));
  
  if (!success) {
    return NextResponse.json(
      { error: 'Project not found' }, 
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true });
}
