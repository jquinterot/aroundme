import { test } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users } from '../../fixtures';
import { verifyErrorResponse } from '../../utils/test-helpers';

test.describe('Validation Tests', () => {
  test('should validate required fields for events', async ({ request }) => {
    const apiClient = await createAuthenticatedClient(request, users.valid);
    
    const response = await apiClient.createEvent({});
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });

  test('should validate required fields for places', async ({ request }) => {
    const apiClient = await createAuthenticatedClient(request, users.valid);
    
    const response = await apiClient.createPlace({});
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });
});
