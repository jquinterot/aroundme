'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Ticket, MapPin, Star } from 'lucide-react';
import { Header, HeroSection, Footer } from '@/components/layout';
import { PlaceList } from '@/components/places';
import { ViewModeToggle } from '@/components/ui';
import { City, Place } from '@/types';

const viewModeOptions = [
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];

interface PlacesClientProps {
  citySlug: string;
  initialPlaces: Place[];
  initialCities: City[];
}

export default function PlacesClient({ citySlug, initialPlaces = [], initialCities = [] }: PlacesClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [places] = useState<Place[]>(initialPlaces);

  const cities = initialCities;
  const currentCity = cities.find((c: City) => c.slug === citySlug) || cities[0];

  const tabs = [
    { label: 'Events', href: `/${citySlug}`, icon: Ticket },
    { label: 'Places', href: `/${citySlug}/places`, icon: MapPin },
    { label: 'Activities', href: `/${citySlug}/activities`, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

          <div className="flex items-center justify-between mt-6 mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              {places.length} places found
            </p>
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={(mode) => setViewMode(mode as 'grid' | 'map')}
              options={viewModeOptions}
            />
          </div>

          <PlaceList places={places} viewMode={viewMode} city={currentCity} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
