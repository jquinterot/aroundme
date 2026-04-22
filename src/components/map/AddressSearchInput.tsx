'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressSearchInputProps {
  value: string;
  onChange: (address: string) => void;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
  className?: string;
  countryCodes?: string;
}

export function AddressSearchInput({
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Search for an address...',
  className = '',
  countryCodes = 'co',
}: AddressSearchInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const searchAddress = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        countrycodes: countryCodes,
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          headers: {
            'Accept-Language': 'es,en',
          },
        }
      );

      if (response.ok) {
        const data: NominatimResult[] = await response.json();
        setResults(data);
        setIsOpen(data.length > 0);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Address search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [countryCodes]);

  const handleInputChange = (newValue: string) => {
    setQuery(newValue);
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
    setQuery(result.display_name);
    onChange(result.display_name);
    onLocationSelect(lat, lng, result.display_name);
    setIsOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setResults([]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((result, index) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleSelect(result)}
              className={`w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                index === selectedIndex ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {result.display_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
