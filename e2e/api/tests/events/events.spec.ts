import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';

test.describe('POST /api/events', () => {
  const validEventData = {
    citySlug: 'bogota',
    title: 'API Test Event',
    description: 'This is a valid test event description with at least 10 characters',
    category: 'music',
    venueName: 'Test Venue',
    venueAddress: '123 Test Street, Bogota',
    startDate: '2024-12-31',
    startTime: '20:00',
    isFree: true,
  };

  test('should create event with valid data', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    const response = await api.createEvent({
      ...validEventData,
      title: `Test Event ${timestamp}`,
    });
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBeDefined();
    expect(response.status).toBe(200);
  });

  test('should require title field', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createEvent({
      ...validEventData,
      title: '',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
    expect(response.status).toBe(400);
  });

  test('should require minimum title length', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createEvent({
      ...validEventData,
      title: 'AB',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
    expect(response.error).toContain('at least 3');
  });

  test('should require description minimum length', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createEvent({
      ...validEventData,
      description: 'Short',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
  });

  test('should validate date format', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createEvent({
      ...validEventData,
      startDate: '31-12-2024',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
  });

  test('should validate end date is after start date', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createEvent({
      ...validEventData,
      endDate: '2024-12-30',
      endTime: '22:00',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('INVALID_DATE_RANGE');
  });

  test('should return 404 for non-existent city', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createEvent({
      ...validEventData,
      citySlug: 'nonexistent-city',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('CITY_NOT_FOUND');
    expect(response.status).toBe(404);
  });

  test('should validate price for non-free events', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.createEvent({
      ...validEventData,
      isFree: false,
      price: -100,
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
  });
});

test.describe('GET /api/events/:id', () => {
  test('should return event by id', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    const createResponse = await api.createEvent({
      citySlug: 'bogota',
      title: `Get Test ${timestamp}`,
      description: 'Test description for event retrieval',
      category: 'music',
      venueName: 'Test Venue',
      venueAddress: '123 Test Street',
      startDate: '2024-12-31',
      startTime: '20:00',
      isFree: true,
    });
    
    const eventId = createResponse.data?.id;
    expect(eventId).toBeDefined();
    
    const response = await api.getEvent(eventId!);
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBe(eventId);
    expect(response.data?.title).toBe(`Get Test ${timestamp}`);
  });

  test('should return 404 for non-existent event', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.getEvent('non-existent-event-id');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('NOT_FOUND');
    expect(response.status).toBe(404);
  });
});
