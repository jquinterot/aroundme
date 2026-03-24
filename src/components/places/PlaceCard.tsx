'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { PlaceCardProps } from '@/types/components';
import { PlaceCategoryBadge, PlaceVerifiedBadge, PlacePriceRange, PlaceRating } from './PlaceCardBadges';
import { PlaceholderImage } from '@/components/ui/Placeholder';

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link href={`/place/${place.id}`} className="group">
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all duration-200">
        <div className="relative h-40">
          {place.image ? (
            <Image
              src={place.image}
              alt={place.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <PlaceholderImage type="place" category={place.category} size="lg" className="w-full h-full rounded-none" />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <PlaceCategoryBadge place={place} />
            <PlaceVerifiedBadge isVerified={place.isVerified} />
          </div>
          <PlacePriceRange priceRange={place.priceRange} />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {place.name}
          </h3>
          
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`, '_blank');
              }}
              className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors w-full text-left"
            >
              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="line-clamp-1">{place.address}</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <PlaceRating rating={place.rating} reviewCount={place.reviewCount} />
            {place.isClaimed && (
              <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">Claimed</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
