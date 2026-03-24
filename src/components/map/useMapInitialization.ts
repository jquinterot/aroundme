'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapItem } from './BaseMap';
import { City } from '@/types';

interface UseMapInitializationOptions<T extends MapItem> {
  items: T[];
  city: City;
  selectedItem: T | null;
  colorScheme: 'indigo' | 'teal' | 'amber';
  categoryIcons: Record<string, string>;
  onItemSelect?: (item: T | null) => void;
  getItemById?: (id: string) => T | undefined;
}

interface UseMapInitializationResult {
  mapRef: React.RefObject<HTMLDivElement | null>;
  isClient: boolean;
}

const COLOR_MAP = {
  indigo: '#6366f1',
  teal: '#10b981',
  amber: '#f59e0b',
};

export function useMapInitialization<T extends MapItem>({
  items,
  city,
  selectedItem,
  colorScheme,
  categoryIcons,
  onItemSelect,
  getItemById,
}: UseMapInitializationOptions<T>): UseMapInitializationResult {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initMap = useCallback(async () => {
    console.log('[MapInit] initMap called, isClient:', isClient, 'mapRef.current:', !!mapRef.current, 'hasInstance:', !!mapInstanceRef.current);
    if (!isClient || !mapRef.current || mapInstanceRef.current) {
      console.log('[MapInit] Early return - isClient:', isClient, 'mapRef:', !!mapRef.current, 'instance:', !!mapInstanceRef.current);
      return;
    }

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
          if (getItemById) {
            const found = getItemById(item.id);
            onItemSelect?.(found ?? null);
          } else {
            onItemSelect?.(item);
          }
        });
    });

    mapInstanceRef.current = map;
    console.log('[MapInit] Map created successfully with', items.length, 'items');
  }, [isClient, city, items, colorScheme, categoryIcons, onItemSelect, getItemById]);

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

  return { mapRef, isClient };
}
