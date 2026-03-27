'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Ticket, MapPin, Star, AlertCircle, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Header, HeroSection } from '@/components/layout';
import { EventList, EventFilters } from '@/components/events';
import { ViewModeToggle, CardSkeleton } from '@/components/ui';
import { apiService } from '@/services';
import { City } from '@/types';
import { CityEventsClientProps, EventFilterState } from '@/types/components';

const viewModeOptions = [
  { value: 'list', label: 'List' },
  { value: 'split', label: 'Split' },
  { value: 'map', label: 'Map' },
];

function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
      <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
        Something went wrong
      </h3>
      <p className="text-red-600 dark:text-red-400 text-sm mb-4">
        {message || 'Failed to load data. Please try again.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        data-testid="retry-button"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

export default function CityEventsClient({ citySlug }: CityEventsClientProps) {
  const [filters, setFilters] = useState<EventFilterState>({
    category: 'all',
    date: 'all',
    price: 'all',
    search: '',
  });
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('split');

  const { data: citiesData, error: citiesError, refetch: refetchCities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  const { data: eventsData, error: eventsError, isLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['events', citySlug, filters],
    queryFn: () => apiService.getEvents(citySlug, {
      category: filters.category === 'all' ? undefined : filters.category,
      date: filters.date === 'all' ? undefined : filters.date,
      price: filters.price === 'all' ? undefined : filters.price,
      search: filters.search || undefined,
    }),
  });

  const cities = citiesData?.data || [];
  const events = eventsData?.data || [];
  const currentCity = cities.find((c: City) => c.slug === citySlug) || cities[0];

  const tabs = [
    { label: 'Events', href: `/${citySlug}`, icon: Ticket },
    { label: 'Places', href: `/${citySlug}/places`, icon: MapPin },
    { label: 'Activities', href: `/${citySlug}/activities`, icon: Star },
  ];

  const handleRetry = () => {
    if (citiesError) refetchCities();
    if (eventsError) refetchEvents();
  };

  return (
    <div data-testid="city-events-page" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main>
        <HeroSection
          title={`Discover what's happening in ${currentCity?.name || 'your city'}`}
          subtitle="Find events, activities, restaurants, and more"
          gradient="indigo"
          tabs={tabs}
          activeTab="Events"
          cities={cities}
          currentCity={currentCity}
        />

        <section data-testid="events-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              data-testid="create-event-button"
              href="/create-event"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          </div>

          <EventFilters onFilterChange={setFilters} />

          <div className="flex items-center justify-between mt-6 mb-4">
            <p data-testid="events-count" className="text-gray-600 dark:text-gray-400">
              {isLoading ? 'Loading...' : `${events.length} events found`}
            </p>
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={(mode) => setViewMode(mode as 'list' | 'map' | 'split')}
              options={viewModeOptions}
            />
          </div>

          {isLoading ? (
            <CardSkeleton />
          ) : citiesError || eventsError ? (
            <ErrorState
              message={(citiesError as Error)?.message || (eventsError as Error)?.message}
              onRetry={handleRetry}
            />
          ) : (
            <EventList events={events} viewMode={viewMode} city={currentCity} />
          )}
        </section>
      </main>
    </div>
  );
}
