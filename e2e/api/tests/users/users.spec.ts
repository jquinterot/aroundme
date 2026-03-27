import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { createTestUser } from '../../utils/shared-data';
import { verifySuccessResponse, verifyErrorResponse } from '../../utils/test-helpers';

test.describe('GET /api/users', () => {
  test('should get user profile', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth('GET', '/auth/me');
    
    verifySuccessResponse(response);
    expect(response.data?.email).toBe(users.valid.email);
    expect(response.data?.name).toBe(users.valid.name);
  });

  test('should get user by id', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // First get current user
    const meResponse = await client.requestWithAuth('GET', '/auth/me');
    const userId = meResponse.data?.id;
    
    // Then get by ID
    const response = await client.requestWithAuth('GET', `/users/${userId}`);
    
    verifySuccessResponse(response);
    expect(response.data?.id).toBe(userId);
  });
});

test.describe('PUT /api/users/:id', () => {
  test('should update user profile', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const meResponse = await client.requestWithAuth('GET', '/auth/me');
    const userId = meResponse.data?.id;
    
    const response = await client.requestWithAuth('PUT', `/users/${userId}`, {
      name: 'Updated Name',
    });
    
    verifySuccessResponse(response);
  });

  test('should validate update data', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const meResponse = await client.requestWithAuth('GET', '/auth/me');
    const userId = meResponse.data?.id;
    
    const response = await client.requestWithAuth('PUT', `/users/${userId}`, {
      name: '', // Invalid
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });
});

test.describe('DELETE /api/users/:id', () => {
  test('should delete user account', async ({ request }) => {
    // Create a test user
    const testUser = createTestUser();
    const client = createApiClient(request);
    
    await client.register(testUser.email, testUser.password, testUser.name);
    const loginResponse = await client.login(testUser.email, testUser.password);
    const userId = loginResponse.data?.id;
    
    // Delete user
    const response = await client.requestWithAuth('DELETE', `/users/${userId}`);
    
    verifySuccessResponse(response);
    
    // Verify user is deleted
    const checkResponse = await client.login(testUser.email, testUser.password);
    verifyErrorResponse(checkResponse, 401, 'USER_NOT_FOUND');
  });
});
