"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BellIcon, 
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { Notification, NotificationType } from '@/types/notifications';

interface NotificationPanelProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'project_created':
    case 'project_updated':
    case 'project_completed':
      return <DocumentDuplicateIcon className="w-5 h-5" />;
    case 'version_created':
    case 'version_deleted':
      return <DocumentDuplicateIcon className="w-5 h-5" />;
    case 'user_signed_in':
      return <UserIcon className="w-5 h-5" />;
    case 'comment_added':
      return <ChatBubbleLeftIcon className="w-5 h-5" />;
    case 'system_alert':
      return <ExclamationTriangleIcon className="w-5 h-5" />;
    default:
      return <InformationCircleIcon className="w-5 h-5" />;
  }
};

const getNotificationColor = (type: NotificationType, priority: string) => {
  if (priority === 'high') {
    return 'bg-red-50 border-red-200 text-red-800';
  }
  
  switch (type) {
    case 'project_created':
    case 'version_created':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'project_completed':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'comment_added':
      return 'bg-purple-50 border-purple-200 text-purple-800';
    case 'user_signed_in':
      return 'bg-gray-50 border-gray-200 text-gray-800';
    case 'system_alert':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function NotificationPanel({ userId, isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${userId}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.counts.unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true, userId })
      });

      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        const deletedNotif = notifications.find(n => n._id === notificationId);
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Handle click outside to close and prevent body scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      fetchNotifications();
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when panel is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Always restore body scroll on cleanup
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, userId, fetchNotifications, onClose]);

  return (
    <>
      {/* Notification Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-[9999] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <BellSolidIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-full flex flex-col">
          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <BellIcon className="w-12 h-12 text-gray-300 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No notifications</h4>
                <p className="text-gray-500">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      getNotificationColor(notification.type, notification.priority)
                    } ${!notification.isRead ? 'ring-2 ring-blue-200' : ''}`}
                  >
                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          {notification.reference && (
                            <p className="text-xs text-gray-500 font-mono">
                              Ref: {notification.reference}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50"
                          title="Mark as read"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Message */}
                    <p className="text-sm mb-2">{notification.message}</p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatTimeAgo(notification.timestamp)}</span>
                      {notification.actionUrl && (
                        <button
                          onClick={() => {
                            // Navigate to the action URL
                            window.location.href = notification.actionUrl!;
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
