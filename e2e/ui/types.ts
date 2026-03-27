/**
 * Test Data Types for UI E2E Tests
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'admin';
}

export interface TestEvent {
  title: string;
  description: string;
  category: string;
  citySlug: string;
  venueName: string;
  venueAddress: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  isFree: boolean;
  price?: number;
  imageUrl?: string;
  tags?: string;
}

export interface TestPlace {
  name: string;
  description: string;
  category: string;
  citySlug: string;
  address: string;
  website?: string;
  instagram?: string;
  imageUrl?: string;
}

export interface TestActivity {
  title: string;
  description: string;
  category: string;
  citySlug: string;
  providerName: string;
  schedule: string;
  price: number;
  duration?: string;
  imageUrl?: string;
}

export interface TestCity {
  slug: string;
  name: string;
  country: string;
}

export interface TestBooking {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  tickets: number;
  notes?: string;
}

export interface TestReview {
  rating: number;
  comment: string;
}

export interface TestFilter {
  category?: string;
  date?: string;
  price?: string;
  search?: string;
}

export interface TestCredentials {
  email: string;
  password: string;
}
