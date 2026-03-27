import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';

test.describe('API: Events - Create', () => {
  test('should create event with valid data', async ({ request }) => {
    const api = createApiClient(request);
    
    const eventData = {
      citySlug: 'bogota',
      title: 'API Test Event ' + Date.now(),
      description: 'This is a valid test event description with at least 10 characters',
      category: 'music',
      venueName: 'Test Venue',
      venueAddress: '123 Test Street, Bogota',
      startDate: '2024-12-31',
      startTime: '20:00',
      isFree: true,
    };

    const response = await api.createEvent(eventData);
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBeDefined();
    expect(response.data?.title).toBe(eventData.title);
  });

  test('should return 400 when title is missing', async ({ request }) => {
    const api = createApiClient(request);
    
    const eventData = {
      citySlug: 'bogota',
      description: 'This is a test event description',
      category: 'music',
      venueName: 'Test Venue',
      venueAddress: '123 Test Street',
      startDate: '2024-12-31',
      startTime: '20:00',
      isFree: true,
    };

    const response = await api.createEvent(eventData);
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
    expect(response.error).toContain('title');
    expect(response.errorId).toBeDefined();
    expect(response.timestamp).toBeDefined();
  });
});
