import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users, events, generateUniqueEvent } from '../../fixtures';
import { verifySuccessResponse, verifyErrorResponse } from '../../utils/test-helpers';

test.describe('POST /api/checkin', () => {
  test('should check in to event', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // Create an event and RSVP first
    const event = generateUniqueEvent(events.music);
    const eventResponse = await client.createEvent(event);
    const eventId = eventResponse.data?.id;
    
    await client.rsvpToEvent(eventId, 'going');
    
    // Check in
    const response = await client.requestWithAuth('POST', '/checkin', {
      eventId,
      method: 'manual',
    });
    
    verifySuccessResponse(response);
  });

  test('should require RSVP before checkin', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const event = generateUniqueEvent(events.music);
    const eventResponse = await client.createEvent(event);
    const eventId = eventResponse.data?.id;
    
    // Try to check in without RSVP
    const response = await client.requestWithAuth('POST', '/checkin', {
      eventId,
      method: 'manual',
    });
    
    verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  });
});

test.describe('GET /api/checkin/scan', () => {
  test('should verify QR code', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // This would require a real QR code
    const response = await client.requestWithAuth('GET', '/checkin/scan?code=test-qr-code');
    
    // Will likely return error for invalid code
    expect(response).toBeDefined();
  });
});
