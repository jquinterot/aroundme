'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Calendar, MapPin, Star, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CATEGORY_ICONS } from '@/lib/constants';

interface SearchResult {
  id: string;
  title: string;
  name: string;
  category: string;
  city: { name: string; slug: string };
  venueName: string;
  address: string;
  dateStart: string;
  isFree: boolean;
  rating: number;
  reviewCount: number;
  image: string | null;
  type: 'event' | 'place';
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ events: SearchResult[]; places: SearchResult[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      const timeoutId = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (data.success) {
            setResults(data.data);
            setIsOpen(true);
          }
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults(null);
      setIsOpen(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/bogota?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
  };

  const CategoryIcon = (category: string) => CATEGORY_ICONS[category] || CATEGORY_ICONS.other;

  const totalResults = (results?.events?.length || 0) + (results?.places?.length || 0);

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, places..."
          className="w-full md:w-64 pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </form>

      {isOpen && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          {totalResults === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {results.events.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    Events
                  </div>
                  {results.events.map((event) => {
                    const Icon = CategoryIcon(event.category);
                    return (
                      <Link
                        key={event.id}
                        href={`/event/${event.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{event.title}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {event.city.name} • {event.venueName}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          {format(new Date(event.dateStart), 'd MMM', { locale: es })}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {results.places.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    Places
                  </div>
                  {results.places.map((place) => {
                    const Icon = CategoryIcon(place.category);
                    return (
                      <Link
                        key={place.id}
                        href={`/place/${place.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{place.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {place.city.name} • {place.address}
                          </p>
                        </div>
                        {place.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            {place.rating.toFixed(1)}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
