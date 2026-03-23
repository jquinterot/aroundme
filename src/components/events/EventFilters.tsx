'use client';

import { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { EventFiltersProps, EventFilterState } from '@/types/components';
import { EVENT_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFilterState>({
    category: 'all',
    date: 'all',
    price: 'all',
    search: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const handleFilterChange = (key: keyof EventFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAdvancedApply = () => {
    let dateFilter = filters.date;
    if (dateFrom && dateTo) {
      dateFilter = `${dateFrom},${dateTo}`;
      handleFilterChange('date', dateFilter);
    }
    setShowAdvanced(false);
  };

  const handleAdvancedClear = () => {
    setDateFrom('');
    setDateTo('');
    setPriceMin('');
    setPriceMax('');
    handleFilterChange('date', 'all');
    handleFilterChange('price', 'all');
    setShowAdvanced(false);
  };

  const clearDateRange = () => {
    setDateFrom('');
    setDateTo('');
    handleFilterChange('date', 'all');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {EVENT_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.value] || CATEGORY_ICONS.other;
          return (
            <button
              key={cat.value}
              onClick={() => handleFilterChange('category', cat.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.category === cat.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-3 text-sm">
          <select
            value={filters.date.includes(',') ? 'range' : filters.date}
            onChange={(e) => {
              if (e.target.value === 'range') {
                setShowAdvanced(true);
              } else {
                handleFilterChange('date', e.target.value);
              }
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            <option value="all">Any Date</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="range">Date Range...</option>
          </select>

          <select
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
          >
            <option value="all">Any Price</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="range">Price Range...</option>
          </select>
        </div>

        {(filters.category !== 'all' || filters.date !== 'all' || filters.price !== 'all' || filters.search) && (
          <button
            onClick={() => {
              handleFilterChange('category', 'all');
              handleFilterChange('date', 'all');
              handleFilterChange('price', 'all');
              handleFilterChange('search', '');
            }}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Advanced Filters</h3>
            <button
              onClick={() => setShowAdvanced(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  min={dateFrom}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              {filters.date.includes(',') && (
                <button
                  onClick={clearDateRange}
                  className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  Clear date range
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range (COP)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdvancedClear}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear All
            </button>
            <button
              onClick={handleAdvancedApply}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
