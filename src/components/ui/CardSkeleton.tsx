'use client';

import { CardSkeletonProps } from '@/types/components';

export function CardSkeleton({ count = 6, className = '' }: CardSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }, (_, i) => i + 1).map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl h-72 animate-pulse" />
      ))}
    </div>
  );
}
