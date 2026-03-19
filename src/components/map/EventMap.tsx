'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event, City } from '@/types';

interface EventMapProps {
  events: Event[];
  city: City;
  selectedEvent?: Event | null;
  onEventSelect?: (event: Event | null) => void;
  className?: string;
}

const categoryIcons: Record<string, string> = {
  music: '🎵',
  food: '🍔',
  sports: '⚽',
  art: '🎨',
  tech: '💻',
  community: '👥',
  nightlife: '🌙',
  outdoor: '🌳',
  education: '📚',
  other: '📌',
};

export function EventMap({ events, city, selectedEvent, onEventSelect, className = '' }: EventMapProps) {
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

      events.forEach((event) => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 36px;
            height: 36px;
            background: white;
            border: 2px solid #6366f1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
          ">${categoryIcons[event.category] || '📍'}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        L.marker([event.venue.coordinates.lat, event.venue.coordinates.lng], { icon })
          .addTo(map)
          .on('click', () => {
            onEventSelect?.(event);
            router.push(`/event/${event.id}`);
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
  }, [isClient, city.lat, city.lng, city.zoom, events, onEventSelect, router]);

  useEffect(() => {
    if (selectedEvent && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedEvent.venue.coordinates.lat, selectedEvent.venue.coordinates.lng],
        14,
        { duration: 1 }
      );
    }
  }, [selectedEvent]);

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
