import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifySuccessResponse, verifyErrorResponse } from '../../utils/test-helpers';

interface UserProfile {
  id: string;
  email: string;
  name: string;
}

test.describe('GET /api/users', () => {
  test('should get user profile', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth<UserProfile>('GET', '/auth/me');
    
    verifySuccessResponse(response);
    expect(response.data?.email).toBe(users.valid.email);
    expect(response.data?.name).toBe(users.valid.name);
  });

  test('should get user by id', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // First get current user
    const meResponse = await client.requestWithAuth<UserProfile>('GET', '/auth/me');
    const userId = meResponse.data?.id;
    
    // Then get by ID
    if (userId) {
      const response = await client.requestWithAuth<UserProfile>('GET', `/users/${userId}`);
      
      verifySuccessResponse(response);
      expect(response.data?.id).toBe(userId);
    }
  });
});

test.describe('PUT /api/users/:id', () => {
  test('should update user profile', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const meResponse = await client.requestWithAuth<UserProfile>('GET', '/auth/me');
    const userId = meResponse.data?.id;
    
    if (userId) {
      const response = await client.requestWithAuth<UserProfile>('PUT', `/users/${userId}`, {
        name: 'Updated Name',
      });
      
      verifySuccessResponse(response);
    }
  });

  test('should validate update data', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const meResponse = await client.requestWithAuth<UserProfile>('GET', '/auth/me');
    const userId = meResponse.data?.id;
    
    if (userId) {
      const response = await client.requestWithAuth<UserProfile>('PUT', `/users/${userId}`, {
        name: '', // Invalid
      });
      
      verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
    }
  });
});
