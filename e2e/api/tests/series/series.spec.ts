import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifySuccessResponse } from '../../utils/test-helpers';

test.describe('POST /api/series', () => {
  test('should create event series', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('POST', '/series', {
      name: 'Weekly Meetup Series',
      description: 'Recurring weekly meetup',
      frequency: 'weekly',
      startDate: '2024-12-01',
      occurrences: 4,
    });
    
    verifySuccessResponse(response);
  });
});

test.describe('GET /api/series', () => {
  test('should get user series', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('GET', '/series');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
