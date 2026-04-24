import { Place } from '@/types';
import { CATEGORY_ICONS } from '@/lib/constants';
import { CheckCircle, Star } from 'lucide-react';

interface PlaceCategoryBadgeProps {
  place: Place;
}

const PLACE_CATEGORY_COLORS_COMBINED: Record<string, string> = {
  restaurant: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  cafe: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  bar: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  club: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  park: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  museum: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  shopping: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  hotel: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  coworking: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export function PlaceCategoryBadge({ place }: PlaceCategoryBadgeProps) {
  const CategoryIcon = CATEGORY_ICONS[place.category] || CATEGORY_ICONS.other;
  const colorClass = PLACE_CATEGORY_COLORS_COMBINED[place.category] || PLACE_CATEGORY_COLORS_COMBINED.other;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`} data-testid="place-category-badge">
      <CategoryIcon size={12} />
      <span className="capitalize">{place.category}</span>
    </span>
  );
}

interface PlaceVerifiedBadgeProps {
  isVerified?: boolean;
}

export function PlaceVerifiedBadge({ isVerified }: PlaceVerifiedBadgeProps) {
  if (!isVerified) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white" data-testid="place-verified-badge">
      <CheckCircle className="w-3 h-3" />
      Verified
    </span>
  );
}

interface PlacePriceRangeProps {
  priceRange?: string;
}

export function PlacePriceRange({ priceRange }: PlacePriceRangeProps) {
  if (!priceRange) return null;

  return (
    <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-md text-sm font-medium text-gray-700 dark:text-gray-200" data-testid="place-price-range">
      {priceRange}
    </div>
  );
}

interface PlaceRatingProps {
  rating: number;
  reviewCount: number;
}

export function PlaceRating({ rating, reviewCount }: PlaceRatingProps) {
  return (
    <div className="flex items-center gap-2" data-testid="place-rating">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" data-testid="place-rating-star" />
        <span className="font-medium text-gray-900 dark:text-gray-100" data-testid="place-rating-value">{rating}</span>
      </div>
      <span className="text-gray-400 dark:text-gray-500 text-sm" data-testid="place-review-count">({reviewCount})</span>
    </div>
  );
}
