'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlaceCardProps } from '@/types/components';
import { CATEGORY_ICONS } from '@/lib/constants';
import { PlaceCategoryBadge, PlaceVerifiedBadge, PlacePriceRange, PlaceRating } from './PlaceCardBadges';

export function PlaceCard({ place }: PlaceCardProps) {
  const getCategoryIcon = (category: string) => CATEGORY_ICONS[category] || '📍';

  return (
    <Link href={`/place/${place.id}`} className="group">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-200">
        <div className="relative h-40 bg-gray-200">
          {place.image ? (
            <Image
              src={place.image}
              alt={place.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
              <span className="text-4xl">{getCategoryIcon(place.category)}</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <PlaceCategoryBadge place={place} />
            <PlaceVerifiedBadge isVerified={place.isVerified} />
          </div>
          <PlacePriceRange priceRange={place.priceRange} />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {place.name}
          </h3>
          
          <div className="space-y-1 text-sm text-gray-600">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{place.address}</span>
            </a>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
            <PlaceRating rating={place.rating} reviewCount={place.reviewCount} />
            {place.isClaimed && (
              <span className="text-xs text-indigo-600 font-medium">Claimed</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
