'use client';

import { useState } from 'react';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  category?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const categoryPlaceholders: Record<string, string> = {
  music: '🎵',
  food: '🍔',
  sports: '⚽',
  art: '🎨',
  tech: '💻',
  community: '👥',
  nightlife: '🌙',
  outdoor: '🌳',
  education: '📚',
  restaurant: '🍽️',
  cafe: '☕',
  bar: '🍺',
  club: '🎉',
  park: '🌳',
  museum: '🏛️',
  shopping: '🛍️',
  hotel: '🏨',
  coworking: '💼',
  other: '📍',
};

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

  const placeholderIcon = category ? categoryPlaceholders[category] : '📍';

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 ${className}`}
        style={{ width, height }}
      >
        <span className="text-6xl">{placeholderIcon}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-4xl opacity-50">{placeholderIcon}</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
