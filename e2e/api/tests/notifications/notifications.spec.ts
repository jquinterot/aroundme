import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifySuccessResponse } from '../../utils/test-helpers';

test.describe('GET /api/notifications', () => {
  test('should get user notifications', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('GET', '/notifications');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

test.describe('PUT /api/notifications/:id/read', () => {
  test('should mark notification as read', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // Get notifications first
    const notifResponse = await client.requestWithAuth('GET', '/notifications');
    
    if (notifResponse.data?.length > 0) {
      const notificationId = notifResponse.data[0].id;
      
      const response = await client.requestWithAuth(
        'PUT', 
        `/notifications/${notificationId}/read`
      );
      
      verifySuccessResponse(response);
    }
  });
});

test.describe('DELETE /api/notifications/:id', () => {
  test('should delete notification', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // Get notifications first
    const notifResponse = await client.requestWithAuth('GET', '/notifications');
    
    if (notifResponse.data?.length > 0) {
      const notificationId = notifResponse.data[0].id;
      
      const response = await client.requestWithAuth(
        'DELETE', 
        `/notifications/${notificationId}`
      );
      
      verifySuccessResponse(response);
    }
  });
});
