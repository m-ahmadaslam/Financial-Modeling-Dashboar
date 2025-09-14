import { NotificationType } from '@/types/notifications';

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  reference?: string,
  relatedId?: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  actionUrl?: string,
  metadata?: Record<string, unknown>
) => {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        type,
        title,
        message,
        reference,
        relatedId,
        priority,
        actionUrl,
        metadata
      })
    });

    if (!response.ok) {
      console.error('Failed to create notification');
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Predefined notification templates
export const notificationTemplates = {
  projectCreated: (projectName: string, projectRef: string, projectId: string) => ({
    type: 'project_created' as NotificationType,
    title: 'New Project Created',
    message: `Project "${projectName}" has been successfully created.`,
    reference: projectRef,
    relatedId: projectId,
    actionUrl: `/dashboard/projects`
  }),

  versionCreated: (projectName: string, versionNumber: string, projectId: string) => ({
    type: 'version_created' as NotificationType,
    title: 'New Version Created',
    message: `Version ${versionNumber} of "${projectName}" has been created.`,
    reference: `v${versionNumber}`,
    relatedId: projectId,
    actionUrl: `/dashboard/projects`
  }),

  commentAdded: (projectName: string, commentContent: string, projectId: string) => ({
    type: 'comment_added' as NotificationType,
    title: 'New Comment Added',
    message: `New comment on "${projectName}": "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
    reference: projectName,
    relatedId: projectId,
    actionUrl: `/dashboard/projects`
  }),

  userSignedIn: (userName: string) => ({
    type: 'user_signed_in' as NotificationType,
    title: 'User Signed In',
    message: `${userName} has signed into the system.`,
    reference: userName,
    priority: 'low' as const
  }),

  projectCompleted: (projectName: string, projectRef: string, projectId: string) => ({
    type: 'project_completed' as NotificationType,
    title: 'Project Completed',
    message: `Project "${projectName}" has been marked as completed.`,
    reference: projectRef,
    relatedId: projectId,
    actionUrl: `/dashboard/projects`,
    priority: 'high' as const
  }),

  projectUpdated: (projectName: string, projectRef: string, projectId: string) => ({
    type: 'project_updated' as NotificationType,
    title: 'Project Updated',
    message: `Project "${projectName}" has been updated.`,
    reference: projectRef,
    relatedId: projectId,
    actionUrl: `/dashboard/projects`
  }),

  versionDeleted: (projectName: string, versionNumber: string, projectId: string) => ({
    type: 'version_deleted' as NotificationType,
    title: 'Version Deleted',
    message: `Version ${versionNumber} of "${projectName}" has been deleted.`,
    reference: `v${versionNumber}`,
    relatedId: projectId,
    actionUrl: `/dashboard/projects`,
    priority: 'high' as const
  })
};
