import { TestUser, TestEvent, TestPlace, TestActivity, TestBooking, TestReview } from '../types';

/**
 * Test Data Fixtures
 * 
 * Usage:
 * import { users, events, places, activities } from '../fixtures';
 * 
 * const testUser = users.valid;
 * const testEvent = events.music;
 */

export const users = {
  valid: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'user',
  } as TestUser,

  admin: {
    email: 'admin@example.com',
    password: 'adminpassword',
    name: 'Admin User',
    role: 'admin',
  } as TestUser,

  new: {
    email: `newuser${Date.now()}@example.com`,
    password: 'NewPass123',
    name: 'New Test User',
  } as TestUser,

  invalid: {
    email: 'invalid-email',
    password: '123',
    name: '',
  } as TestUser,
};

export const events = {
  music: {
    title: 'Live Music Concert',
    description: 'Join us for an amazing evening of live music with local artists performing various genres',
    category: 'music',
    citySlug: 'bogota',
    venueName: 'Music Hall',
    venueAddress: '123 Music Street, Bogota',
    startDate: '2024-12-31',
    startTime: '20:00',
    endDate: '2024-12-31',
    endTime: '23:00',
    isFree: true,
    tags: 'music, live, concert',
  } as TestEvent,

  food: {
    title: 'Food Festival',
    description: 'Experience the best of Colombian cuisine with food vendors from across the country',
    category: 'food',
    citySlug: 'bogota',
    venueName: 'Central Park',
    venueAddress: '456 Park Avenue, Bogota',
    startDate: '2024-12-25',
    startTime: '12:00',
    endDate: '2024-12-25',
    endTime: '20:00',
    isFree: false,
    price: 50000,
    tags: 'food, festival, cuisine',
  } as TestEvent,

  tech: {
    title: 'Tech Meetup',
    description: 'Monthly tech meetup for developers and tech enthusiasts to network and learn',
    category: 'tech',
    citySlug: 'bogota',
    venueName: 'Tech Hub Coworking',
    venueAddress: '789 Innovation Street, Bogota',
    startDate: '2024-12-20',
    startTime: '19:00',
    endDate: '2024-12-20',
    endTime: '21:00',
    isFree: true,
    tags: 'tech, meetup, networking',
  } as TestEvent,

  minimal: {
    title: 'Test Event',
    description: 'This is a test event description with enough length for validation',
    category: 'other',
    citySlug: 'bogota',
    venueName: 'Test Venue',
    venueAddress: '123 Test Street, Bogota',
    startDate: '2024-12-31',
    startTime: '20:00',
    isFree: true,
  } as TestEvent,
};

export const places = {
  restaurant: {
    name: 'Test Restaurant',
    description: 'A wonderful restaurant serving delicious Colombian cuisine with amazing atmosphere',
    category: 'restaurant',
    citySlug: 'bogota',
    address: '123 Restaurant Street, Bogota',
    website: 'https://testrestaurant.com',
    instagram: '@testrestaurant',
  } as TestPlace,

  cafe: {
    name: 'Coffee Corner',
    description: 'Cozy cafe with the best coffee in town and fresh pastries every morning',
    category: 'cafe',
    citySlug: 'bogota',
    address: '456 Coffee Lane, Bogota',
    website: 'https://coffeecorner.com',
    instagram: '@coffeecorner',
  } as TestPlace,

  bar: {
    name: 'Night Bar',
    description: 'Trendy bar with craft cocktails and live music on weekends',
    category: 'bar',
    citySlug: 'bogota',
    address: '789 Night Street, Bogota',
    website: 'https://nightbar.com',
    instagram: '@nightbar',
  } as TestPlace,
};

export const activities = {
  dance: {
    title: 'Salsa Dance Class',
    description: 'Learn salsa dancing with professional instructors in a fun group setting',
    category: 'class',
    citySlug: 'bogota',
    providerName: 'Dance Academy',
    schedule: 'Every Tuesday 7pm',
    price: 50000,
    duration: '2 hours',
  } as TestActivity,

  tour: {
    title: 'City Walking Tour',
    description: 'Explore the historic center with knowledgeable guides',
    category: 'tour',
    citySlug: 'bogota',
    providerName: 'Tour Guide Co',
    schedule: 'Daily at 10am',
    price: 30000,
    duration: '3 hours',
  } as TestActivity,

  yoga: {
    title: 'Yoga Session',
    description: 'Relaxing yoga session for all levels in beautiful outdoor setting',
    category: 'wellness',
    citySlug: 'bogota',
    providerName: 'Yoga Studio',
    schedule: 'Weekends 8am',
    price: 25000,
    duration: '1.5 hours',
  } as TestActivity,
};

export const bookings = {
  valid: {
    guestName: 'Test User',
    guestEmail: 'test@example.com',
    guestPhone: '+1234567890',
    tickets: 2,
    notes: 'Looking forward to this!',
  } as TestBooking,

  minimal: {
    guestName: 'Test User',
    guestEmail: 'test@example.com',
    tickets: 1,
  } as TestBooking,
};

export const reviews = {
  excellent: {
    rating: 5,
    comment: 'Absolutely amazing experience! Highly recommend.',
  } as TestReview,

  good: {
    rating: 4,
    comment: 'Great place, will visit again.',
  } as TestReview,

  average: {
    rating: 3,
    comment: 'It was okay, nothing special.',
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
};

export const filters = {
  today: { date: 'today' },
  week: { date: 'week' },
  month: { date: 'month' },
  free: { price: 'free' },
  paid: { price: 'paid' },
  music: { category: 'music' },
  food: { category: 'food' },
  restaurant: { category: 'restaurant' },
  cafe: { category: 'cafe' },
  classes: { category: 'class' },
  tours: { category: 'tour' },
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
