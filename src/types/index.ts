export * from './base';
export * from './interfaces';
export * from './components';
export * from './activities';

import type { UserTier, User, EventCategory, PlaceCategory } from './base';

export interface PremiumFeatures {
  advancedAnalytics: boolean;
  exportData: boolean;
  competitorInsights: boolean;
  emailAutomation: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  multiLocation: boolean;
  teamAccess: boolean;
}

export const TIER_FEATURES: Record<UserTier, PremiumFeatures> = {
  free: {
    advancedAnalytics: false,
    exportData: false,
    competitorInsights: false,
    emailAutomation: false,
    prioritySupport: false,
    customBranding: false,
    apiAccess: false,
    multiLocation: false,
    teamAccess: false,
  },
  basic: {
    advancedAnalytics: true,
    exportData: false,
    competitorInsights: false,
    emailAutomation: false,
    prioritySupport: false,
    customBranding: false,
    apiAccess: false,
    multiLocation: false,
    teamAccess: false,
  },
  premium: {
    advancedAnalytics: true,
    exportData: true,
    competitorInsights: true,
    emailAutomation: true,
    prioritySupport: true,
    customBranding: true,
    apiAccess: true,
    multiLocation: true,
    teamAccess: true,
  },
};

export const TIER_LIMITS: Record<UserTier, {
  maxEventsPerMonth: number;
  maxPlacesPerMonth: number;
  maxSavedEvents: number;
  analyticsRetentionDays: number;
  emailTemplatesPerMonth: number;
  teamMembers: number;
}> = {
  free: {
    maxEventsPerMonth: 3,
    maxPlacesPerMonth: 2,
    maxSavedEvents: 20,
    analyticsRetentionDays: 7,
    emailTemplatesPerMonth: 0,
    teamMembers: 1,
  },
  basic: {
    maxEventsPerMonth: 20,
    maxPlacesPerMonth: 10,
    maxSavedEvents: 100,
    analyticsRetentionDays: 30,
    emailTemplatesPerMonth: 5,
    teamMembers: 2,
  },
  premium: {
    maxEventsPerMonth: -1,
    maxPlacesPerMonth: -1,
    maxSavedEvents: -1,
    analyticsRetentionDays: 365,
    emailTemplatesPerMonth: -1,
    teamMembers: 10,
  },
};

export interface Review {
  id: string;
  userId: string;
  userName: string;
  placeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'created_event' | 'rsvp' | 'review' | 'follow' | 'save' | 'check_in';
  eventId?: string;
  placeId?: string;
  targetUserId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  event?: {
    id: string;
    title: string;
    imageUrl?: string;
    dateStart: string;
    venueName: string;
    city?: { name: string };
  };
}

export interface Recommendation {
  id: string;
  eventId: string;
  title: string;
  description: string;
  category: string;
  dateStart: string;
  venueName: string;
  venueAddress: string;
  imageUrl?: string;
  isFree: boolean;
  priceMin?: number;
  cityName: string;
  score: number;
  reason: string;
}

export interface WaitlistEntry {
  id: string;
  position: number;
  status: 'waiting' | 'notified' | 'converted' | 'expired';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CheckIn {
  id: string;
  checkedInAt: string;
  checkInMethod: 'qr_code' | 'manual' | 'api';
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  ticketType?: {
    name: string;
  };
}

export interface EventSeries {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  startDate: string;
  endDate?: string;
  events: {
    id: string;
    title: string;
    dateStart: string;
    status: string;
  }[];
  stats?: {
    total: number;
    upcoming: number;
    past: number;
    totalAttendees: number;
    totalCheckIns: number;
  };
}

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sold: number;
  maxPerUser: number;
  saleStart?: string;
  saleEnd?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  total: number;
  currency: string;
  email: string;
  name: string;
  items: {
    id: string;
    quantity: number;
    priceAtTime: number;
    ticketType: {
      name: string;
      event: {
        title: string;
        dateStart: string;
        venueName: string;
      };
    };
  }[];
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: User;
  following?: User;
}

export type NotificationType = 
  | 'event_reminder'
  | 'new_rsvp'
  | 'new_review'
  | 'event_update'
  | 'venue_update'
  | 'new_follower'
  | 'check_in_confirmed'
  | 'new_check_in'
  | 'waitlist_available'
  | 'ticket_purchase';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
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
  date?: 'today' | 'week' | 'month' | 'all' | string;
  price?: 'free' | 'paid' | 'all' | string;
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

export interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  city: { name: string; slug: string; lat: number; lng: number; zoom: number };
  providerName: string;
  providerContact: string | null;
  schedule: string;
  scheduleDays: string[] | null;
  scheduleTime: string | null;
  duration: string | null;
  capacity: number | null;
  price: number;
  currency: string;
  isFree: boolean;
  image: string | null;
  includes: string[];
  skillLevel: string | null;
  status: string;
  viewCount: number;
  bookingCount: number;
  commission: number;
  address: string | null;
  lat: number | null;
  lng: number | null;
}

export interface ListingExperience {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  image: string | null;
  address: string | null;
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
  schedule: string;
  duration: string | null;
  price: number;
  currency: string;
  isFree: boolean;
  providerName: string;
  bookingCount: number;
}

export interface ActivityBookingData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  tickets: number;
  notes: string;
}

export interface ActivityBookingResult {
  id: string;
  subtotal: number;
  commission: number;
  total: number;
  status: string;
}
