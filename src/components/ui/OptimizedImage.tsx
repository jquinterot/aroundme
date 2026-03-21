'use client';

import { useState } from 'react';
import Image from 'next/image';
import { OptimizedImageProps } from '@/types/components';
import { CATEGORY_ICONS } from '@/lib/constants';

export function OptimizedImage({
  src,
  alt,
  category,
  width = 800,
  height = 400,
  className = '',
  priority = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const PlaceholderIcon = category ? CATEGORY_ICONS[category] : CATEGORY_ICONS.other;

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 ${className}`}
        style={{ width, height }}
      >
        <PlaceholderIcon className="w-16 h-16 text-indigo-300" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <PlaceholderIcon className="w-12 h-12 text-gray-300" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
