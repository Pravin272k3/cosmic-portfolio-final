// Mark this file as server-only
import 'server-only';
import clientPromise from './dbConnect';

export interface Project {
  id: number;
  title: string;
  description: string;
  url: string;
}

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const projects = await db
      .collection('projects')
      .find({})
      .sort({ id: 1 })
      .toArray();
    
    return projects as Project[];
  } catch (error) {
    console.error('Error reading projects from database:', error);
    return [];
  }
};

// Get a single project by ID
export const getProjectById = async (id: number): Promise<Project | null> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const project = await db.collection('projects').findOne({ id });
    
    return project as Project;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    return null;
  }
};

// Add a new project
export const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Get all projects to determine the next ID
    const projects = await getAllProjects();
    
    // Generate a new ID (max ID + 1)
    const newId = projects.length > 0
      ? Math.max(...projects.map(p => p.id)) + 1
      : 1;
    
    // Create new project
    const newProject: Project = {
      id: newId,
      ...project
    };
    
    // Insert into database
    await db.collection('projects').insertOne(newProject);
    
    return newProject;
  } catch (error) {
    console.error('Error adding project to database:', error);
    throw new Error('Failed to add project');
  }
};

// Update an existing project
export const updateProject = async (id: number, updatedData: Partial<Omit<Project, 'id'>>): Promise<Project | null> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Update the project
    const result = await db.collection('projects').findOneAndUpdate(
      { id },
      { $set: updatedData },
      { returnDocument: 'after' }
    );
    
    return result as unknown as Project;
  } catch (error) {
    console.error('Error updating project in database:', error);
    return null;
  }
};

// Delete a project
export const deleteProject = async (id: number): Promise<boolean> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Delete from database
    const result = await db.collection('projects').deleteOne({ id });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting project from database:', error);
    return false;
  }
};
