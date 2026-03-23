'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Ticket, MapPin, Star, Clock, Users, CheckCircle } from 'lucide-react';
import { Header, HeroSection, Footer } from '@/components/layout';
import { ViewModeToggle } from '@/components/ui';
import { ActivityMap } from '@/components/map';
import { City, ListingActivity } from '@/types';

const categories = [
  { value: 'all', label: 'All', icon: '🎯' },
  { value: 'class', label: 'Classes', icon: '🎓' },
  { value: 'tour', label: 'Tours', icon: '🗺️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { value: 'experience', label: 'Experiences', icon: '✨' },
  { value: 'wellness', label: 'Wellness', icon: '🧘' },
];

const categoryColors: Record<string, string> = {
  class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  tour: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  experience: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  wellness: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

interface ActivitiesClientProps {
  citySlug: string;
  initialActivities: ListingActivity[];
  initialCities: City[];
}

export default function ActivitiesClient({ citySlug, initialActivities = [], initialCities = [] }: ActivitiesClientProps) {
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const activities = initialActivities;

  const cities = initialCities;
  const currentCity = cities.find((c: City) => c.slug === citySlug) || cities[0];

  const filteredActivities = category === 'all' 
    ? activities 
    : activities.filter(a => a.category === category);

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
          title={`Discover Activities in ${currentCity?.name || 'your city'}`}
          subtitle="Classes, tours, experiences and more"
          gradient="amber"
          tabs={tabs}
          activeTab="Activities"
          cities={cities}
          currentCity={currentCity}
        />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Link
              href="/create-activity"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Activity
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              {`${filteredActivities.length} activities found`}
            </p>
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={(mode) => setViewMode(mode as 'grid' | 'list' | 'map')}
              options={[
                { value: 'grid', label: 'Grid' },
                { value: 'list', label: 'List' },
                { value: 'map', label: 'Map' },
              ]}
              colorScheme="amber"
            />
          </div>

          {filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No activities found</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back soon or be the first to create one!</p>
            </div>
          ) : viewMode === 'map' ? (
            <div className="h-[600px] rounded-xl overflow-hidden shadow-inner">
              <ActivityMap
                activities={filteredActivities}
                city={currentCity}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredActivities.map((activity) => (
                <Link key={activity.id} href={`/activity/${activity.id}`}>
                  <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                    {activity.image ? (
                      <div className="relative h-40 bg-gray-200">
                        <Image src={activity.image} alt={activity.title} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center">
                        <span className="text-4xl">🎯</span>
                      </div>
                    )}
                    <div className="p-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[activity.category] || 'bg-gray-100 text-gray-700'}`}>
                        {activity.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white mt-2 line-clamp-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        by {activity.providerName}
                      </p>
                      {activity.address && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (activity.coordinates) {
                              window.open(`https://www.google.com/maps/dir/?api=1&destination=${activity.coordinates.lat},${activity.coordinates.lng}`, '_blank');
                            } else {
                              window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activity.address || '')}`, '_blank');
                            }
                          }}
                          className="flex items-center gap-1.5 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors w-full text-left"
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{activity.address}</span>
                        </button>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{activity.schedule || 'Flexible'}</span>
                        </div>
                        {activity.duration && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{activity.duration}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <span className={`font-semibold ${activity.isFree ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {activity.isFree ? 'Free' : `$${activity.price.toLocaleString()} ${activity.currency}`}
                        </span>
                        {activity.bookingCount > 0 && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3" />
                            {activity.bookingCount} booked
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
