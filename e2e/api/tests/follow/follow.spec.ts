import { test } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { createTestUser } from '../../utils/shared-data';
import { verifySuccessResponse, verifyErrorResponse } from '../../utils/test-helpers';

test.describe('POST /api/follow', () => {
  test('should follow another user', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const targetUser = createTestUser();
    const apiClient = createApiClient(request);
    await apiClient.register(targetUser.email, targetUser.password, targetUser.name);
    const loginRes = await apiClient.login(targetUser.email, targetUser.password);
    const targetId = (loginRes.data as { id?: string })?.id;
    
    const response = await client.requestWithAuth('POST', '/follow', {
      userId: targetId,
    });
    
    verifySuccessResponse(response);
  });

  test('should not follow self', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    const meResponse = await client.requestWithAuth('GET', '/auth/me');
    const myId = (meResponse.data as { id?: string })?.id;
    
    const response = await client.requestWithAuth('POST', '/follow', {
      userId: myId,
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });
});

test.describe('DELETE /api/follow', () => {
  test('should unfollow user', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const targetUser = createTestUser();
    const apiClient = createApiClient(request);
    await apiClient.register(targetUser.email, targetUser.password, targetUser.name);
    const loginRes = await apiClient.login(targetUser.email, targetUser.password);
    const targetId = (loginRes.data as { id?: string })?.id;
    
    await client.requestWithAuth('POST', '/follow', { userId: targetId });
    
    const response = await client.requestWithAuth('DELETE', '/follow', {
      userId: targetId,
    });
    
    verifySuccessResponse(response);
  });
});
