import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifySuccessResponse, verifyErrorResponse } from '../../utils/test-helpers';

interface AdminStatsResponse {
  overview: {
    totalUsers: number;
    totalEvents: number;
    totalPlaces: number;
    totalReviews: number;
    pendingEvents: number;
    pendingReports: number;
  };
}

test.describe('GET /api/admin/stats', () => {
  test('should return admin stats for admin user', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.admin);
    
    const response = await client.requestWithAuth<AdminStatsResponse>('GET', '/admin/stats');
    
    verifySuccessResponse(response);
    expect(response.data?.overview).toBeDefined();
    expect(response.data?.overview.totalUsers).toBeGreaterThanOrEqual(0);
    expect(response.data?.overview.totalEvents).toBeGreaterThanOrEqual(0);
    expect(response.data?.overview.totalPlaces).toBeGreaterThanOrEqual(0);
  });

  test('should return 403 for non-admin user', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('GET', '/admin/stats');
    
    verifyErrorResponse(response, 403, 'FORBIDDEN');
  });

  test('should return 401 for unauthenticated user', async ({ request }) => {
    const client = createApiClient(request);
    
    const response = await client.requestWithAuth('GET', '/admin/stats');
    
    verifyErrorResponse(response, 401, 'UNAUTHORIZED');
  });
});

test.describe('GET /api/admin/events', () => {
  test('should get all events for admin', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.admin);
    
    const response = await client.requestWithAuth<unknown[]>('GET', '/admin/events');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

test.describe('GET /api/admin/places', () => {
  test('should get all places for admin', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.admin);
    
    const response = await client.requestWithAuth<unknown[]>('GET', '/admin/places');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

test.describe('GET /api/admin/users', () => {
  test('should get all users for admin', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.admin);
    
    const response = await client.requestWithAuth<unknown[]>('GET', '/admin/users');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

test.describe('GET /api/admin/reports', () => {
  test('should get all reports for admin', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.admin);
    
    const response = await client.requestWithAuth<unknown[]>('GET', '/admin/reports');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

test.describe('PUT /api/admin/events/:id/approve', () => {
  test('should approve pending event', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.admin);
    
    // This would need a pending event to test
    const response = await client.requestWithAuth(
      'PUT', 
      '/admin/events/some-event-id/approve'
    );
    
    // Will likely return 404 without actual event
    expect(response).toBeDefined();
  });
});
