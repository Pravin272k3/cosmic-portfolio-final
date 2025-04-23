import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllSkills, 
  getSkillById, 
  addSkill, 
  updateSkill, 
  deleteSkill 
} from '@/utils/skillUtils';

// GET all skills or a specific skill by ID
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (id) {
    const skill = getSkillById(Number(id));
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(skill);
  }
  
  const skills = getAllSkills();
  return NextResponse.json(skills);
}

// POST a new skill
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
    if (!data.name || data.level === undefined || data.level === null) {
      return NextResponse.json(
        { error: 'Name and level are required' }, 
        { status: 400 }
      );
    }
    
    // Validate level is between 0 and 100
    if (data.level < 0 || data.level > 100) {
      return NextResponse.json(
        { error: 'Level must be between 0 and 100' }, 
        { status: 400 }
      );
    }
    
    const newSkill = addSkill({
      name: data.name,
      level: data.level
    });
    
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' }, 
      { status: 500 }
    );
  }
}

// PUT/PATCH to update a skill
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
        { error: 'Skill ID is required' }, 
        { status: 400 }
      );
    }
    
    // Validate level is between 0 and 100 if provided
    if (data.level !== undefined && (data.level < 0 || data.level > 100)) {
      return NextResponse.json(
        { error: 'Level must be between 0 and 100' }, 
        { status: 400 }
      );
    }
    
    const updatedSkill = updateSkill(data.id, {
      name: data.name,
      level: data.level
    });
    
    if (!updatedSkill) {
      return NextResponse.json(
        { error: 'Skill not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' }, 
      { status: 500 }
    );
  }
}

// DELETE a skill
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
      { error: 'Skill ID is required' }, 
      { status: 400 }
    );
  }
  
  const success = deleteSkill(Number(id));
  
  if (!success) {
    return NextResponse.json(
      { error: 'Skill not found' }, 
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true });
}
