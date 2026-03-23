'use client';

import Image from 'next/image';
import { Star, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { CATEGORY_ICONS } from '@/lib/constants';
import { formatDetailDate, formatDetailTime } from './eventUtils';

const CategoryIcon = (category: string) => CATEGORY_ICONS[category] || CATEGORY_ICONS.other;

interface EventDetailHeaderProps {
  event: {
    image?: string | null;
    title: string;
    category: string;
    date: { start: string; end?: string };
    venue: { name: string; address: string };
    description: string;
    tags: string[];
    isFeatured: boolean;
    featuredTier?: string | null;
    price?: { isFree: boolean; min?: number; max?: number };
    organizer?: { name: string; isVerified?: boolean } | null;
  };
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
  const CategoryIconComponent = CategoryIcon(event.category);
  const formatPrice = () => {
    if (event.price?.isFree) return 'Free';
    if (event.price?.min !== undefined && event.price?.max !== undefined) {
      return `$${event.price.min.toLocaleString('COP')} - $${event.price.max.toLocaleString('COP')}`;
    }
    return event.price?.min ? `From $${event.price.min.toLocaleString('COP')}` : '';
  };

  return (
    <>
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
            <CategoryIconComponent className="w-20 h-20 text-indigo-300 dark:text-indigo-600" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CategoryIconComponent size={16} /> {event.category}
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
            <span>{formatDetailTime(event.date.start)} - {formatDetailTime(event.date.end || event.date.start)}</span>
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
                <CategoryIconComponent className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{event.organizer?.name}</p>
                {event.organizer?.isVerified && (
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
      </div>
    </>
  );
}
