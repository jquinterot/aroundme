'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EventCardProps } from '@/types/components';
import { CATEGORY_ICONS } from '@/lib/constants';
import { FeaturedBadge, CategoryBadge, FreeBadge, PriceDisplay, VerifiedBadge } from './EventCardBadges';
import { formatEventDate, formatEventTime } from './eventUtils';

export function EventCard({ event }: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getCategoryIcon = (category: string) => CATEGORY_ICONS[category] || '📍';
  const hasValidImage = event.image && !imageError;

  return (
    <Link href={`/event/${event.id}`} className="group">
      <article className={`bg-white rounded-xl overflow-hidden shadow-sm border transition-all duration-200 hover:shadow-lg ${
        event.isFeatured 
          ? 'border-yellow-300 hover:border-yellow-400 ring-2 ring-yellow-100' 
          : 'border-gray-200 hover:border-indigo-200'
      }`}>
        <div className="relative h-40 bg-gradient-to-br from-indigo-100 to-purple-100">
          <FeaturedBadge event={event} />
          {hasValidImage ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <Image
                src={event.image!}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">{getCategoryIcon(event.category)}</span>
            </div>
          )}
          {!event.isFeatured && (
            <div className="absolute top-3 left-3 flex gap-2">
              <CategoryBadge event={event} />
              <FreeBadge isFree={event.price?.isFree} />
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className={`font-semibold mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors ${
            event.isFeatured ? 'text-yellow-800' : 'text-gray-900'
          }`}>
            {event.title}
          </h3>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatEventDate(event.date.start)} · {formatEventTime(event.date.start)}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.venue.coordinates.lat},${event.venue.coordinates.lng}`, '_blank');
              }}
              className="flex items-center gap-2 hover:text-indigo-600 transition-colors w-full text-left"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{event.venue.name}</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {event.isFeatured && (
                <CategoryBadge event={event} />
              )}
              <PriceDisplay event={event} isFeatured={event.isFeatured} />
              {event.price?.isFree && !event.isFeatured && (
                <FreeBadge isFree={true} />
              )}
            </div>
            <VerifiedBadge isVerified={event.organizer?.isVerified} />
          </div>
        </div>
      </article>
    </Link>
  );
}
