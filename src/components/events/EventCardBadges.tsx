import { Event } from '@/types';
import { CATEGORY_ICONS, EVENT_CATEGORY_COLORS } from '@/lib/constants';
import { Star, CheckCircle } from 'lucide-react';

interface FeaturedBadgeProps {
  event: Event;
}

export function FeaturedBadge({ event }: FeaturedBadgeProps) {
  if (!event.isFeatured) return null;

  return (
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1">
      <Star className="w-3 h-3 fill-current" />
      {event.featuredTier === 'premium' ? 'Premium' : 'Featured'}
    </div>
  );
}

interface CategoryBadgeProps {
  event: Event;
}

export function CategoryBadge({ event }: CategoryBadgeProps) {
  const CategoryIcon = CATEGORY_ICONS[event.category] || CATEGORY_ICONS.other;
  const colorClass = EVENT_CATEGORY_COLORS[event.category] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      <CategoryIcon size={12} />
      <span className="capitalize">{event.category}</span>
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
    <span className="inline-flex items-center gap-1 text-xs text-green-600">
      <CheckCircle className="w-3 h-3" />
      Verified
    </span>
  );
}
