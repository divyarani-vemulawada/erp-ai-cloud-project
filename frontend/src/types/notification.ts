export type NotificationChannel = 'In-App' | 'Email' | 'SMS' | 'Webhook';
export type NotificationSeverity = 'Info' | 'Warning' | 'Critical';

export type Notification = {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  severity: NotificationSeverity;
  status: 'Unread' | 'Read';
  createdAt?: string;
};
