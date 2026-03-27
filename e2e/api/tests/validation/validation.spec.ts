import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users, events, places } from '../../fixtures';
import { verifyErrorResponse, assertFieldError } from '../../utils/test-helpers';

test.describe('Validation Tests', () => {
  const client = async (request) => await createAuthenticatedClient(request, users.valid);

  test('should validate required fields for events', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.createEvent({});
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });

  test('should validate required fields for places', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.createPlace({});
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });

  test('should validate email format', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.requestWithAuth('POST', '/auth/register', {
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User',
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
    assertFieldError(response, 'email');
  });

  test('should validate date format', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.createEvent({
      ...events.minimal,
      startDate: 'invalid-date',
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
    assertFieldError(response, 'startDate');
  });

  test('should validate coordinate ranges', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.createEvent({
      ...events.minimal,
      venueLat: 999,
      venueLng: 999,
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });

  test('should validate min/max lengths', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.createEvent({
      ...events.minimal,
      title: 'AB',
      description: 'Short',
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
    expect(response.error).toContain('at least');
  });

  test('should validate category values', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.createEvent({
      ...events.minimal,
      category: 'invalid-category',
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
    assertFieldError(response, 'category');
  });

  test('should validate price for non-free events', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.createEvent({
      ...events.minimal,
      isFree: false,
      price: -100,
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });

  test('should validate URL format', async ({ request }) => {
    const apiClient = await client(request);
    
    const response = await apiClient.createPlace({
      ...places.minimal,
      website: 'not-a-valid-url',
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
    assertFieldError(response, 'website');
  });
});
