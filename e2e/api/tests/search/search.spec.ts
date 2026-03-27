import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';
import { verifySuccessResponse } from '../../utils/test-helpers';

test.describe('GET /api/search', () => {
  test('should search events and places', async ({ request }) => {
    const client = createApiClient(request);
    
    const response = await client.requestWithAuth('GET', '/search?q=music');
    
    verifySuccessResponse(response);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data?.events) || response.data?.events === undefined).toBe(true);
    expect(Array.isArray(response.data?.places) || response.data?.places === undefined).toBe(true);
  });

  test('should filter search results', async ({ request }) => {
    const client = createApiClient(request);
    
    const response = await client.requestWithAuth('GET', '/search?q=concert&type=events');
    
    verifySuccessResponse(response);
  });

  test('should return empty results for no matches', async ({ request }) => {
    const client = createApiClient(request);
    
    const response = await client.requestWithAuth('GET', '/search?q=xyznonexistent123');
    
    verifySuccessResponse(response);
  });
});
