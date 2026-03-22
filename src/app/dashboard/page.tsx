'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout';
import { Ticket, Heart, Calendar, MapPin, User, Plus } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const { data: savedData } = useQuery({
    queryKey: ['saved-events'],
    queryFn: () => fetch('/api/user/saved-events').then(res => res.json()),
    enabled: !!user,
  });

  const { data: rsvpData } = useQuery({
    queryKey: ['my-rsvps'],
    queryFn: () => fetch('/api/user/rsvps').then(res => res.json()),
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const stats = [
    { label: 'My Events', value: '-', href: '/dashboard/events', icon: Ticket, color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' },
    { label: 'Saved Events', value: savedData?.data?.length || 0, href: '/dashboard/saved-events', icon: Heart, color: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400' },
    { label: 'My RSVPs', value: rsvpData?.data?.length || 0, href: '/dashboard/my-rsvps', icon: Calendar, color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' }, { label: 'My Places', value: '-', href: '/dashboard/places', icon: MapPin, color: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400' },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name}!</h1>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
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
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>1. Complete your profile to get verified</p>
              <p>2. Create events to share with the community</p>
              <p>3. Save events you&apos;re interested in</p>
              <p>4. RSVP to events you plan to attend</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
