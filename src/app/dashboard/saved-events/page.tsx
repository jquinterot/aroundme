'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout';
import { Heart, Calendar, MapPin, ArrowLeft, Trash2 } from 'lucide-react';

interface SavedEvent {
  id: string;
  eventId: string;
  savedAt: string;
  event: {
    id: string;
    title: string;
    imageUrl: string | null;
    dateStart: string;
    city: string;
    citySlug: string;
  };
}

export default function SavedEventsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const { data: savedData, isLoading } = useQuery({
    queryKey: ['saved-events'],
    queryFn: () => fetch('/api/user/saved-events').then(res => res.json()),
    enabled: !!user,
  });

  const savedEvents: SavedEvent[] = savedData?.data || [];

  const unsaveMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`/api/events/${eventId}/save`, { method: 'DELETE' });
      return res.json();
    },
  });

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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="w-7 h-7" />
          Saved Events
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : savedEvents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved events yet</h2>
            <p className="text-gray-500 mb-6">
              Start exploring events and save the ones you&apos;re interested in!
            </p>
            <Link
              href="/bogota"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedEvents.map((saved) => (
              <div key={saved.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {saved.event.imageUrl ? (
                  <Image
                    src={saved.event.imageUrl}
                    alt={saved.event.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-indigo-300" />
                  </div>
                )}
                <div className="p-4">
                  <Link href={`/event/${saved.event.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                      {saved.event.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(saved.event.dateStart).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {saved.event.city}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Saved {new Date(saved.savedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => unsaveMutation.mutate(saved.eventId)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function useMutation({ mutationFn }: { mutationFn: (eventId: string) => Promise<unknown> }) {
  return {
    mutate: (eventId: string) => mutationFn(eventId),
  };
}
