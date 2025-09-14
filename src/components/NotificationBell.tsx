"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import NotificationPanel from './NotificationPanel';

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/notifications?userId=${userId}&unreadOnly=true`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.counts.unread);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [userId]);

  // Update unread count when panel closes
  const handlePanelClose = () => {
    setIsOpen(false);
    fetchUnreadCount(); // Refresh count
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [userId, fetchUnreadCount]);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 group"
        >
          {isHovered ? (
            <BellSolidIcon className="w-6 h-6" />
          ) : (
            <BellIcon className="w-6 h-6" />
          )}
          
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Notifications
            {unreadCount > 0 && ` (${unreadCount} unread)`}
          </div>
        </button>
      </div>

      <NotificationPanel
        userId={userId}
        isOpen={isOpen}
        onClose={handlePanelClose}
      />
    </>
  );
}
