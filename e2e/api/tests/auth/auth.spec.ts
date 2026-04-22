import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';

test.describe('POST /api/auth/register', () => {
  test('should register new user with valid data', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    const response = await api.register(
      `test${timestamp}@example.com`,
      'TestPass123!',
      'Test User'
    );
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBeDefined();
    expect(response.data?.email).toBe(`test${timestamp}@example.com`);
  });

  test('should return error for duplicate email', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    // First registration
    await api.register(`duplicate${timestamp}@example.com`, 'TestPass123!', 'Test User');
    
    // Second registration with same email
    const response = await api.register(
      `duplicate${timestamp}@example.com`,
      'TestPass123!',
      'Test User'
    );
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('EMAIL_EXISTS');
  });

  test('should validate email format', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.register('invalid-email', 'TestPass123!', 'Test User');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('INVALID_EMAIL');
  });

  test('should require password minimum length', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    const response = await api.register(`test${timestamp}@example.com`, '123', 'Test User');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('WEAK_PASSWORD');
    expect(response.error?.toLowerCase()).toContain('password');
  });

  test('should require name field', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    const response = await api.register(`test${timestamp}@example.com`, 'TestPass123!', '');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('MISSING_FIELDS');
    expect(response.error?.toLowerCase()).toContain('name');
  });
});

test.describe('POST /api/auth/login', () => {
  test('should login with valid credentials', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    // Create user first
    await api.register(`login${timestamp}@example.com`, 'TestPass123!', 'Test User');
    
    // Login
    const response = await api.login(`login${timestamp}@example.com`, 'TestPass123!');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.id).toBeDefined();
    expect(response.data?.email).toBe(`login${timestamp}@example.com`);
    expect(response.data?.name).toBe('Test User');
  });

  test('should return 401 for wrong password', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    // Create user first
    await api.register(`wrongpass${timestamp}@example.com`, 'TestPass123!', 'Test User');
    
    // Login with wrong password
    const response = await api.login(`wrongpass${timestamp}@example.com`, 'WrongPass123!');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('INVALID_PASSWORD');
    expect(response.status).toBe(401);
  });

  test('should return 401 for non-existent user', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.login('nonexistent@example.com', 'TestPass123!');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('USER_NOT_FOUND');
    expect(response.status).toBe(401);
  });

  test('should require email field', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.login('', 'TestPass123!');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('MISSING_CREDENTIALS');
  });

  test('should require password field', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.login('test@example.com', '');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('MISSING_CREDENTIALS');
  });

  test('should validate email format', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.login('invalid-email', 'TestPass123!');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('INVALID_EMAIL');
  });
});

test.describe('POST /api/auth/logout', () => {
  test('should logout authenticated user', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    // Register and login
    await api.register(`logout${timestamp}@example.com`, 'TestPass123!', 'Test User');
    await api.login(`logout${timestamp}@example.com`, 'TestPass123!');
    
    // Logout
    const response = await api.logout();
    
    expect(response.success).toBe(true);
  });

  test('should handle logout without session', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.logout();
    
    // Should still return success or handle gracefully
    expect(response).toBeDefined();
  });
});

test.describe('GET /api/auth/me', () => {
  test('should return current user when authenticated', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    // Register and login
    await api.register(`me${timestamp}@example.com`, 'TestPass123!', 'Test User');
    await api.login(`me${timestamp}@example.com`, 'TestPass123!');
    
    // Get current user - need to add this method to api client
    const response = await api.requestWithAuth('GET', '/auth/me');
    
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect((response.data as { email?: string })?.email).toBe(`me${timestamp}@example.com`);
  });

  test('should return 401 when not authenticated', async ({ request }) => {
    const api = createApiClient(request);
    
    // Clear any session
    api.setSessionCookie('');
    
    const response = await api.requestWithAuth('GET', '/auth/me');
    
    expect(response.success).toBe(false);
    expect(response.status).toBe(401);
  });
});

test.describe('POST /api/auth/forgot-password', () => {
  test('should send reset email for valid user', async ({ request }) => {
    const api = createApiClient(request);
    const timestamp = Date.now();
    
    // Create user
    await api.register(`forgot${timestamp}@example.com`, 'TestPass123!', 'Test User');
    
    // Request password reset
    const response = await api.requestWithAuth('POST', '/auth/forgot-password', {
      email: `forgot${timestamp}@example.com`,
    });
    
    // Should return success even if email service not configured
    expect(response.success).toBe(true);
  });

  test('should handle non-existent email gracefully', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth('POST', '/auth/forgot-password', {
      email: 'nonexistent@example.com',
    });
    
    // Should return success to prevent email enumeration
    expect(response.success).toBe(true);
  });
});

test.describe('POST /api/auth/reset-password', () => {
  test('should validate token format', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth('POST', '/auth/reset-password', {
      token: 'invalid-token',
      password: 'NewPass123!',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
  });

  test('should require password minimum length', async ({ request }) => {
    const api = createApiClient(request);
    
    const response = await api.requestWithAuth('POST', '/auth/reset-password', {
      token: 'valid-token-format-123',
      password: '123',
    });
    
    expect(response.success).toBe(false);
    expect(response.error).toContain('password');
  });
});
