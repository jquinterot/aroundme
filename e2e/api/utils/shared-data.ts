/**
 * Shared Test Data for API Tests
 * 
 * Reusable data that can be shared across multiple test suites
 * to improve test efficiency and maintainability.
 */

import { TestEvent, TestPlace, TestActivity, TestUser } from '../types';

/**
 * Shared test context for API tests
 */
export interface TestContext {
  userId?: string;
  eventId?: string;
  placeId?: string;
  activityId?: string;
  accessToken?: string;
}

/**
 * Reusable test data generators
 */
export function createMinimalEvent(overrides: Partial<TestEvent> = {}): TestEvent {
  return {
    citySlug: 'bogota',
    title: `Minimal Event ${Date.now()}`,
    description: 'This is a minimal test event description with at least 10 characters',
    category: 'other',
    venueName: 'Test Venue',
    venueAddress: '123 Test Street',
    startDate: '2024-12-31',
    startTime: '20:00',
    isFree: true,
    ...overrides,
  };
}

export function createMinimalPlace(overrides: Partial<TestPlace> = {}): TestPlace {
  return {
    citySlug: 'bogota',
    name: `Minimal Place ${Date.now()}`,
    description: 'This is a minimal test place description with at least 10 characters',
    category: 'restaurant',
    address: '123 Test Street',
    ...overrides,
  };
}

export function createMinimalActivity(overrides: Partial<TestActivity> = {}): TestActivity {
  return {
    title: `Minimal Activity ${Date.now()}`,
    description: 'This is a minimal test activity description',
    category: 'class',
    citySlug: 'bogota',
    providerName: 'Test Provider',
    schedule: 'Daily 10am',
    price: 50000,
    ...overrides,
  };
}

export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const timestamp = Date.now();
  return {
    email: `test${timestamp}@example.com`,
    password: 'TestPass123',
    name: 'Test User',
    ...overrides,
  };
}

/**
 * Cache for shared test resources
 */
class TestDataCache {
  private cache: Map<string, unknown> = new Map();

  set(key: string, value: unknown): void {
    this.cache.set(key, value);
  }

  get(key: string): unknown {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const testDataCache = new TestDataCache();

/**
 * Common test scenarios
 */
export const testScenarios = {
  completeEvent: (timestamp: number): TestEvent => ({
    citySlug: 'bogota',
    title: `Complete Event ${timestamp}`,
    description: 'This is a complete test event with all fields filled properly for comprehensive testing',
    category: 'music',
    venueName: 'Complete Venue',
    venueAddress: '123 Complete Street, Bogota',
    venueLat: 4.6243,
    venueLng: -74.0636,
    startDate: '2024-12-31',
    startTime: '20:00',
    endDate: '2024-12-31',
    endTime: '23:00',
    isFree: false,
    price: 50000,
    imageUrl: 'https://example.com/image.jpg',
    tags: 'music, live, concert, test',
  }),

  completePlace: (timestamp: number): TestPlace => ({
    citySlug: 'bogota',
    name: `Complete Place ${timestamp}`,
    description: 'This is a complete test place with all fields filled properly for comprehensive testing',
    category: 'restaurant',
    address: '123 Complete Street, Bogota',
    lat: 4.6243,
    lng: -74.0636,
    website: 'https://complete-restaurant.com',
    instagram: '@completerestaurant',
    imageUrl: 'https://example.com/place.jpg',
  }),

  completeActivity: (timestamp: number): TestActivity => ({
    title: `Complete Activity ${timestamp}`,
    description: 'This is a complete test activity with all fields filled properly for comprehensive testing',
    category: 'class',
    citySlug: 'bogota',
    providerName: 'Complete Provider',
    schedule: 'Every Tuesday 7pm',
    price: 75000,
    duration: '2 hours',
    capacity: 20,
  }),
};

/**
 * Shared validation test cases
 */
export const validationTestCases = {
  requiredFields: [
    { field: 'title', value: '', expectedError: 'required' },
    { field: 'description', value: '', expectedError: 'required' },
    { field: 'category', value: '', expectedError: 'required' },
    { field: 'citySlug', value: '', expectedError: 'required' },
  ],

  minLength: [
    { field: 'title', value: 'AB', minLength: 3 },
    { field: 'description', value: 'Short', minLength: 10 },
    { field: 'name', value: 'A', minLength: 2 },
  ],

  maxLength: [
    { field: 'title', maxLength: 200 },
    { field: 'description', maxLength: 5000 },
    { field: 'name', maxLength: 200 },
  ],

  invalidFormats: [
    { field: 'email', value: 'invalid-email', pattern: 'email' },
    { field: 'date', value: '31-12-2024', pattern: 'YYYY-MM-DD' },
    { field: 'time', value: '25:00', pattern: 'HH:MM' },
    { field: 'url', value: 'not-a-url', pattern: 'URL' },
  ],
};

/**
 * Test data for pagination tests
 */
export function generateTestDataForPagination<T>(
  count: number,
  generator: (index: number) => T
): T[] {
  return Array.from({ length: count }, (_, i) => generator(i));
}

/**
 * Shared assertion helpers - these use playwright expect
 */
export const sharedAssertions = {
  assertTimestamp: (timestamp: string): boolean => {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  },

  assertErrorId: (errorId: string): boolean => {
    return /^err_/.test(errorId) && errorId.length > 10;
  },

  assertId: (id: string): boolean => {
    return id !== undefined && id.length > 10 && typeof id === 'string';
  },
};
