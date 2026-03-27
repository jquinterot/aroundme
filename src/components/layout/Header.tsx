'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Ticket, MapPin, LogOut, User, Bell, Bookmark, CalendarCheck, Shield, BellRing, BellOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell, DarkModeToggle } from '@/components/ui';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const { isSupported, isSubscribed, subscribe, unsubscribe, loading: pushLoading } = usePushNotifications();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed:', error);
      });
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsUserMenuOpen(false);
    refresh();
    router.push('/');
  };

  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <header data-testid="header" className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link data-testid="header-logo" href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">AroundMe</span>
          </Link>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <div className="relative">
                      <button
                        data-testid="user-menu-button"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="hidden md:block font-medium text-gray-700 dark:text-gray-300">
                          {user.name}
                        </span>
                        {user.role === 'admin' && (
                          <span className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isUserMenuOpen && (
                        <div data-testid="user-menu-dropdown" className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                            <p data-testid="user-menu-name" className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                            <p data-testid="user-menu-email" className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            {user.role === 'admin' && (
                              <Link
                                data-testid="admin-dashboard-link"
                                href="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="mt-2 flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                              >
                                <Shield className="w-4 h-4" />
                                Admin Dashboard
                              </Link>
                            )}
                          </div>
                          
                          {isSupported && (
                            <button
                              data-testid="push-notifications-toggle"
                              onClick={handlePushToggle}
                              disabled={pushLoading}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {isSubscribed ? (
                                <>
                                  <BellOff className="w-4 h-4" />
                                  <span>Disable Push Notifications</span>
                                </>
                              ) : (
                                <>
                                  <BellRing className="w-4 h-4" />
                                  <span>Enable Push Notifications</span>
                                </>
                              )}
                            </button>
                          )}
                          
                          <Link
                            data-testid="dashboard-link"
                            href="/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link
                            data-testid="notifications-link"
                            href="/dashboard/notifications"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <Bell className="w-4 h-4" /> Notifications
                          </Link>
                          <Link
                            data-testid="profile-link"
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <hr className="my-1 border-gray-100 dark:border-gray-700" />
                          <Link
                            data-testid="my-events-link"
                            href="/dashboard/events"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <Ticket className="w-4 h-4" /> My Events
                          </Link>
                          <Link
                            data-testid="my-places-link"
                            href="/dashboard/places"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <MapPin className="w-4 h-4" /> My Places
                          </Link>
                          <Link
                            data-testid="my-tickets-link"
                            href="/dashboard/tickets"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <Bookmark className="w-4 h-4" /> My Tickets
                          </Link>
                          <Link
                            data-testid="saved-events-link"
                            href="/dashboard/saved-events"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <Bookmark className="w-4 h-4" /> Saved Events
                          </Link>
                          <Link
                            data-testid="my-rsvps-link"
                            href="/dashboard/my-rsvps"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <CalendarCheck className="w-4 h-4" /> My RSVPs
                          </Link>
                          <hr className="my-1 border-gray-100 dark:border-gray-700" />
                          <button
                            data-testid="logout-button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      data-testid="login-link"
                      href="/login"
                      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      data-testid="signup-link"
                      href="/signup"
                      className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
