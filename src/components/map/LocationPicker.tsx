'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  className?: string;
  height?: number;
}

export function LocationPicker({ lat, lng, onLocationChange, className = '', height = 250 }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const reverseGeocode = useCallback(async (clickLat: number, clickLng: number) => {
    try {
      const params = new URLSearchParams({
        lat: clickLat.toString(),
        lon: clickLng.toString(),
        format: 'json',
        addressdetails: '1',
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params}`,
        {
          headers: { 'Accept-Language': 'es,en' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.display_name as string;
      }
    } catch (error) {
      console.error('Reverse geocode error:', error);
    }
    return undefined;
  }, []);

  const _flyToLocation = useCallback((newLat: number, newLng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([newLat, newLng], 15, { duration: 1 });
    }
    setSelectedLocation({ lat: newLat, lng: newLng });

    if (markerRef.current) {
      markerRef.current.setLatLng([newLat, newLng]);
    } else if (mapInstanceRef.current) {
      const L = (window as unknown as { L: typeof import('leaflet') }).L;
      if (L) {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 32px;
            height: 32px;
            background: #6366f1;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="transform: rotate(45deg); color: white; font-size: 14px;">📍</div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        markerRef.current = L.marker([newLat, newLng], { icon }).addTo(mapInstanceRef.current);
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet').then((m) => m.default);

      if (!mapRef.current || mapInstanceRef.current) return;

      const defaultCenter: [number, number] = lat && lng ? [lat, lng] : [4.711, -74.0721];
      const defaultZoom = lat && lng ? 15 : 12;

      const map = L.map(mapRef.current).setView(defaultCenter, defaultZoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      if (selectedLocation) {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 32px;
            height: 32px;
            background: #6366f1;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="transform: rotate(45deg); color: white; font-size: 14px;">📍</div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], { icon })
          .addTo(map);
      }

      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        setSelectedLocation({ lat: clickLat, lng: clickLng });

        const address = await reverseGeocode(clickLat, clickLng);
        onLocationChange(clickLat, clickLng, address);

        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLng]);
        } else {
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: 32px;
              height: 32px;
              background: #6366f1;
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="transform: rotate(45deg); color: white; font-size: 14px;">📍</div>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          markerRef.current = L.marker([clickLat, clickLng], { icon }).addTo(map);
        }
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isClient, lat, lng, selectedLocation, onLocationChange, reverseGeocode]);

  useEffect(() => {
    if (lat && lng && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1 });
      setSelectedLocation({ lat, lng });

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  }, [lat, lng]);

  if (!isClient) {
    return (
      <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} style={{ height }}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className={`rounded-xl z-0 ${className}`}
        style={{ height, width: '100%', cursor: 'crosshair' }}
      />
      {selectedLocation ? (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>
            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedLocation(null);
              onLocationChange(0, 0);
            }}
            className="ml-auto text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-xs"
          >
            Clear
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click on the map or search for an address
        </p>
      )}
    </div>
  );
}
