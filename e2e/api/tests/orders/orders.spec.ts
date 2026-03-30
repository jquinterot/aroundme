import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifySuccessResponse, verifyErrorResponse } from '../../utils/test-helpers';

interface Order {
  id: string;
}

test.describe('GET /api/orders', () => {
  test('should get user orders', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth<Order[]>('GET', '/orders');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

test.describe('GET /api/orders/:id', () => {
  test('should get order by id', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // First get all orders
    const ordersResponse = await client.requestWithAuth<Order[]>('GET', '/orders');
    
    if (ordersResponse.data && ordersResponse.data.length > 0) {
      const firstOrder = ordersResponse.data[0];
      if (firstOrder.id) {
        const response = await client.requestWithAuth<Order>('GET', `/orders/${firstOrder.id}`);
        
        verifySuccessResponse(response);
        expect(response.data?.id).toBe(firstOrder.id);
      }
    }
  });

  test('should return 404 for non-existent order', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('GET', '/orders/non-existent-id');
    
    verifyErrorResponse(response, 404, 'NOT_FOUND');
  });
});
