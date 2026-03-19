'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { EventMap } from '@/components/map';
import { apiService } from '@/services';
import { City } from '@/types';
import { CATEGORY_ICONS, EVENT_CATEGORY_COLORS } from '@/lib/constants';
import { AnalyticsPanel } from '@/components/events/AnalyticsPanel';
import { FeaturePromo } from '@/components/events/FeaturePromo';
import { EventActions, RSVPButtons, LoginPrompt } from '@/components/events/EventActions';
import { formatDetailDate, formatDetailTime } from '@/components/events/eventUtils';

const getCategoryIcon = (category: string) => CATEGORY_ICONS[category] || '📍';
const getCategoryColor = (category: string) => EVENT_CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';

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

  const formatPrice = () => {
    if (!event?.price) return 'Free';
    if (event.price.isFree) return 'Free';
    return `${event.price.currency} ${event.price.min.toLocaleString()} - ${event.price.max.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Link href={`/${city?.slug || 'bogota'}`} className="text-indigo-600 hover:text-indigo-700">
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/${city?.slug || 'bogota'}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to events
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-64 md:h-80 bg-gray-200">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <span className="text-6xl">{getCategoryIcon(event.category)}</span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                {getCategoryIcon(event.category)} {event.category}
              </span>
              {event.price?.isFree && (
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white">
                  Free
                </span>
              )}
              {event.isFeatured && (
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {event.featuredTier === 'premium' ? 'Premium' : 'Featured'}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDetailDate(event.date.start)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDetailTime(event.date.start)} - {formatDetailTime(event.date.end)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{event.venue.name}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6 whitespace-pre-wrap">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {event.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">{getCategoryIcon(event.category)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.organizer.name}</p>
                    {event.organizer.isVerified && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified Organizer
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl font-bold text-indigo-600">{formatPrice()}</p>
                </div>
              </div>
            </div>

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

            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <p className="text-gray-600">{event.venue.address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${event.venue.coordinates.lat},${event.venue.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
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

            <EventActions 
              isSaved={analytics.isSaved} 
              isAuthenticated={!!user} 
              onSave={() => saveMutation.mutate()}
              event={{
                title: event.title,
                description: event.description,
                date: event.date,
                venue: event.venue,
              }}
              eventUrl={`${process.env.NEXT_PUBLIC_APP_URL || ''}/event/${event.id}`}
            />

            {user ? (
              <RSVPButtons 
                userRsvp={analytics.userRsvp} 
                onRsvp={(status) => rsvpMutation.mutate(status)} 
              />
            ) : (
              <LoginPrompt />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
