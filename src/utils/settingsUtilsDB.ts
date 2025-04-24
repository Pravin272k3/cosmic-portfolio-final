// Mark this file as server-only
import 'server-only';
import clientPromise from './dbConnect';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface ResumeSettings {
  filename: string;
  displayName: string;
  lastUpdated: string;
  fileUrl?: string; // URL to the resume file in Cloudinary
}

export interface Settings {
  resume: ResumeSettings;
}

// Get all settings
export const getSettings = async (): Promise<Settings> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const settings = await db.collection('settings').findOne({ _id: 'global' });
    
    if (!settings) {
      // Return default settings if not found
      return {
        resume: {
          filename: 'pravin-sharma-resume.pdf',
          displayName: 'Pravin Sharma Resume',
          lastUpdated: new Date().toISOString().split('T')[0],
          fileUrl: '' // Empty URL by default
        }
      };
    }
    
    return settings as Settings;
  } catch (error) {
    console.error('Error reading settings from database:', error);
    // Return default settings if error
    return {
      resume: {
        filename: 'pravin-sharma-resume.pdf',
        displayName: 'Pravin Sharma Resume',
        lastUpdated: new Date().toISOString().split('T')[0],
        fileUrl: '' // Empty URL by default
      }
    };
  }
};

// Update settings
export const updateSettings = async (newSettings: Settings): Promise<Settings> => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    await db.collection('settings').updateOne(
      { _id: 'global' },
      { $set: newSettings },
      { upsert: true }
    );
    
    return newSettings;
  } catch (error) {
    console.error('Error updating settings in database:', error);
    throw new Error('Failed to update settings');
  }
};

// Get resume settings
export const getResumeSettings = async (): Promise<ResumeSettings> => {
  const settings = await getSettings();
  return settings.resume;
};

// Update resume settings
export const updateResumeSettings = async (resumeSettings: ResumeSettings): Promise<ResumeSettings> => {
  const settings = await getSettings();
  settings.resume = resumeSettings;
  await updateSettings(settings);
  return resumeSettings;
};

// Upload resume file to Cloudinary
export const uploadResumeToCloudinary = async (file: Buffer, filename: string): Promise<string> => {
  try {
    // Convert buffer to base64
    const base64Data = `data:application/pdf;base64,${file.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'portfolio-resume',
      public_id: filename.split('.')[0], // Use filename without extension as public_id
      resource_type: 'raw' // For PDF files
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload resume file');
  }
};

// Save uploaded resume file and return the Cloudinary URL
export const saveResumeFile = async (file: Buffer, filename: string): Promise<string> => {
  try {
    return await uploadResumeToCloudinary(file, filename);
  } catch (error) {
    console.error('Error saving resume file:', error);
    throw new Error('Failed to save resume file');
  }
};

// Delete old resume file from Cloudinary
export const deleteOldResumeFile = async (fileUrl: string): Promise<void> => {
  try {
    if (!fileUrl) return;
    
    // Extract the public_id from the Cloudinary URL
    const urlParts = fileUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = `portfolio-resume/${publicIdWithExtension.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    console.error('Error deleting old resume file from Cloudinary:', error);
    // Don't throw, just log the error
  }
};
