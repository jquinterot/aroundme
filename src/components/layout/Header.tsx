'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Ticket, MapPin, LogOut, User, Bell, Bookmark, CalendarCheck, Shield, BellRing, BellOff, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell, SearchBar, DarkModeToggle } from '@/components/ui';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const { isSupported, isSubscribed, subscribe, unsubscribe, loading: pushLoading } = usePushNotifications();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
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
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">AroundMe</span>
            </Link>

            <div className="hidden md:block">
              <SearchBar />
            </div>

            <div className="flex items-center gap-3">
            <DarkModeToggle />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <div className="relative">
                      <button
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
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.role === 'admin' && (
                              <Link
                                href="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="mt-2 flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                              >
                                <Shield className="w-4 h-4" />
                                Admin Dashboard
                              </Link>
                            )}
                          </div>
                          
                          {isSupported && (
                            <button
                              onClick={handlePushToggle}
                              disabled={pushLoading}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
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
                            href="/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link
                            href="/dashboard/notifications"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <Bell className="w-4 h-4" /> Notifications
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <hr className="my-1" />
                          <Link
                            href="/dashboard/events"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <Ticket className="w-4 h-4" /> My Events
                          </Link>
                          <Link
                            href="/dashboard/places"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <MapPin className="w-4 h-4" /> My Places
                          </Link>
                          <Link
                            href="/dashboard/tickets"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <Bookmark className="w-4 h-4" /> My Tickets
                          </Link>
                          <Link
                            href="/dashboard/saved-events"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <Bookmark className="w-4 h-4" /> Saved Events
                          </Link>
                          <Link
                            href="/dashboard/my-rsvps"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <CalendarCheck className="w-4 h-4" /> My RSVPs
                          </Link>
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
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
                      href="/login"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
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
