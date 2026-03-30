import { test } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users, events, generateUniqueEvent } from '../../fixtures';
import { verifySuccessResponse, verifyErrorResponse } from '../../utils/test-helpers';

interface TestEvent {
  id?: string;
  title: string;
}

test.describe('POST /api/checkin', () => {
  test('should check in to event', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // Create an event and RSVP first
    const event = generateUniqueEvent(events.music) as TestEvent;
    const eventResponse = await client.createEvent(event as unknown as Record<string, unknown>);
    const eventId = eventResponse.data?.id;
    
    if (eventId) {
      await client.rsvpToEvent(eventId, 'going');
      
      // Check in
      const response = await client.requestWithAuth('POST', '/checkin', {
        eventId,
        method: 'manual',
      });
      
      verifySuccessResponse(response);
    }
  });

  test('should require RSVP before checkin', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const event = generateUniqueEvent(events.music) as TestEvent;
    const eventResponse = await client.createEvent(event as unknown as Record<string, unknown>);
    const eventId = eventResponse.data?.id;
    
    if (eventId) {
      // Try to check in without RSVP
      const response = await client.requestWithAuth('POST', '/checkin', {
        eventId,
        method: 'manual',
      });
      
      verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
    }
  });
});
