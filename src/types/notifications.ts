export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  reference?: string; // Project ref, version number, etc.
  relatedId?: string; // ID of related project/version/comment
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string; // URL to navigate when clicked
  metadata?: Record<string, unknown>; // Additional data
}

export type NotificationType = 
  | 'project_created'
  | 'version_created'
  | 'user_signed_in'
  | 'comment_added'
  | 'project_updated'
  | 'version_deleted'
  | 'project_completed'
  | 'system_alert';

export interface NotificationCounts {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
}
