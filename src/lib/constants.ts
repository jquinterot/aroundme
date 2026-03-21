import { 
  Music,
  UtensilsCrossed,
  Trophy,
  Palette,
  Laptop,
  Users,
  Moon,
  TreePine,
  GraduationCap,
  Coffee,
  Wine,
  PartyPopper,
  Landmark,
  ShoppingBag,
  Bed,
  Briefcase,
  MapPin,
  Ticket,
  LucideIcon
} from 'lucide-react';

export const CATEGORY_ICON_NAMES: Record<string, string> = {
  music: 'Music',
  food: 'UtensilsCrossed',
  sports: 'Trophy',
  art: 'Palette',
  tech: 'Laptop',
  community: 'Users',
  nightlife: 'Moon',
  outdoor: 'TreePine',
  education: 'GraduationCap',
  restaurant: 'UtensilsCrossed',
  cafe: 'Coffee',
  bar: 'Wine',
  club: 'PartyPopper',
  park: 'TreePine',
  museum: 'Landmark',
  shopping: 'ShoppingBag',
  hotel: 'Bed',
  coworking: 'Briefcase',
  other: 'MapPin',
  all: 'Ticket',
};

export const EVENT_CATEGORIES = [
  { value: 'all', label: 'All', icon: 'Ticket' },
  { value: 'music', label: 'Music', icon: 'Music' },
  { value: 'food', label: 'Food', icon: 'UtensilsCrossed' },
  { value: 'sports', label: 'Sports', icon: 'Trophy' },
  { value: 'art', label: 'Art', icon: 'Palette' },
  { value: 'tech', label: 'Tech', icon: 'Laptop' },
  { value: 'community', label: 'Community', icon: 'Users' },
  { value: 'nightlife', label: 'Nightlife', icon: 'Moon' },
  { value: 'outdoor', label: 'Outdoor', icon: 'TreePine' },
  { value: 'education', label: 'Education', icon: 'GraduationCap' },
  { value: 'other', label: 'Other', icon: 'MapPin' },
];

export const PLACE_CATEGORIES = [
  { value: 'all', label: 'All', icon: 'Ticket' },
  { value: 'restaurant', label: 'Restaurant', icon: 'UtensilsCrossed' },
  { value: 'cafe', label: 'Café', icon: 'Coffee' },
  { value: 'bar', label: 'Bar', icon: 'Wine' },
  { value: 'club', label: 'Club', icon: 'PartyPopper' },
  { value: 'park', label: 'Park', icon: 'TreePine' },
  { value: 'museum', label: 'Museum', icon: 'Landmark' },
  { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
  { value: 'hotel', label: 'Hotel', icon: 'Bed' },
  { value: 'coworking', label: 'Coworking', icon: 'Briefcase' },
  { value: 'other', label: 'Other', icon: 'MapPin' },
];

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  music: Music,
  food: UtensilsCrossed,
  sports: Trophy,
  art: Palette,
  tech: Laptop,
  community: Users,
  nightlife: Moon,
  outdoor: TreePine,
  education: GraduationCap,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  bar: Wine,
  club: PartyPopper,
  park: TreePine,
  museum: Landmark,
  shopping: ShoppingBag,
  hotel: Bed,
  coworking: Briefcase,
  other: MapPin,
  all: Ticket,
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

export const EVENT_CATEGORY_OPTIONS = EVENT_CATEGORIES.filter(c => c.value !== 'all');
export const PLACE_CATEGORY_OPTIONS = PLACE_CATEGORIES.filter(c => c.value !== 'all');
