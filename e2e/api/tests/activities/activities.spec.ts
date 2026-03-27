import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifySuccessResponse } from '../../utils/test-helpers';

test.describe('GET /api/cities/:slug/activities', () => {
  test('should get activities for city', async ({ request }) => {
    const client = createApiClient(request);
    
    const response = await client.requestWithAuth('GET', '/cities/bogota/activities');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should filter activities by category', async ({ request }) => {
    const client = createApiClient(request);
    
    const response = await client.requestWithAuth(
      'GET', 
      '/cities/bogota/activities?category=class'
    );
    
    verifySuccessResponse(response);
  });
});

test.describe('GET /api/activities/:id', () => {
  test('should get activity by id', async ({ request }) => {
    const client = createApiClient(request);
    
    const listResponse = await client.requestWithAuth('GET', '/cities/bogota/activities');
    
    if (Array.isArray(listResponse.data) && listResponse.data.length > 0) {
      const activityId = (listResponse.data[0] as { id: string }).id;
      
      const response = await client.requestWithAuth('GET', `/activities/${activityId}`);
      
      verifySuccessResponse(response);
    }
  });
});

test.describe('POST /api/activities/:id/booking', () => {
  test('should book activity', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const listResponse = await client.requestWithAuth('GET', '/cities/bogota/activities');
    
    if (Array.isArray(listResponse.data) && listResponse.data.length > 0) {
      const activityId = (listResponse.data[0] as { id: string }).id;
      
      const response = await client.requestWithAuth(
        'POST', 
        `/activities/${activityId}/booking`,
        { guestName: 'Test User', guestEmail: 'test@example.com', tickets: 1 }
      );
      
      verifySuccessResponse(response);
    }
  });
});
