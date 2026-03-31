import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';

interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  lat: number;
  lng: number;
}

test.describe('GET /api/cities', () => {
  test('should return list of cities', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth<City[]>('GET', '/cities');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data!.length).toBeGreaterThan(0);
  });

  test('should return city with required fields', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth<City[]>('GET', '/cities');
    
    expect(response.success).toBe(true);
    const cities = response.data!;
    expect(cities.length).toBeGreaterThan(0);
    
    const firstCity = cities[0];
    expect(firstCity).toHaveProperty('id');
    expect(firstCity).toHaveProperty('name');
    expect(firstCity).toHaveProperty('slug');
    expect(firstCity).toHaveProperty('country');
    expect(firstCity).toHaveProperty('lat');
    expect(firstCity).toHaveProperty('lng');
  });
});

test.describe('GET /api/cities/:slug/events', () => {
  test('should return events for valid city', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.getEvents('bogota');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should filter events by category', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth('GET', '/cities/bogota/events?category=music');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should filter events by date', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth('GET', '/cities/bogota/events?date=today');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should return 404 for invalid city', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.getEvents('invalid-city');
    
    expect(response.success).toBe(false);
    expect(response.status).toBe(404);
  });
});

test.describe('GET /api/cities/:slug/places', () => {
  test('should return places for valid city', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.getPlaces('bogota');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should filter places by category', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth('GET', '/cities/bogota/places?category=restaurant');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  test('should return 404 for invalid city', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.getPlaces('invalid-city');
    
    expect(response.success).toBe(false);
    expect(response.status).toBe(404);
  });
});

test.describe('GET /api/cities/:slug/activities', () => {
  test('should return activities for valid city', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth('GET', '/cities/bogota/activities');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should filter activities by category', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth('GET', '/cities/bogota/activities?category=class');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });
});
