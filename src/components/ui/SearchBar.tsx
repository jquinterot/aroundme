'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star, Loader2, X } from 'lucide-react';
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
    <div ref={searchRef} className="relative w-full md:w-96 lg:w-[480px]" data-testid="search-bar">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" data-testid="search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, places..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          data-testid="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            data-testid="search-clear-button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </form>

      {isOpen && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden min-w-full">
          {totalResults === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {results.events.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Events
                  </div>
                  {results.events.map((event) => {
                    const Icon = CategoryIcon(event.category);
                    return (
                      <Link
                        key={event.id}
                        href={`/event/${event.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{event.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {event.city.name} • {event.venueName}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {format(new Date(event.dateStart), 'd MMM', { locale: es })}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {results.places.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Places
                  </div>
                  {results.places.map((place) => {
                    const Icon = CategoryIcon(place.category);
                    return (
                      <Link
                        key={place.id}
                        href={`/place/${place.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{place.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {place.city.name} • {place.address}
                          </p>
                        </div>
                        {place.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
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
