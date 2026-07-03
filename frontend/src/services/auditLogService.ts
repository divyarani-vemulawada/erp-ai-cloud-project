import api from './api';

export interface AuditLogItem {
  _id: string;
  email: string;
  role: string;
  action: string;
  method: string;
  path: string;
  details: string;
  ip: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  total: number;
  page: number;
  pages: number;
  logs: AuditLogItem[];
}

export const getAuditLogs = async (params: { page?: number; limit?: number; email?: string; action?: string }): Promise<AuditLogsResponse> => {
  const response = await api.get('/audit-logs', { params });
  return response.data;
};
