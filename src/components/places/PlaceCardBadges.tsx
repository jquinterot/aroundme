import { Place } from '@/types';
import { CATEGORY_ICONS, PLACE_CATEGORY_COLORS } from '@/lib/constants';
import { CheckCircle, Star } from 'lucide-react';

interface PlaceCategoryBadgeProps {
  place: Place;
}

export function PlaceCategoryBadge({ place }: PlaceCategoryBadgeProps) {
  const CategoryIcon = CATEGORY_ICONS[place.category] || CATEGORY_ICONS.other;
  const colorClass = PLACE_CATEGORY_COLORS[place.category] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
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
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
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
    <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-sm font-medium text-gray-700">
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
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="font-medium text-gray-900">{rating}</span>
      </div>
      <span className="text-gray-400 text-sm">({reviewCount})</span>
    </div>
  );
}
