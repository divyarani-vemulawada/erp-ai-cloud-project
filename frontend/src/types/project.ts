export type ProjectStatus = 'Planning' | 'Active' | 'At Risk' | 'Completed';

export type Project = {
  id: string;
  projectCode: string;
  name: string;
  owner: string;
  startDate: string;
  dueDate: string;
  budget: number;
  actualSpend: number;
  progress: number;
  status: ProjectStatus;
};
