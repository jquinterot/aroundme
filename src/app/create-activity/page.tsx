'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';

export default function CreateActivityPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Activity
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Activities feature allows providers to offer recurring classes, tours, and experiences.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-amber-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The ability to create activities for classes, tours, and experiences is coming soon.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Recurring Schedule</p>
                <p className="text-sm text-gray-500">Set up weekly classes or daily tours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Location Details</p>
                <p className="text-sm text-gray-500">Add address and meeting points</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Pricing</p>
                <p className="text-sm text-gray-500">Set free or paid activities</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Bookings</p>
                <p className="text-sm text-gray-500">Manage capacity and bookings</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
