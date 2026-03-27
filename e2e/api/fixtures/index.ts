import { TestUser, TestEvent, TestPlace, TestActivity, TestBooking, TestRSVP, TestReview } from '../types';

/**
 * API Test Data Fixtures
 * 
 * Centralized test data for API tests
 * All data follows validation rules from src/lib/validation.ts
 */

export const users = {
  valid: {
    email: 'test@example.com',
    password: 'TestPass123!',
    name: 'Test User',
    role: 'user',
  } as TestUser,

  admin: {
    email: 'admin@example.com',
    password: 'AdminPass123!',
    name: 'Admin User',
    role: 'admin',
  } as TestUser,

  new: {
    email: `newuser${Date.now()}@example.com`,
    password: 'NewPass123!',
    name: 'New Test User',
  } as TestUser,

  invalid: {
    email: 'invalid-email',
    password: '123',
    name: '',
  } as TestUser,

  duplicate: {
    email: 'duplicate@example.com',
    password: 'TestPass123!',
    name: 'Duplicate User',
  } as TestUser,
};

export const events = {
  music: {
    citySlug: 'bogota',
    title: 'Live Music Concert',
    description: 'Join us for an amazing evening of live music with local artists performing various genres from classical to contemporary',
    category: 'music',
    venueName: 'Music Hall',
    venueAddress: '123 Music Street, Bogota',
    venueLat: 4.6243,
    venueLng: -74.0636,
    startDate: '2024-12-31',
    startTime: '20:00',
    endDate: '2024-12-31',
    endTime: '23:00',
    isFree: true,
    tags: 'music, live, concert',
  } as TestEvent,

  food: {
    citySlug: 'bogota',
    title: 'Food Festival',
    description: 'Experience the best of Colombian cuisine with food vendors from across the country showcasing traditional and modern dishes',
    category: 'food',
    venueName: 'Central Park',
    venueAddress: '456 Park Avenue, Bogota',
    venueLat: 4.6243,
    venueLng: -74.0636,
    startDate: '2024-12-25',
    startTime: '12:00',
    endDate: '2024-12-25',
    endTime: '20:00',
    isFree: false,
    price: 50000,
    tags: 'food, festival, cuisine',
  } as TestEvent,

  tech: {
    citySlug: 'bogota',
    title: 'Tech Meetup',
    description: 'Monthly tech meetup for developers and tech enthusiasts to network and learn about latest technologies',
    category: 'tech',
    venueName: 'Tech Hub Coworking',
    venueAddress: '789 Innovation Street, Bogota',
    venueLat: 4.6243,
    venueLng: -74.0636,
    startDate: '2024-12-20',
    startTime: '19:00',
    endDate: '2024-12-20',
    endTime: '21:00',
    isFree: true,
    tags: 'tech, meetup, networking',
  } as TestEvent,

  minimal: {
    citySlug: 'bogota',
    title: 'Test Event',
    description: 'This is a test event description with enough length for validation requirements',
    category: 'other',
    venueName: 'Test Venue',
    venueAddress: '123 Test Street, Bogota',
    startDate: '2024-12-31',
    startTime: '20:00',
    isFree: true,
  } as TestEvent,

  invalid: {
    citySlug: '',
    title: '',
    description: '',
    category: 'invalid',
    venueName: '',
    venueAddress: '',
    startDate: 'invalid-date',
    startTime: 'invalid-time',
    isFree: true,
  } as TestEvent,

  pastDate: {
    citySlug: 'bogota',
    title: 'Past Event',
    description: 'This event has a date in the past',
    category: 'music',
    venueName: 'Past Venue',
    venueAddress: '123 Past Street',
    startDate: '2020-01-01',
    startTime: '20:00',
    isFree: true,
  } as TestEvent,
};

export const places = {
  restaurant: {
    citySlug: 'bogota',
    name: 'Test Restaurant',
    description: 'A wonderful restaurant serving delicious Colombian cuisine with amazing atmosphere and service',
    category: 'restaurant',
    address: '123 Restaurant Street, Bogota',
    lat: 4.6243,
    lng: -74.0636,
    website: 'https://testrestaurant.com',
    instagram: '@testrestaurant',
  } as TestPlace,

  cafe: {
    citySlug: 'bogota',
    name: 'Coffee Corner',
    description: 'Cozy cafe with the best coffee in town and fresh pastries every morning',
    category: 'cafe',
    address: '456 Coffee Lane, Bogota',
    lat: 4.6243,
    lng: -74.0636,
    website: 'https://coffeecorner.com',
    instagram: '@coffeecorner',
  } as TestPlace,

  bar: {
    citySlug: 'bogota',
    name: 'Night Bar',
    description: 'Trendy bar with craft cocktails and live music on weekends',
    category: 'bar',
    address: '789 Night Street, Bogota',
    lat: 4.6243,
    lng: -74.0636,
    website: 'https://nightbar.com',
    instagram: '@nightbar',
  } as TestPlace,

  minimal: {
    citySlug: 'bogota',
    name: 'Test Place',
    description: 'This is a test place description with enough length for validation',
    category: 'restaurant',
    address: '123 Test Street, Bogota',
  } as TestPlace,

  invalid: {
    citySlug: '',
    name: '',
    description: '',
    category: 'invalid',
    address: '',
  } as TestPlace,
};

export const activities = {
  dance: {
    title: 'Salsa Dance Class',
    description: 'Learn salsa dancing with professional instructors in a fun group setting for all levels',
    category: 'class',
    citySlug: 'bogota',
    providerName: 'Dance Academy',
    providerContact: 'dance@example.com',
    schedule: 'Every Tuesday 7pm',
    price: 50000,
    duration: '2 hours',
    capacity: 20,
  } as TestActivity,

  tour: {
    title: 'City Walking Tour',
    description: 'Explore the historic center with knowledgeable guides who share fascinating stories',
    category: 'tour',
    citySlug: 'bogota',
    providerName: 'Tour Guide Co',
    providerContact: 'tours@example.com',
    schedule: 'Daily at 10am',
    price: 30000,
    duration: '3 hours',
    capacity: 15,
  } as TestActivity,

  yoga: {
    title: 'Yoga Session',
    description: 'Relaxing yoga session for all levels in beautiful outdoor setting',
    category: 'wellness',
    citySlug: 'bogota',
    providerName: 'Yoga Studio',
    providerContact: 'yoga@example.com',
    schedule: 'Weekends 8am',
    price: 25000,
    duration: '1.5 hours',
    capacity: 10,
  } as TestActivity,
};

export const rsvps = {
  going: {
    status: 'going',
  } as TestRSVP,

  interested: {
    status: 'interested',
  } as TestRSVP,

  maybe: {
    status: 'maybe',
  } as TestRSVP,

  invalid: {
    status: 'invalid-status',
  },
};

export const bookings = {
  valid: {
    guestName: 'Test User',
    guestEmail: 'test@example.com',
    guestPhone: '+1234567890',
    tickets: 2,
    notes: 'Looking forward to this activity!',
  } as TestBooking,

  minimal: {
    guestName: 'Test User',
    guestEmail: 'test@example.com',
    tickets: 1,
  } as TestBooking,

  invalid: {
    guestName: '',
    guestEmail: 'invalid-email',
    guestPhone: 'invalid-phone',
    tickets: 0,
  } as TestBooking,
};

export const reviews = {
  excellent: {
    rating: 5,
    comment: 'Absolutely amazing experience! Highly recommend to everyone.',
  } as TestReview,

  good: {
    rating: 4,
    comment: 'Great place, will definitely visit again.',
  } as TestReview,

  average: {
    rating: 3,
    comment: 'It was okay, nothing special.',
  } as TestReview,

  minimal: {
    rating: 5,
    comment: 'Great!',
  } as TestReview,
};

export const cities = {
  bogota: {
    slug: 'bogota',
    name: 'Bogotá',
    country: 'Colombia',
  },
  medellin: {
    slug: 'medellin',
    name: 'Medellín',
    country: 'Colombia',
  },
  cali: {
    slug: 'cali',
    name: 'Cali',
    country: 'Colombia',
  },
  invalid: {
    slug: 'invalid-city',
    name: 'Invalid',
    country: 'Nowhere',
  },
};

export const errorCodes = {
  validation: 'VALIDATION_ERROR',
  notFound: 'NOT_FOUND',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  cityNotFound: 'CITY_NOT_FOUND',
  invalidDate: 'INVALID_DATE',
  invalidPrice: 'INVALID_PRICE',
  emailExists: 'EMAIL_EXISTS',
  invalidEmail: 'INVALID_EMAIL',
  weakPassword: 'WEAK_PASSWORD',
  userNotFound: 'USER_NOT_FOUND',
  invalidPassword: 'INVALID_PASSWORD',
  missingCredentials: 'MISSING_CREDENTIALS',
  network: 'NETWORK_ERROR',
  unknown: 'UNKNOWN_ERROR',
};

export const httpStatus = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  serverError: 500,
};

/**
 * Generate unique test data with timestamp
 */
export function generateUniqueEvent(baseEvent: TestEvent): TestEvent {
  const timestamp = Date.now();
  return {
    ...baseEvent,
    title: `${baseEvent.title} ${timestamp}`,
  };
}

export function generateUniqueUser(baseUser: TestUser): TestUser {
  const timestamp = Date.now();
  return {
    ...baseUser,
    email: `test${timestamp}@example.com`,
  };
}

export function generateUniquePlace(basePlace: TestPlace): TestPlace {
  const timestamp = Date.now();
  return {
    ...basePlace,
    name: `${basePlace.name} ${timestamp}`,
  };
}

/**
 * Generate test data for pagination tests
 */
export function generateMultipleEvents(count: number): TestEvent[] {
  return Array.from({ length: count }, (_, i) => ({
    ...events.minimal,
    title: `Test Event ${Date.now()}-${i}`,
  }));
}

/**
 * Validation helpers
 */
export const validators = {
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidDate: (date: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
  },

  isValidTime: (time: string): boolean => {
    return /^\d{2}:\d{2}$/.test(time);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidCategory: (category: string, type: 'event' | 'place' | 'activity'): boolean => {
    const categories = {
      event: ['music', 'food', 'sports', 'art', 'tech', 'community', 'nightlife', 'outdoor', 'education', 'other'],
      place: ['restaurant', 'cafe', 'bar', 'club', 'park', 'museum', 'shopping', 'hotel', 'coworking', 'other'],
      activity: ['class', 'tour', 'entertainment', 'experience', 'wellness'],
    };
    return categories[type].includes(category);
  },
};
