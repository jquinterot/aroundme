'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, MapPin, Star, CheckCircle, Ticket, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { EventMap } from '@/components/map';
import { apiService } from '@/services';
import { City } from '@/types';
import { CATEGORY_ICONS, EVENT_CATEGORY_COLORS } from '@/lib/constants';
import { AnalyticsPanel } from '@/components/events/AnalyticsPanel';
import { FeaturePromo } from '@/components/events/FeaturePromo';
import { EventActions, RSVPButtons, LoginPrompt } from '@/components/events/EventActions';
import { OwnerControls } from '@/components/events/OwnerControls';
import { EventCountdown } from '@/components/events/EventCountdown';
import { formatDetailDate, formatDetailTime } from '@/components/events/eventUtils';

const CategoryIcon = (category: string) => CATEGORY_ICONS[category] || CATEGORY_ICONS.other;
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

  const formatPrice = () => {
    if (!event?.price) return 'Free';
    if (event.price.isFree) return 'Free';
    return `${event.price.currency} ${event.price.min.toLocaleString()} - ${event.price.max.toLocaleString()}`;
  };

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
          <Link href={`/${city?.slug || 'bogota'}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700dark:hover:text-indigo-300">
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
          <div className="relative h-64 md:h-80 bg-gray-200 dark:bg-gray-700">
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50">
                {(() => { const Icon = CategoryIcon(event.category); return <Icon className="w-20 h-20 text-indigo-300 dark:text-indigo-600" />; })()}
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                {(() => { const Icon = CategoryIcon(event.category); return <Icon size={16} />; })()} {event.category}
              </span>
              {event.price?.isFree && (
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white">
                  Free
                </span>
              )}
              {event.isFeatured && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-4 h-4 fill-current" />
                  {event.featuredTier === 'premium' ? 'Premium' : 'Featured'}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{formatDetailDate(event.date.start)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{formatDetailTime(event.date.start)} - {formatDetailTime(event.date.end)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{event.venue.name}</span>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {event.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    {(() => { const Icon = CategoryIcon(event.category); return <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />; })()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{event.organizer.name}</p>
                    {event.organizer.isVerified && (
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified Organizer
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatPrice()}</p>
                </div>
              </div>
            </div>

            {ticketsData?.data?.ticketTypes?.length > 0 && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-indigo-600" />
                    Get Tickets
                  </h3>
                </div>
                <div className="space-y-2">
                  {ticketsData.data.ticketTypes.map((ticket: any) => {
                    const available = ticket.quantity - ticket.sold;
                    const isOnSale = (!ticket.saleStart || new Date() >= new Date(ticket.saleStart)) &&
                                   (!ticket.saleEnd || new Date() <= new Date(ticket.saleEnd));
                    return (
                      <div key={ticket.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div>
                          <p className="font-medium text-gray-900">{ticket.name}</p>
                          <p className="text-sm text-gray-500">
                            {available > 0 ? `${available} available` : 'Sold out'}
                            {ticket.maxPerUser && ` • Max ${ticket.maxPerUser} per person`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">
                            {ticket.price === 0 ? 'Free' : `$${ticket.price.toLocaleString('COP')}`}
                          </span>
                          {isOnSale && available > 0 && (
                            <Link
                              href={`/checkout?event_id=${event.id}`}
                              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              Buy
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
