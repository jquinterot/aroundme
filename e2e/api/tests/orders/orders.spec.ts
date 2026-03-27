import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifySuccessResponse, verifyErrorResponse } from '../../utils/test-helpers';

test.describe('GET /api/orders', () => {
  test('should get user orders', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('GET', '/orders');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

test.describe('GET /api/orders/:id', () => {
  test('should get order by id', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // First get all orders
    const ordersResponse = await client.requestWithAuth('GET', '/orders');
    
    if (ordersResponse.data?.length > 0) {
      const orderId = ordersResponse.data[0].id;
      
      const response = await client.requestWithAuth('GET', `/orders/${orderId}`);
      
      verifySuccessResponse(response);
      expect(response.data?.id).toBe(orderId);
    }
  });

  test('should return 404 for non-existent order', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('GET', '/orders/non-existent-id');
    
    verifyErrorResponse(response, 404, 'NOT_FOUND');
  });
});
