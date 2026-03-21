'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Ticket, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Header, HeroSection, Footer } from '@/components/layout';
import { PlaceList, PlaceFilters } from '@/components/places';
import { ViewModeToggle, CardSkeleton } from '@/components/ui';
import { apiService } from '@/services';
import { City } from '@/types';
import { PlaceFilterState } from '@/types/components';

const viewModeOptions = [
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];

export default function PlacesPage() {
  const params = useParams();
  const citySlug = (params.city as string) || 'bogota';
  const [filters, setFilters] = useState<PlaceFilterState>({
    category: 'all',
    search: '',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  const { data: placesData, isLoading } = useQuery({
    queryKey: ['places', citySlug, filters],
    queryFn: () => apiService.getPlaces(citySlug, {
      category: filters.category === 'all' ? undefined : filters.category,
      search: filters.search || undefined,
    }),
  });

  const cities = citiesData?.data || [];
  const places = placesData?.data || [];
  const currentCity = cities.find((c: City) => c.slug === citySlug) || cities[0];

  const tabs = [
    { label: 'Events', href: `/${citySlug}`, icon: Ticket },
    { label: 'Places', href: `/${citySlug}/places`, icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        <HeroSection
          title={`Discover places in ${currentCity?.name || 'your city'}`}
          subtitle="Restaurants, cafes, bars, and more"
          gradient="teal"
          tabs={tabs}
          activeTab="Places"
          cities={cities}
          currentCity={currentCity}
        />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              href="/submit-place"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Place
            </Link>
          </div>

          <PlaceFilters onFilterChange={setFilters} />

          <div className="flex items-center justify-between mt-6 mb-4">
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `${places.length} places found`}
            </p>
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={(mode) => setViewMode(mode as 'grid' | 'map')}
              options={viewModeOptions}
            />
          </div>

          {isLoading ? (
            <CardSkeleton />
          ) : (
            <PlaceList places={places} viewMode={viewMode} city={currentCity} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
