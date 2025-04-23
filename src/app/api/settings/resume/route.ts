import { NextRequest, NextResponse } from 'next/server';
import { 
  getResumeSettings, 
  updateResumeSettings, 
  saveResumeFile,
  deleteOldResumeFile
} from '@/utils/settingsUtils';

// GET resume settings
export async function GET() {
  try {
    const resumeSettings = getResumeSettings();
    return NextResponse.json(resumeSettings);
  } catch (error) {
    console.error('Error getting resume settings:', error);
    return NextResponse.json(
      { error: 'Failed to get resume settings' }, 
      { status: 500 }
    );
  }
}

// POST to upload a new resume
export async function POST(request: NextRequest) {
  // Check authentication
  const cookies = request.cookies;
  const isAdmin = cookies.get('admin_authenticated')?.value === 'true';
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const displayName = formData.get('displayName') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Resume file is required' }, 
        { status: 400 }
      );
    }
    
    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' }, 
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const filename = `resume-${Date.now()}.pdf`;
    
    // Get current settings to find old file to delete
    const currentSettings = getResumeSettings();
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Save the file
    await saveResumeFile(buffer, filename);
    
    // Delete old file if it exists and is different
    if (currentSettings.filename && currentSettings.filename !== filename) {
      deleteOldResumeFile(currentSettings.filename);
    }
    
    // Update settings
    const newSettings = updateResumeSettings({
      filename,
      displayName: displayName || 'Resume',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    
    return NextResponse.json(newSettings, { status: 201 });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' }, 
      { status: 500 }
    );
  }
}
