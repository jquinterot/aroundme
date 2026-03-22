'use client';

import { ViewModeToggleProps } from '@/types/components';

export function ViewModeToggle({ viewMode, onViewModeChange, options }: ViewModeToggleProps) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onViewModeChange(option.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            viewMode === option.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
