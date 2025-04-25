// Mark this file as server-only
import 'server-only';
import clientPromise from './dbConnect';
import { getMongoDb } from './netlifyDbConnect';

export interface Skill {
  id: number;
  name: string;
  level: number;
}

// Get all skills
export const getAllSkills = async (): Promise<Skill[]> => {
  try {
    // Try Netlify connection
    try {
      const db = await getMongoDb();
      const skills = await db
        .collection('skills')
        .find({})
        .sort({ id: 1 })
        .toArray();

      return skills as Skill[];
    } catch (netlifyError) {
      // Fall back to Vercel connection
      console.log('Using Vercel DB connection instead of Netlify');
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);

      const skills = await db
        .collection('skills')
        .find({})
        .sort({ id: 1 })
        .toArray();

      return skills as Skill[];
    }
  } catch (error) {
    console.error('Error reading skills from database:', error);
    return [];
  }
};

// Get a single skill by ID
export const getSkillById = async (id: number): Promise<Skill | null> => {
  try {
    // Try Netlify connection
    try {
      const db = await getMongoDb();
      const skill = await db.collection('skills').findOne({ id });
      return skill as Skill;
    } catch (netlifyError) {
      // Fall back to Vercel connection
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      const skill = await db.collection('skills').findOne({ id });
      return skill as Skill;
    }
  } catch (error) {
    console.error('Error getting skill by ID:', error);
    return null;
  }
};

// Add a new skill
export const addSkill = async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
  try {
    // Get all skills to determine the next ID
    const skills = await getAllSkills();

    // Generate a new ID (max ID + 1)
    const newId = skills.length > 0
      ? Math.max(...skills.map(s => s.id)) + 1
      : 1;

    // Create new skill
    const newSkill: Skill = {
      id: newId,
      ...skill
    };

    // Try Netlify connection
    try {
      const db = await getMongoDb();
      await db.collection('skills').insertOne(newSkill);
      return newSkill;
    } catch (netlifyError) {
      // Fall back to Vercel connection
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      await db.collection('skills').insertOne(newSkill);
      return newSkill;
    }
  } catch (error) {
    console.error('Error adding skill to database:', error);
    throw new Error('Failed to add skill');
  }
};

// Update an existing skill
export const updateSkill = async (id: number, updatedData: Partial<Omit<Skill, 'id'>>): Promise<Skill | null> => {
  try {
    // Try Netlify connection
    try {
      const db = await getMongoDb();
      const result = await db.collection('skills').findOneAndUpdate(
        { id },
        { $set: updatedData },
        { returnDocument: 'after' }
      );
      return result as unknown as Skill;
    } catch (netlifyError) {
      // Fall back to Vercel connection
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      const result = await db.collection('skills').findOneAndUpdate(
        { id },
        { $set: updatedData },
        { returnDocument: 'after' }
      );
      return result as unknown as Skill;
    }
  } catch (error) {
    console.error('Error updating skill in database:', error);
    return null;
  }
};

// Delete a skill
export const deleteSkill = async (id: number): Promise<boolean> => {
  try {
    // Try Netlify connection
    try {
      const db = await getMongoDb();
      const result = await db.collection('skills').deleteOne({ id });
      return result.deletedCount > 0;
    } catch (netlifyError) {
      // Fall back to Vercel connection
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      const result = await db.collection('skills').deleteOne({ id });
      return result.deletedCount > 0;
    }
  } catch (error) {
    console.error('Error deleting skill from database:', error);
    return false;
  }
};
