'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Ticket, MapPin, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Header, HeroSection, Footer } from '@/components/layout';
import { ViewModeToggle, CardSkeleton } from '@/components/ui';
import { ActivityList } from '@/components/activities/ActivityList';
import { apiService } from '@/services';
import { City, ListingActivity } from '@/types';

const categories = [
  { value: 'all', label: 'All', icon: '🎯' },
  { value: 'class', label: 'Classes', icon: '🎓' },
  { value: 'tour', label: 'Tours', icon: '🗺️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { value: 'experience', label: 'Experiences', icon: '✨' },
  { value: 'wellness', label: 'Wellness', icon: '🧘' },
];

const viewModeOptions = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map' },
];

export default function ActivitiesPage() {
  const params = useParams();
  const citySlug = (params.city as string) || 'bogota';
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  const cities = citiesData?.data || [];
  const currentCity = cities.find((c: City) => c.slug === citySlug) || cities[0];

  const { data: activitiesData, isLoading, error } = useQuery({
    queryKey: ['activities', citySlug, category],
    queryFn: async () => {
      const res = await fetch(`/api/cities/${citySlug}/activities?category=${category}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      return res.json();
    },
  });

  const activities: ListingActivity[] = activitiesData?.data || [];

  const tabs = [
    { label: 'Events', href: `/${citySlug}`, icon: Ticket },
    { label: 'Places', href: `/${citySlug}/places`, icon: MapPin },
    { label: 'Activities', href: `/${citySlug}/activities`, icon: Star },
  ];

  return (
    <div data-testid="city-activities-page" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main>
        <HeroSection
          title={`Discover Activities in ${currentCity?.name || 'your city'}`}
          subtitle="Classes, tours, experiences and more"
          gradient="amber"
          tabs={tabs}
          activeTab="Activities"
          cities={cities}
          currentCity={currentCity}
        />

        <section data-testid="activities-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              data-testid="create-activity-button"
              href="/create-activity"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Activity
            </Link>
          </div>

          <div data-testid="activities-category-filters" className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                data-testid={`category-${cat.value}`}
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 mb-4">
            <p data-testid="activities-count" className="text-gray-600 dark:text-gray-400">
              {isLoading ? 'Loading...' : `${activities.length} activities found`}
            </p>
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={(mode) => setViewMode(mode as 'grid' | 'list' | 'map')}
              options={viewModeOptions}
            />
          </div>

          {isLoading ? (
            <CardSkeleton />
          ) : error ? (
            <div data-testid="activities-error" className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-medium mb-2">Error loading activities</p>
              <p className="text-red-500 text-sm">{error.message}</p>
              <button
                data-testid="activities-retry-button"
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <ActivityList activities={activities} viewMode={viewMode} city={currentCity} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}