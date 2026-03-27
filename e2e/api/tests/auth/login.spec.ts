import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';

test.describe('API: Auth - Login', () => {
  test('should login with valid credentials', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.login('test@example.com', 'TestPass123!');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBeDefined();
  });

  test('should return 401 for invalid credentials', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.login('wrong@example.com', 'WrongPass123!');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('USER_NOT_FOUND');
  });
});
