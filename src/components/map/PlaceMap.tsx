'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Place } from '@/types';
import { PlaceMapProps } from '@/types/components';
import { CATEGORY_ICONS } from '@/lib/constants';

export function PlaceMap({ places, city, selectedPlace, onPlaceSelect, className = '' }: PlaceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([city.lat, city.lng], city.zoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      places.forEach((place) => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 36px;
            height: 36px;
            background: white;
            border: 2px solid #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
          ">${CATEGORY_ICONS[place.category] || '📍'}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        L.marker([place.coordinates.lat, place.coordinates.lng], { icon })
          .addTo(map)
          .on('click', () => {
            onPlaceSelect?.(place);
            router.push(`/place/${place.id}`);
          });
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, city.lat, city.lng, city.zoom, places, onPlaceSelect, router]);

  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
        14,
        { duration: 1 }
      );
    }
  }, [selectedPlace]);

  if (!isClient) {
    return (
      <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-xl z-0 ${className}`} 
      style={{ height: '100%', width: '100%', minHeight: '400px' }}
    />
  );
}
