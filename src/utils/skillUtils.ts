import fs from 'fs';
import path from 'path';

export interface Skill {
  id: number;
  name: string;
  level: number;
}

const skillsFilePath = path.join(process.cwd(), 'src/data/skills.json');

// Get all skills
export const getAllSkills = (): Skill[] => {
  try {
    const fileContents = fs.readFileSync(skillsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading skills:', error);
    return [];
  }
};

// Get a single skill by ID
export const getSkillById = (id: number): Skill | null => {
  const skills = getAllSkills();
  return skills.find(skill => skill.id === id) || null;
};

// Add a new skill
export const addSkill = (skill: Omit<Skill, 'id'>): Skill => {
  const skills = getAllSkills();
  
  // Generate a new ID (max ID + 1)
  const newId = skills.length > 0 
    ? Math.max(...skills.map(s => s.id)) + 1 
    : 1;
  
  // Create new skill
  const newSkill: Skill = {
    id: newId,
    ...skill
  };
  
  // Add to skills array and save
  const updatedSkills = [...skills, newSkill];
  fs.writeFileSync(skillsFilePath, JSON.stringify(updatedSkills, null, 2));
  
  return newSkill;
};

// Update an existing skill
export const updateSkill = (id: number, updatedData: Partial<Omit<Skill, 'id'>>): Skill | null => {
  const skills = getAllSkills();
  const skillIndex = skills.findIndex(skill => skill.id === id);
  
  if (skillIndex === -1) return null;
  
  // Update the skill
  const updatedSkill = { ...skills[skillIndex], ...updatedData };
  skills[skillIndex] = updatedSkill;
  
  // Save updated skills
  fs.writeFileSync(skillsFilePath, JSON.stringify(skills, null, 2));
  
  return updatedSkill;
};

// Delete a skill
export const deleteSkill = (id: number): boolean => {
  const skills = getAllSkills();
  const filteredSkills = skills.filter(skill => skill.id !== id);
  
  if (filteredSkills.length === skills.length) {
    return false; // Skill not found
  }
  
  // Save updated skills
  fs.writeFileSync(skillsFilePath, JSON.stringify(filteredSkills, null, 2));
  
  return true;
};
