'use client';

import { useState } from 'react';
import { PlaceCategory } from '@/types';
import { PLACE_CATEGORIES } from '@/lib/constants';

interface PlaceFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  category: PlaceCategory | 'all';
  search: string;
}

export function PlaceFilters({ onFilterChange }: PlaceFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    search: '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search places..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PLACE_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleFilterChange('category', cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filters.category === cat.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
