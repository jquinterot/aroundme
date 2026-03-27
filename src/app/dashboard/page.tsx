'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout';
import { Ticket, Heart, Calendar, MapPin, User, Plus, Eye, Users, Star, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => fetch('/api/user/stats').then(res => res.json()),
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  const stats = statsData?.data?.overview || {};
  const engagement = statsData?.data?.engagement || {};
  const trends = statsData?.data?.trends || {};
  const insights = statsData?.data?.insights || {};

  const statCards = [
    { label: 'Events Attended', value: stats.eventsAttended || 0, href: '/dashboard/my-rsvps', icon: Ticket, color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' },
    { label: 'Check-ins', value: stats.totalCheckIns || 0, href: '/dashboard/tickets', icon: Calendar, color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' },
    { label: 'Places Visited', value: stats.placesVisited || 0, href: '/dashboard/places', icon: MapPin, color: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400' },
    { label: 'Content Views', value: stats.totalViews || 0, href: '/dashboard/history', icon: Eye, color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' },
  ];

  const socialStats = [
    { label: 'Saved Events', value: stats.totalSavedEvents || 0, icon: Heart, color: 'text-pink-600' },
    { label: 'Reviews Written', value: stats.totalReviews || 0, icon: Star, color: 'text-yellow-600' },
    { label: 'Followers', value: stats.totalFollowers || 0, icon: Users, color: 'text-blue-600' },
    { label: 'Following', value: stats.totalFollowing || 0, icon: Users, color: 'text-indigo-600' },
  ];

  const categoryIcons: Record<string, string> = {
    music: '🎵',
    food: '🍽️',
    sports: '⚽',
    art: '🎨',
    tech: '💻',
    community: '👥',
    nightlife: '🌙',
    outdoor: '🌳',
    education: '📚',
    other: '🎯',
  };

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div data-testid="dashboard-header" className="mb-8">
          <h1 data-testid="dashboard-welcome" className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name}!</h1>
          <p data-testid="dashboard-email" className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>

        {statsLoading ? (
          <div className="animate-pulse space-y-6">
            <div data-testid="dashboard-stats-loading" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div data-testid="dashboard-stat-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link
                    data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                    key={stat.label}
                    href={stat.href}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </Link>
                );
              })}
            </div>

            <div data-testid="dashboard-social-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {socialStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    data-testid={`social-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                    key={stat.label}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3"
                  >
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {engagement.categoryBreakdown && Object.keys(engagement.categoryBreakdown).length > 0 && (
              <div data-testid="dashboard-interests" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Your Interests
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(engagement.categoryBreakdown as Record<string, number> || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => (
                      <div data-testid={`interest-${category}`} key={category} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-2xl mb-1">{categoryIcons[category] || '🎯'}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{category}</p>
                        <p className="text-xs text-gray-500">{count} events</p>
                      </div>
                    ))}
                </div>
                {insights.favoriteCategory && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Your favorite category is <span data-testid="favorite-category" className="font-medium text-indigo-600 dark:text-indigo-400 capitalize">{insights.favoriteCategory}</span>!
                  </p>
                )}
              </div>
            )}

            {trends.eventsThisMonth > 0 && (
              <div data-testid="dashboard-monthly-activity" className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white mb-8">
                <h2 className="text-lg font-semibold mb-2">This Month&apos;s Activity</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">{trends.eventsThisMonth}</p>
                    <p className="text-sm text-indigo-100">Events RSVP&apos;d</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{trends.viewsThisMonth}</p>
                    <p className="text-sm text-indigo-100">Content Viewed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{trends.reviewsThisMonth}</p>
                    <p className="text-sm text-indigo-100">Reviews Written</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div data-testid="dashboard-quick-actions" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                data-testid="quick-action-edit-profile"
                href="/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Edit Profile</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                </div>
              </Link>
              <Link
                data-testid="quick-action-create-event"
                href="/create-event"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Create Event</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Share your event with the community</p>
                </div>
              </Link>
              <Link
                data-testid="quick-action-create-activity"
                href="/create-activity"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Create Activity</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Offer classes, tours, or experiences</p>
                </div>
              </Link>
              <Link
                data-testid="quick-action-add-place"
                href="/submit-place"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Add a Place</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recommend a cool spot in your city</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h2>
            <div data-testid="getting-started-list" className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>1. Complete your profile to get verified</p>
              <p>2. Create events to share with the community</p>
              <p>3. Save events you&apos;re interested in</p>
              <p>4. RSVP to events you plan to attend</p>
              <p>5. Check-in at events you attend</p>
              <p>6. Write reviews for places you visit</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
