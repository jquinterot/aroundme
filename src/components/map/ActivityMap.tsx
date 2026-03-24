'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListingActivity, City } from '@/types';

interface ActivityMapProps {
  activities: ListingActivity[];
  city: City;
  selectedActivity?: { id: string; coordinates: { lat: number | null; lng: number | null } | null } | null;
  onActivitySelect?: (activity: { id: string; coordinates: { lat: number | null; lng: number | null } | null } | null) => void;
  className?: string;
}

const CATEGORY_SVGS: Record<string, string> = {
  class: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>',
  tour: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  entertainment: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  experience: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  wellness: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="4"/><line x1="10" x2="10" y1="1" y2="4"/><line x1="14" x2="14" y1="1" y2="4"/></svg>',
  other: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
};

export function ActivityMap({ activities, city, selectedActivity, onActivitySelect, className = '' }: ActivityMapProps) {
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

      activities.forEach((activity) => {
        if (!activity.coordinates?.lat || !activity.coordinates?.lng) return;

        const svgIcon = CATEGORY_SVGS[activity.category] || CATEGORY_SVGS.other;
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 36px;
            height: 36px;
            background: white;
            border: 2px solid #f59e0b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
          ">${svgIcon}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        L.marker([activity.coordinates.lat, activity.coordinates.lng], { icon })
          .addTo(map)
          .on('click', () => {
            onActivitySelect?.({ id: activity.id, coordinates: activity.coordinates });
            router.push(`/activity/${activity.id}`);
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
  }, [isClient, city.lat, city.lng, city.zoom, activities, onActivitySelect, router]);

  useEffect(() => {
    if (selectedActivity?.coordinates && mapInstanceRef.current) {
      const { lat, lng } = selectedActivity.coordinates;
      if (lat != null && lng != null) {
        mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1 });
      }
    }
  }, [selectedActivity]);

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
