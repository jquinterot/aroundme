'use client';

import { CardSkeleton } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-white border-b border-gray-200 animate-pulse" />
      <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CardSkeleton />
      </div>
    </div>
  );
}
