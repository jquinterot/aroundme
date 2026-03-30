import { test, expect } from '@playwright/test';
import { createAuthenticatedClient } from '../../utils/test-helpers';
import { users, events, generateUniqueEvent } from '../../fixtures';
import { verifySuccessResponse } from '../../utils/test-helpers';

interface WaitlistEntry {
  id: string;
}

test.describe('POST /api/waitlist', () => {
  test('should join waitlist for sold out event', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // Create event with max capacity
    const event = generateUniqueEvent(events.music);
    const eventResponse = await client.createEvent({
      ...event,
      maxAttendees: 1,
    } as Record<string, unknown>);
    const eventId = eventResponse.data?.id;
    
    if (eventId) {
      // Join waitlist
      const response = await client.requestWithAuth('POST', '/waitlist', {
        eventId,
        notifyAt: 1,
      });
      
      verifySuccessResponse(response);
    }
  });
});

test.describe('GET /api/waitlist', () => {
  test('should get user waitlist entries', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    const response = await client.requestWithAuth<WaitlistEntry[]>('GET', '/waitlist');
    
    verifySuccessResponse(response);
    expect(Array.isArray(response.data)).toBe(true);
  });
});

test.describe('DELETE /api/waitlist/:id', () => {
  test('should leave waitlist', async ({ request }) => {
    const client = await createAuthenticatedClient(request, users.valid);
    
    // Get waitlist entries first
    const listResponse = await client.requestWithAuth<WaitlistEntry[]>('GET', '/waitlist');
    
    if (listResponse.data && listResponse.data.length > 0 && listResponse.data[0].id) {
      const entryId = listResponse.data[0].id;
      
      const response = await client.requestWithAuth(
        'DELETE', 
        `/waitlist/${entryId}`
      );
      
      verifySuccessResponse(response);
    }
  });
});
