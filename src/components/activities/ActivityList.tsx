'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { ListingActivity, City } from '@/types';
import { ActivityMap } from '@/components/map';

const categoryColors: Record<string, string> = {
  class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  tour: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  experience: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  wellness: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

interface ActivityListProps {
  activities: ListingActivity[];
  viewMode: 'grid' | 'list' | 'map' | 'split';
  city?: City;
}

export function ActivityList({ activities, viewMode, city }: ActivityListProps) {
  const [selectedActivity, setSelectedActivity] = useState<{ id: string; coordinates: { lat: number | null; lng: number | null } | null } | null>(null);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No activities found</h3>
        <p className="text-gray-500 dark:text-gray-400">Check back soon or be the first to create one!</p>
      </div>
    );
  }

  if (viewMode === 'map') {
    return (
      <div className="h-[600px] rounded-xl overflow-hidden shadow-inner bg-white dark:bg-gray-800">
        <ActivityMap
          activities={activities}
          city={city!}
          selectedActivity={selectedActivity}
          onActivitySelect={setSelectedActivity}
          className="w-full h-full"
        />
      </div>
    );
  }

  if (viewMode === 'split') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        <div className="overflow-y-auto pr-2 space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity({ id: activity.id, coordinates: activity.coordinates })}
              className={`cursor-pointer transition-all ${
                selectedActivity?.id === activity.id
                  ? 'ring-2 ring-amber-500 rounded-xl'
                  : ''
              }`}
            >
              <ActivityCard activity={activity} />
            </div>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden shadow-inner bg-white dark:bg-gray-800">
          <ActivityMap
            activities={activities}
            city={city!}
            selectedActivity={selectedActivity}
            onActivitySelect={setSelectedActivity}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityListItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}

function ActivityCard({ activity }: { activity: ListingActivity }) {
  return (
    <Link href={`/activity/${activity.id}`}>
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
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[activity.category] || categoryColors.other}`}>
            {activity.category}
          </span>
          <h3 className="font-semibold text-gray-900 dark:text-white mt-2 line-clamp-1">
            {activity.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            by {activity.providerName}
          </p>
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
  );
}

function ActivityListItem({ activity }: { activity: ListingActivity }) {
  return (
    <Link href={`/activity/${activity.id}`}>
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all p-4">
        <div className="flex gap-4">
          {activity.image ? (
            <div className="w-32 h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden relative">
              <Image src={activity.image} alt={activity.title} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🎯</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[activity.category] || categoryColors.other}`}>
                  {activity.category}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-1 line-clamp-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  by {activity.providerName}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`font-semibold block ${activity.isFree ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {activity.isFree ? 'Free' : `$${activity.price.toLocaleString()}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
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
          </div>
        </div>
      </article>
    </Link>
  );
}
