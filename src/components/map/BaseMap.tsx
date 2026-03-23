'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { City } from '@/types';

export interface MapItem {
  id: string;
  title: string;
  category: string;
  coordinates: { lat: number; lng: number } | null;
}

export interface BaseMapProps<T extends MapItem> {
  items: T[];
  city: City;
  selectedItem?: T | null;
  onSelect?: (item: T | null) => void;
  colorScheme: 'indigo' | 'teal' | 'amber';
  categoryIcons: Record<string, string>;
  getHref: (item: T) => string;
  className?: string;
}

const COLOR_MAP = {
  indigo: '#6366f1',
  teal: '#10b981',
  amber: '#f59e0b',
};

export function BaseMap<T extends MapItem>({
  items,
  city,
  selectedItem,
  onSelect,
  colorScheme,
  categoryIcons,
  getHref,
  className = '',
}: BaseMapProps<T>) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initMap = useCallback(async () => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const L = (await import('leaflet')).default;

    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([city.lat, city.lng], city.zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    const borderColor = COLOR_MAP[colorScheme];

    items.forEach((item) => {
      if (!item.coordinates) return;

      const svgIcon = categoryIcons[item.category] || categoryIcons.other;
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 36px;
          height: 36px;
          background: white;
          border: 2px solid ${borderColor};
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

      L.marker([item.coordinates.lat, item.coordinates.lng], { icon })
        .addTo(map)
        .on('click', () => {
          onSelect?.(item);
          router.push(getHref(item));
        });
    });

    mapInstanceRef.current = map;
  }, [isClient, city, items, colorScheme, categoryIcons, getHref, onSelect, router]);

  useEffect(() => {
    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    if (selectedItem?.coordinates && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedItem.coordinates.lat, selectedItem.coordinates.lng],
        14,
        { duration: 1 }
      );
    }
  }, [selectedItem]);

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
