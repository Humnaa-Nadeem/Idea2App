import { ProjectBlueprint } from '@/types';

const STORAGE_KEY = 'idea2app_projects';
const API_KEY_STORAGE_KEY = 'idea2app_gemini_api_key';

export const storage = {
  getApiKey: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  },

  saveApiKey: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  },
  getProjects: (): ProjectBlueprint[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse projects from local storage', e);
      return [];
    }
  },

  getProject: (id: string): ProjectBlueprint | undefined => {
    const projects = storage.getProjects();
    return projects.find((p) => p.id === id);
  },

  saveProject: (project: ProjectBlueprint): void => {
    if (typeof window === 'undefined') return;
    try {
      const projects = storage.getProjects();
      const existingIndex = projects.findIndex((p) => p.id === project.id);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
      } else {
        projects.push(project);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save project to local storage', e);
    }
  },

  deleteProject: (id: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const projects = storage.getProjects();
      const newProjects = projects.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    } catch (e) {
      console.error('Failed to delete project from local storage', e);
    }
  },
};
