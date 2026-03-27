import { test, expect } from '@playwright/test';
import { createApiClient } from '../../utils/api-client';

test.describe('API Error Handling', () => {
  test('should return errorId for all errors', async ({ request }) => {
    const api = createApiClient(request);
    const response = await api.createEvent({});
    
    expect(response.errorId).toBeDefined();
    expect(response.errorId).toMatch(/^err_/);
    expect(response.timestamp).toBeDefined();
  });

  test('should return consistent error format', async ({ request }) => {
    const api = createApiClient(request);
    const response = await api.createEvent({});
    
    expect(response).toHaveProperty('success');
    expect(response).toHaveProperty('error');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('errorId');
    expect(response).toHaveProperty('timestamp');
  });

  test('should handle 404 errors', async ({ request }) => {
    const api = createApiClient(request);
    const response = await api.getEvent('non-existent-id');
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('NOT_FOUND');
    expect(response.status).toBe(404);
  });

  test('should handle validation errors with field details', async ({ request }) => {
    const api = createApiClient(request);
    const response = await api.createEvent({
      title: '',
      description: '',
    });
    
    expect(response.success).toBe(false);
    expect(response.code).toBe('VALIDATION_ERROR');
    expect(response.error).toContain('title');
    expect(response.error).toContain('description');
  });

  test('should handle 400 bad request', async ({ request }) => {
    const api = createApiClient(request);
    const response = await api.createEvent({
      citySlug: 'bogota',
      title: '',
      description: '',
      category: '',
      venueName: '',
      venueAddress: '',
      startDate: '',
      startTime: '',
      isFree: true,
    });
    
    expect(response.success).toBe(false);
    expect(response.status).toBe(400);
  });

  test('should handle network errors gracefully', async ({ request }) => {
    const api = createApiClient(request);
    // This test would need a mock server to simulate network errors
    // For now, just verify error structure
    const response = await api.requestWithAuth('GET', '/non-existent-endpoint');
    
    expect(response.success).toBe(false);
    expect(response.code).toBeDefined();
  });
});
