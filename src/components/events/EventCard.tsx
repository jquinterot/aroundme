'use client';

import { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import { EventCardProps } from '@/types/components';
import { FeaturedBadge, CategoryBadge, FreeBadge, PriceDisplay, VerifiedBadge } from './EventCardBadges';
import { formatEventDate, formatEventTime } from './eventUtils';
import { PlaceholderImage } from '@/components/ui/Placeholder';

function getTimeUntilEvent(dateStart: string): { days: number; hours: number; minutes: number; total: number } | null {
  const diff = new Date(dateStart).getTime() - Date.now();
  if (diff <= 0) return null;
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    total: diff,
  };
}

export function EventCard({ event }: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [timeUntil, setTimeUntil] = useState<{ days: number; hours: number; minutes: number; total: number } | null>(null);

  useEffect(() => {
    startTransition(() => {
      setTimeUntil(getTimeUntilEvent(event.date.start));
    });
    const timer = setInterval(() => {
      startTransition(() => {
        setTimeUntil(getTimeUntilEvent(event.date.start));
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [event.date.start]);

  const hasValidImage = event.image && !imageError;
  const isUpcoming = timeUntil && timeUntil.total > 0 && timeUntil.total <= 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/event/${event.id}`} className="group">
      <article className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border transition-all duration-200 hover:shadow-lg ${
        event.isFeatured 
          ? 'border-yellow-300 hover:border-yellow-400 ring-2 ring-yellow-100 dark:ring-yellow-900/50' 
          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
      }`}>
        <div className="relative h-40">
          <FeaturedBadge event={event} />
          {hasValidImage ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
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
            <PlaceholderImage type="event" category={event.category} size="lg" className="w-full h-full rounded-none" />
          )}
          {!event.isFeatured && (
            <div className="absolute top-3 left-3 flex gap-2">
              <CategoryBadge event={event} />
              <FreeBadge isFree={event.price?.isFree} />
            </div>
          )}
          {isUpcoming && (
            <div className="absolute top-3 right-3">
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-sm">
                <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  {timeUntil.days > 0 ? `${timeUntil.days}d ` : ''}
                  {timeUntil.days === 0 && timeUntil.hours > 0 ? `${timeUntil.hours}h ` : ''}
                  {timeUntil.days === 0 && timeUntil.hours === 0 ? `${timeUntil.minutes}m` : timeUntil.hours === 0 ? `${String(timeUntil.minutes).padStart(2, '0')}m` : `${String(timeUntil.minutes).padStart(2, '0')}m`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className={`font-semibold mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
            event.isFeatured ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-900 dark:text-gray-100'
          }`}>
            {event.title}
          </h3>
          
          <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-full text-left"
            >
              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="line-clamp-1">{event.venue.name}</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
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
