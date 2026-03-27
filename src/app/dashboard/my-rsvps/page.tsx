'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout';
import { Calendar, MapPin, ArrowLeft, CheckCircle, HelpCircle, Clock } from 'lucide-react';

interface RSVPEvent {
  id: string;
  eventId: string;
  status: 'going' | 'interested' | 'maybe';
  event: {
    id: string;
    title: string;
    imageUrl: string | null;
    dateStart: string;
    city: string;
    citySlug: string;
  };
}

const statusConfig = {
  going: { label: 'Going', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  interested: { label: 'Interested', icon: HelpCircle, color: 'bg-blue-100 text-blue-700' },
  maybe: { label: 'Maybe', icon: Clock, color: 'bg-amber-100 text-amber-700' },
};

export default function MyRsvpsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const { data: rsvpData, isLoading } = useQuery({
    queryKey: ['my-rsvps'],
    queryFn: () => fetch('/api/user/rsvps').then(res => res.json()),
    enabled: !!user,
  });

  const rsvps: RSVPEvent[] = rsvpData?.data || [];

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="my-rsvps-page-container">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
          data-testid="back-link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="my-rsvps-title">My RSVPs</h1>

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
        ) : rsvps.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No RSVPs yet</h2>
            <p className="text-gray-500 mb-6">
              Find events you&apos;re interested in and RSVP to keep track of them!
            </p>
            <Link
              href="/bogota"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {(['going', 'interested', 'maybe'] as const).map((status) => {
              const events = rsvps.filter((r) => r.status === status);
              if (events.length === 0) return null;
              
              const config = statusConfig[status];
              const StatusIcon = config.icon;
              
              return (
                <div key={status}>
                  <h2 className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 ${config.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {config.label} ({events.length})
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((rsvp) => (
                      <Link
                        key={rsvp.id}
                        href={`/event/${rsvp.event.id}`}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
                      >
                        {rsvp.event.imageUrl ? (
                          <Image
                            src={rsvp.event.imageUrl}
                            alt={rsvp.event.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <Calendar className="w-10 h-10 text-indigo-300" />
                          </div>
                        )}
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {rsvp.event.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(rsvp.event.dateStart).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {rsvp.event.city}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
