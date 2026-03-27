/**
 * API Test Data Types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  status?: number;
  data?: T;
  error?: string;
  code?: string;
  errorId?: string;
  timestamp?: string;
}

export interface TestUser {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'admin';
}

export interface TestEvent {
  citySlug: string;
  title: string;
  description: string;
  category: string;
  venueName: string;
  venueAddress: string;
  venueLat?: number;
  venueLng?: number;
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
  citySlug: string;
  name: string;
  description: string;
  category: string;
  address: string;
  lat?: number;
  lng?: number;
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
  capacity?: number;
}

export interface TestRSVP {
  status: 'going' | 'interested' | 'maybe';
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

export interface ApiError {
  field: string;
  message: string;
  code: string;
}
