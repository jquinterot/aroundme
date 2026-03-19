export const CATEGORY_ICONS: Record<string, string> = {
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

export const EVENT_CATEGORY_COLORS: Record<string, string> = {
  music: 'bg-purple-100 text-purple-700',
  food: 'bg-orange-100 text-orange-700',
  sports: 'bg-green-100 text-green-700',
  art: 'bg-pink-100 text-pink-700',
  tech: 'bg-blue-100 text-blue-700',
  community: 'bg-teal-100 text-teal-700',
  nightlife: 'bg-indigo-100 text-indigo-700',
  outdoor: 'bg-emerald-100 text-emerald-700',
  education: 'bg-amber-100 text-amber-700',
  other: 'bg-gray-100 text-gray-700',
};

export const PLACE_CATEGORY_COLORS: Record<string, string> = {
  restaurant: 'bg-orange-100 text-orange-700',
  cafe: 'bg-amber-100 text-amber-700',
  bar: 'bg-purple-100 text-purple-700',
  club: 'bg-pink-100 text-pink-700',
  park: 'bg-green-100 text-green-700',
  museum: 'bg-blue-100 text-blue-700',
  shopping: 'bg-rose-100 text-rose-700',
  hotel: 'bg-indigo-100 text-indigo-700',
  coworking: 'bg-cyan-100 text-cyan-700',
  other: 'bg-gray-100 text-gray-700',
};

export const EVENT_CATEGORIES = [
  { value: 'all', label: 'All', icon: '🎫' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'food', label: 'Food', icon: '🍔' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'art', label: 'Art', icon: '🎨' },
  { value: 'tech', label: 'Tech', icon: '💻' },
  { value: 'community', label: 'Community', icon: '👥' },
  { value: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌳' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'other', label: 'Other', icon: '📌' },
];

export const PLACE_CATEGORIES = [
  { value: 'all', label: 'All', icon: '🎫' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'cafe', label: 'Café', icon: '☕' },
  { value: 'bar', label: 'Bar', icon: '🍺' },
  { value: 'club', label: 'Club', icon: '🎉' },
  { value: 'park', label: 'Park', icon: '🌳' },
  { value: 'museum', label: 'Museum', icon: '🏛️' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'coworking', label: 'Coworking', icon: '💼' },
  { value: 'other', label: 'Other', icon: '📍' },
];

export const EVENT_CATEGORY_OPTIONS = EVENT_CATEGORIES.filter(c => c.value !== 'all');
export const PLACE_CATEGORY_OPTIONS = PLACE_CATEGORIES.filter(c => c.value !== 'all');
