'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services';
import type { Notification } from '@/types';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiService.get<{ data: Notification[]; unreadCount: number }>('/api/notifications'),
    enabled: isOpen,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = notificationsData?.data?.data || [];
  const unreadCount = notificationsData?.data?.unreadCount || 0;

  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) AroundMe`;
    } else {
      document.title = 'AroundMe';
    }
  }, [unreadCount]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_rsvp':
        return '👥';
      case 'event_reminder':
        return '🔔';
      case 'new_review':
        return '⭐';
      case 'event_update':
        return '📝';
      default:
        return '📢';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <span className="text-4xl mb-2 block">🔔</span>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.link || '#'}
                    onClick={() => setIsOpen(false)}
                    className={`block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                      !notification.isRead ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
