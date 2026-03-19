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

export type EventStatus = 'draft' | 'pending' | 'published' | 'cancelled';

export type FeaturedTier = 'none' | 'basic' | 'premium';

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

export interface Review {
  id: string;
  userId: string;
  userName: string;
  placeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'organizer' | 'user';
  cityId?: string;
  isVerified: boolean;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterParams {
  cityId?: string;
  category?: EventCategory | 'all';
  date?: 'today' | 'week' | 'month' | 'all';
  price?: 'free' | 'paid' | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PlaceFilterParams {
  cityId?: string;
  category?: PlaceCategory | 'all';
  search?: string;
  page?: number;
  limit?: number;
}
