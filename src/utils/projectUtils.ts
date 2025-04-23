import fs from 'fs';
import path from 'path';

export interface Project {
  id: number;
  title: string;
  description: string;
  url: string;
}

const projectsFilePath = path.join(process.cwd(), 'src/data/projects.json');

// Get all projects
export const getAllProjects = (): Project[] => {
  try {
    const fileContents = fs.readFileSync(projectsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
};

// Get a single project by ID
export const getProjectById = (id: number): Project | null => {
  const projects = getAllProjects();
  return projects.find(project => project.id === id) || null;
};

// Add a new project
export const addProject = (project: Omit<Project, 'id'>): Project => {
  const projects = getAllProjects();
  
  // Generate a new ID (max ID + 1)
  const newId = projects.length > 0 
    ? Math.max(...projects.map(p => p.id)) + 1 
    : 1;
  
  // Create new project
  const newProject: Project = {
    id: newId,
    ...project
  };
  
  // Add to projects array and save
  const updatedProjects = [...projects, newProject];
  fs.writeFileSync(projectsFilePath, JSON.stringify(updatedProjects, null, 2));
  
  return newProject;
};

// Update an existing project
export const updateProject = (id: number, updatedData: Partial<Omit<Project, 'id'>>): Project | null => {
  const projects = getAllProjects();
  const projectIndex = projects.findIndex(project => project.id === id);
  
  if (projectIndex === -1) return null;
  
  // Update the project
  const updatedProject = { ...projects[projectIndex], ...updatedData };
  projects[projectIndex] = updatedProject;
  
  // Save updated projects
  fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2));
  
  return updatedProject;
};

// Delete a project
export const deleteProject = (id: number): boolean => {
  const projects = getAllProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  
  if (filteredProjects.length === projects.length) {
    return false; // Project not found
  }
  
  // Save updated projects
  fs.writeFileSync(projectsFilePath, JSON.stringify(filteredProjects, null, 2));
  
  return true;
};
