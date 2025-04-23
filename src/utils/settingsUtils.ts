import fs from 'fs';
import path from 'path';

export interface ResumeSettings {
  filename: string;
  displayName: string;
  lastUpdated: string;
}

export interface Settings {
  resume: ResumeSettings;
}

const settingsFilePath = path.join(process.cwd(), 'src/data/settings.json');
const resumeDirectory = path.join(process.cwd(), 'public/resume');

// Get all settings
export const getSettings = (): Settings => {
  try {
    const fileContents = fs.readFileSync(settingsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading settings:', error);
    // Return default settings if file doesn't exist
    return {
      resume: {
        filename: 'pravin-sharma-resume.pdf',
        displayName: 'Pravin Sharma Resume',
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    };
  }
};

// Update settings
export const updateSettings = (newSettings: Settings): Settings => {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(newSettings, null, 2));
    return newSettings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error('Failed to update settings');
  }
};

// Get resume settings
export const getResumeSettings = (): ResumeSettings => {
  const settings = getSettings();
  return settings.resume;
};

// Update resume settings
export const updateResumeSettings = (resumeSettings: ResumeSettings): ResumeSettings => {
  const settings = getSettings();
  settings.resume = resumeSettings;
  updateSettings(settings);
  return resumeSettings;
};

// Save uploaded resume file
export const saveResumeFile = async (file: Buffer, filename: string): Promise<void> => {
  try {
    // Ensure the resume directory exists
    if (!fs.existsSync(resumeDirectory)) {
      fs.mkdirSync(resumeDirectory, { recursive: true });
    }
    
    // Save the file
    const filePath = path.join(resumeDirectory, filename);
    fs.writeFileSync(filePath, file);
  } catch (error) {
    console.error('Error saving resume file:', error);
    throw new Error('Failed to save resume file');
  }
};

// Delete old resume file
export const deleteOldResumeFile = (filename: string): void => {
  try {
    const filePath = path.join(resumeDirectory, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting old resume file:', error);
    // Don't throw, just log the error
  }
};
