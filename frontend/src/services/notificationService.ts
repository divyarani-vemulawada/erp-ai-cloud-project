import api from './api';
import type { Notification } from '../types/notification';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications');
  return response.data;
};

export const createNotification = async (
  data: Omit<Notification, 'id' | 'status' | 'createdAt'>
): Promise<Notification> => {
  const response = await api.post('/notifications', data);
  return response.data.notification;
};

export const markNotificationRead = async (id: string): Promise<Notification> => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data.notification;
};
