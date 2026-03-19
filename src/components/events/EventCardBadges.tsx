import { Event } from '@/types';
import { CATEGORY_ICONS, EVENT_CATEGORY_COLORS } from '@/lib/constants';

interface FeaturedBadgeProps {
  event: Event;
}

export function FeaturedBadge({ event }: FeaturedBadgeProps) {
  if (!event.isFeatured) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {event.featuredTier === 'premium' ? 'Premium' : 'Featured'}
    </div>
  );
}

interface CategoryBadgeProps {
  event: Event;
}

export function CategoryBadge({ event }: CategoryBadgeProps) {
  const getCategoryIcon = (category: string) => CATEGORY_ICONS[category] || '📍';
  const getCategoryColor = (category: string) => EVENT_CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
      {getCategoryIcon(event.category)} {event.category}
    </span>
  );
}

interface FreeBadgeProps {
  isFree?: boolean;
}

export function FreeBadge({ isFree }: FreeBadgeProps) {
  if (!isFree) return null;

  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
      Free
    </span>
  );
}

interface PriceDisplayProps {
  event: Event;
  isFeatured?: boolean;
}

export function PriceDisplay({ event, isFeatured }: PriceDisplayProps) {
  const formatPrice = () => {
    if (event.price?.isFree) return 'Free';
    if (event.price) {
      return `${event.price.currency} ${event.price.min.toLocaleString()}`;
    }
    return 'Free';
  };

  return (
    <span className={`font-semibold ${isFeatured ? 'text-yellow-600' : 'text-indigo-600'}`}>
      {formatPrice()}
    </span>
  );
}

interface VerifiedBadgeProps {
  isVerified?: boolean;
}

export function VerifiedBadge({ isVerified }: VerifiedBadgeProps) {
  if (!isVerified) return null;

  return (
    <span className="flex items-center gap-1 text-xs text-green-600">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  );
}
