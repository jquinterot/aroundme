'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}
