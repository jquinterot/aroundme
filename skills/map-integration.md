---
name: map-integration
description: Implement Leaflet maps with markers, popups, and location features. Use for map-related components and location selection.
---

This skill guides map implementation in the AroundMe application using React Leaflet.

## Map Components

- `src/components/map/EventMap.tsx` - Event markers on map
- `src/components/map/PlaceMap.tsx` - Place markers on map
- `src/components/map/ActivityMap.tsx` - Activity markers on map
- `src/components/map/LocationPicker.tsx` - Location selection
- `src/components/map/AddressSearchInput.tsx` - Address autocomplete

## Map Pattern

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
  }>;
}

export function MapComponent({ center, zoom = 13, markers = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet').then(m => m.default);
      
      const map = L.map(mapRef.current!).setView(
        [center.lat, center.lng],
        zoom
      );

      // Use Carto light tiles (free)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
        }
      ).addTo(map);

      // Add markers
      markers.forEach(marker => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 32px;
            height: 32px;
            background: #4f46e5;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        L.marker([marker.lat, marker.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${marker.title}</b>`);
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
  }, [isClient, center, zoom, markers]);

  if (!isClient) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl h-96">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="rounded-xl z-0 h-96"
      style={{ width: '100%' }}
    />
  );
}
```

## Custom Marker Colors

```typescript
const markerColors = {
  event: '#4f46e5',    // Indigo
  place: '#0d9488',    // Teal
  activity: '#d97706', // Amber
};

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}
```

## Location Picker Pattern

For event/place creation forms:

```typescript
interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationPicker({ lat, lng, onLocationChange }: LocationPickerProps) {
  // ... map initialization

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      
      // Update marker
      if (markerRef.current) {
        markerRef.current.setLatLng([clickLat, clickLng]);
      } else {
        markerRef.current = L.marker([clickLat, clickLng], {
          icon: createMarkerIcon('#4f46e5'),
        }).addTo(mapInstanceRef.current);
      }

      // Callback
      onLocationChange(clickLat, clickLng);
    });
  }, [onLocationChange]);

  // ... render
}
```

## Address Autocomplete

Using Nominatim (OpenStreetMap):

```typescript
interface AddressSearchInputProps {
  value: string;
  onChange: (address: string) => void;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export function AddressSearchInput({ 
  value, 
  onChange, 
  onLocationSelect 
}: AddressSearchInputProps) {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();

  const searchAddress = async (query: string) => {
    if (query.length < 3) return;

    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '5',
      countrycodes: 'co', // Colombia only
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`
    );
    const data = await response.json();
    setResults(data);
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 300);
  };

  const handleSelect = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    onChange(result.display_name);
    onLocationSelect(lat, lng, result.display_name);
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search for an address..."
        className="w-full px-4 py-2.5 border rounded-lg..."
      />
      
      {results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Reverse Geocoding

Clicking on map fills address:

```typescript
const reverseGeocode = async (lat: number, lng: number) => {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: 'json',
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`
  );
  const data = await response.json();
  return data.display_name;
};
```

## Map Height Standards

```typescript
// Detail pages
className="h-96"  // 384px

// Location picker (forms)
height={250}

// Full width map
className="h-[500px]"
```

## Tile Providers

```typescript
// Carto Light (default, free)
'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

// Carto Dark
'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

// OpenStreetMap (has rate limits)
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
```

## Checklist

- [ ] 'use client' directive for map components
- [ ] Lazy load Leaflet (dynamic import)
- [ ] Cleanup map on unmount
- [ ] Loading state while map initializes
- [ ] Custom marker icons per type
- [ ] Address autocomplete with debounce
- [ ] Reverse geocoding on map click
- [ ] Proper z-index for map overlays
