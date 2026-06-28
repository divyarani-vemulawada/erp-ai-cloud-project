import api from './api';
import type { ReportSummary } from '../types/dashboard';

export const getReportSummary = async (): Promise<ReportSummary> => {
  const response = await api.get('/reports/summary');
  return response.data;
};
