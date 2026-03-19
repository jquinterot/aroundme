'use client';

import { useState } from 'react';
import { Place } from '@/types';
import { PlaceListProps } from '@/types/components';
import { PlaceCard } from './PlaceCard';
import { PlaceMap } from '@/components/map';

export function PlaceList({ places, viewMode, city }: PlaceListProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No places found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  if (viewMode === 'map') {
    return (
      <div className="h-[600px] rounded-xl overflow-hidden shadow-inner">
        <PlaceMap
          places={places}
          city={city}
          selectedPlace={selectedPlace}
          onPlaceSelect={setSelectedPlace}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
