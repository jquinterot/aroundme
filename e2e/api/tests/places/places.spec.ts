import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';

test.describe('POST /api/places', () => {
  const validPlaceData = {
    citySlug: 'bogota',
    name: 'Test Place',
    description: 'This is a valid test place description with at least 10 characters',
    category: 'restaurant',
    address: '123 Test Street, Bogota',
  };

  test('should create place with valid data', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    const response = await api.createPlace({
      ...validPlaceData,
      name: `Test Place ${timestamp}`,
    });
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBeDefined();
    expect(response.status).toBe(200);
  });

  test('should require name field', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createPlace({
      ...validPlaceData,
      name: '',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
  });

  test('should require minimum name length', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createPlace({
      ...validPlaceData,
      name: 'A',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
  });

  test('should require description minimum length', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createPlace({
      ...validPlaceData,
      description: 'Short',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
  });

  test('should validate category', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createPlace({
      ...validPlaceData,
      category: 'invalid-category',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
  });

  test('should return 404 for non-existent city', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createPlace({
      ...validPlaceData,
      citySlug: 'nonexistent-city',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('CITY_NOT_FOUND');
    expect(response.status).toBe(404);
  });
});

test.describe('GET /api/places/:id', () => {
  test('should return place by id', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    // Create place first
    const createResponse = await api.createPlace({
      citySlug: 'bogota',
      name: `Get Place ${timestamp}`,
      description: 'Test description for place retrieval',
      category: 'restaurant',
      address: '123 Test Street',
    });
    
    const placeId = createResponse.data?.id;
    expect(placeId).toBeDefined();
    
    // Get place
    const response = await api.getPlace(placeId!);
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBe(placeId);
  });

  test('should return 404 for non-existent place', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.getPlace('non-existent-place-id');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('NOT_FOUND');
    expect(response.status).toBe(404);
  });
});
