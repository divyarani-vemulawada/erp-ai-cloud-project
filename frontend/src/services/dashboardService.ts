import api from './api';

export interface WidgetLayoutItem {
  id: string;
  type: string;
  title: string;
  size: "small" | "medium" | "large" | "full";
  order: number;
}

export interface DashboardConfigResponse {
  userId: string;
  layout: WidgetLayoutItem[];
}

export const getDashboardConfig = async (): Promise<DashboardConfigResponse> => {
  const response = await api.get('/dashboard/config');
  return response.data;
};

export const saveDashboardConfig = async (layout: WidgetLayoutItem[]): Promise<DashboardConfigResponse> => {
  const response = await api.post('/dashboard/config', { layout });
  return response.data;
};
