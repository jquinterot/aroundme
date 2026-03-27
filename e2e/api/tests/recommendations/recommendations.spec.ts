import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifySuccessResponse } from '../../utils/test-helpers';

test.describe('GET /api/recommendations', () => {
  test('should get personalized recommendations', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('GET', '/recommendations');
    
    verifySuccessResponse(response);
    expect(response.data).toBeDefined();
  });

  test('should filter recommendations by type', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth(
      'GET', 
      '/recommendations?type=events'
    );
    
    verifySuccessResponse(response);
  });
});
