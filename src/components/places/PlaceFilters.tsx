'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { PlaceFiltersProps, PlaceFilterState } from '@/types/components';
import { PLACE_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';

export function PlaceFilters({ onFilterChange }: PlaceFiltersProps) {
  const [filters, setFilters] = useState<PlaceFilterState>({
    category: 'all',
    search: '',
  });

  const handleFilterChange = (key: keyof PlaceFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search places..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PLACE_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.value] || CATEGORY_ICONS.other;
          return (
            <button
              key={cat.value}
              onClick={() => handleFilterChange('category', cat.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.category === cat.value
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
