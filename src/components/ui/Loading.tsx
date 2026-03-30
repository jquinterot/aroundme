'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center" data-testid="loading">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" data-testid="loading-spinner" />
        <p className="text-gray-500 dark:text-gray-400" data-testid="loading-message">{message}</p>
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center" data-testid="page-loading">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" data-testid="page-loading-spinner" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-4" data-testid="card-skeleton">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" data-testid="skeleton-image" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" data-testid="skeleton-title" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" data-testid="skeleton-text" />
    </div>
  );
}
