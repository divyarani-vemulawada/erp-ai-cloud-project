import api from './api';
import type { Project } from '../types/project';

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};

export const createProject = async (data: Omit<Project, 'id'>): Promise<Project> => {
  const response = await api.post('/projects', data);
  return response.data.project;
};

export const updateProject = async (
  id: string,
  data: Partial<Omit<Project, 'id'>>
): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data.project;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
