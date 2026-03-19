'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { EventCardProps } from '@/types/components';
import { CATEGORY_ICONS, EVENT_CATEGORY_COLORS } from '@/lib/constants';

export function EventCard({ event }: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getCategoryIcon = (category: string) => CATEGORY_ICONS[category] || '📍';
  const getCategoryColor = (category: string) => EVENT_CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatPrice = () => {
    if (event.price?.isFree) return 'Free';
    if (event.price) {
      return `${event.price.currency} ${event.price.min.toLocaleString()}`;
    }
    return 'Free';
  };

  const hasValidImage = event.image && !imageError;

  return (
    <Link href={`/event/${event.id}`} className="group">
      <article className={`bg-white rounded-xl overflow-hidden shadow-sm border transition-all duration-200 hover:shadow-lg ${
        event.isFeatured 
          ? 'border-yellow-300 hover:border-yellow-400 ring-2 ring-yellow-100' 
          : 'border-gray-200 hover:border-indigo-200'
      }`}>
        <div className="relative h-40 bg-gradient-to-br from-indigo-100 to-purple-100">
          {event.isFeatured && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {event.featuredTier === 'premium' ? 'Premium' : 'Featured'}
            </div>
          )}
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
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                {getCategoryIcon(event.category)} {event.category}
              </span>
              {event.price?.isFree && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                  Free
                </span>
              )}
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
              <span>{formatDate(event.date.start)} · {formatTime(event.date.start)}</span>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${event.venue.coordinates.lat},${event.venue.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{event.venue.name}</span>
            </a>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {event.isFeatured && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                  {getCategoryIcon(event.category)} {event.category}
                </span>
              )}
              <span className={`font-semibold ${event.isFeatured ? 'text-yellow-600' : 'text-indigo-600'}`}>{formatPrice()}</span>
              {event.price?.isFree && !event.isFeatured && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                  Free
                </span>
              )}
            </div>
            {event.organizer?.isVerified && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
