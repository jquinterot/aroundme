export type EventCategory = 
  | 'music'
  | 'food'
  | 'sports'
  | 'art'
  | 'tech'
  | 'community'
  | 'nightlife'
  | 'outdoor'
  | 'education'
  | 'other';

export type PlaceCategory = 
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'club'
  | 'park'
  | 'museum'
  | 'shopping'
  | 'hotel'
  | 'coworking'
  | 'other';

export type EventStatus = 'draft' | 'pending' | 'published' | 'cancelled';

export type FeaturedTier = 'none' | 'basic' | 'premium';

export type UserTier = 'free' | 'basic' | 'premium';

export interface City {
  id: string;
  name: string;
  country: string;
  slug: string;
  lat: number;
  lng: number;
  zoom: number;
  timezone: string;
  isActive: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  cityId: string;
  venue: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  date: {
    start: string;
    end: string;
  };
  price?: {
    min: number;
    max: number;
    currency: string;
    isFree: boolean;
  };
  image?: string;
  organizer: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  tags: string[];
  isFeatured: boolean;
  featuredUntil?: string;
  featuredTier: FeaturedTier;
  maxAttendees?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  cityId: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  rating: number;
  reviewCount: number;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  isVerified: boolean;
  isClaimed: boolean;
  ownerId?: string;
  hours?: {
    [key: string]: { open: string; close: string } | null;
  };
  contact?: {
    phone?: string;
    website?: string;
    instagram?: string;
  };
  features?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'organizer' | 'user';
  cityId?: string;
  isVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  instagram?: string;
  followerCount?: number;
  followingCount?: number;
  eventCount?: number;
  createdAt?: string;
  tier?: UserTier;
}
