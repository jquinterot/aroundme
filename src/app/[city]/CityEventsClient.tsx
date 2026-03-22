'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Ticket, MapPin } from 'lucide-react';
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

export default function CityEventsClient({ citySlug }: CityEventsClientProps) {
  const [filters, setFilters] = useState<EventFilterState>({
    category: 'all',
    date: 'all',
    price: 'all',
    search: '',
  });
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('split');

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  const { data: eventsData, isLoading } = useQuery({
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
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          </div>

          <EventFilters onFilterChange={setFilters} />

          <div className="flex items-center justify-between mt-6 mb-4">
            <p className="text-gray-600 dark:text-gray-400">
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
          ) : (
            <EventList events={events} viewMode={viewMode} city={currentCity} />
          )}
        </section>
      </main>
    </div>
  );
}
