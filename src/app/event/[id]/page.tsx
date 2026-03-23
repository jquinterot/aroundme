'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { EventMap } from '@/components/map';
import { apiService } from '@/services';
import { City } from '@/types';
import { AnalyticsPanel } from '@/components/events/AnalyticsPanel';
import { FeaturePromo } from '@/components/events/FeaturePromo';
import { EventActions, RSVPButtons, LoginPrompt } from '@/components/events/EventActions';
import { OwnerControls } from '@/components/events/OwnerControls';
import { EventCountdown } from '@/components/events/EventCountdown';
import { EventDetailHeader } from '@/components/events/EventDetailHeader';
import { TicketSection } from '@/components/events/TicketSection';
import { WaitlistButton } from '@/components/events/WaitlistButton';

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const eventId = (params.id as string) || '';

  const [showAnalytics, setShowAnalytics] = useState(false);

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  const { data: eventData, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => apiService.getEventById(eventId),
    enabled: !!eventId,
  });

  const { data: analyticsData, refetch: refetchAnalytics } = useQuery({
    queryKey: ['analytics', eventId],
    queryFn: () => fetch(`/api/events/${eventId}/analytics`).then(res => res.json()),
    enabled: !!eventId,
  });

  const { data: ticketsData } = useQuery({
    queryKey: ['event-tickets', eventId],
    queryFn: () => fetch(`/api/events/${eventId}/tickets`).then(res => res.json()),
    enabled: !!eventId,
  });

  useEffect(() => {
    if (eventId) {
      fetch(`/api/events/${eventId}/analytics`, { method: 'POST' });
    }
  }, [eventId]);

  const saveMutation = useMutation({
    mutationFn: () => fetch(`/api/events/${eventId}/save`, { method: 'POST' }).then(res => res.json()),
    onSuccess: () => refetchAnalytics(),
  });

  const rsvpMutation = useMutation({
    mutationFn: (status: string) => 
      fetch(`/api/events/${eventId}/rsvp`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).then(res => res.json()),
    onSuccess: () => refetchAnalytics(),
  });

  const featureMutation = useMutation({
    mutationFn: (tier: 'basic' | 'premium') => 
      fetch(`/api/events/${eventId}/feature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, userId: user?.id }),
      }).then(res => res.json()),
    onSuccess: () => {
      refetchAnalytics();
      window.location.reload();
    },
  });

  const removeFeatureMutation = useMutation({
    mutationFn: () => 
      fetch(`/api/events/${eventId}/feature`, {
        method: 'DELETE',
      }).then(res => res.json()),
    onSuccess: () => {
      refetchAnalytics();
      window.location.reload();
    },
  });

  const cities = citiesData?.data || [];
  const event = eventData?.data;
  const analytics = analyticsData?.data || { 
    viewCount: 0, 
    saveCount: 0, 
    rsvpCount: { going: 0, interested: 0, maybe: 0, total: 0 }, 
    isOwner: false, 
    isSaved: false, 
    userRsvp: null 
  };
  const city = cities.find((c: City) => c.id === event?.cityId) || cities[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event not found</h1>
          <Link href={`/${city?.slug || 'bogota'}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/${city?.slug || 'bogota'}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to events
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <EventDetailHeader event={event} />

          {ticketsData?.data && (
            <div className="px-6 md:px-8 pb-6">
              <TicketSection tickets={ticketsData.data} eventId={event.id} />
            </div>
          )}

          {analytics.isOwner && (
            <AnalyticsPanel 
              analytics={analytics} 
              showAnalytics={showAnalytics} 
              onToggle={() => setShowAnalytics(!showAnalytics)} 
            />
          )}

          {analytics.isOwner && (
            <FeaturePromo
              isFeatured={event.isFeatured}
              featuredTier={event.featuredTier}
              featuredUntil={event.featuredUntil}
              onFeatureBasic={() => featureMutation.mutate('basic')}
              onFeaturePremium={() => featureMutation.mutate('premium')}
              onRemoveFeature={() => removeFeatureMutation.mutate()}
              isPending={featureMutation.isPending || removeFeatureMutation.isPending}
            />
          )}

          {user && analytics.isOwner && (
            <OwnerControls
              eventId={event.id}
              eventTitle={event.title}
              eventStatus={event.status}
              citySlug={city?.slug || 'bogota'}
            />
          )}

          <div className="mt-8 px-6 md:px-8 pb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Location</h3>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <p className="text-gray-600 dark:text-gray-400">{event.venue.address}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${event.venue.coordinates.lat},${event.venue.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
            <div className="h-64 rounded-xl overflow-hidden">
              <EventMap
                events={[event]}
                city={city}
                selectedEvent={event}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="px-6 md:px-8 pb-6">
            <EventActions 
              isSaved={analytics.isSaved} 
              isAuthenticated={!!user} 
              onSave={() => saveMutation.mutate()}
              event={{
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                venue: event.venue,
              }}
              eventUrl={`${process.env.NEXT_PUBLIC_APP_URL || ''}/event/${event.id}`}
            />

            <EventCountdown 
              dateStart={event.date.start} 
              eventId={event.id}
              eventTitle={event.title}
            />

            {user ? (
              <RSVPButtons 
                userRsvp={analytics.userRsvp} 
                onRsvp={(status) => rsvpMutation.mutate(status)} 
              />
            ) : (
              <LoginPrompt />
            )}

            {event.maxAttendees && (
              <div className="mt-4">
                <WaitlistButton
                  eventId={event.id}
                  maxAttendees={event.maxAttendees}
                  currentAttendees={analytics.rsvpCount?.going || 0}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
