import { test, expect } from '../../fixtures';

test.describe('RSVP Flow', () => {
  test('should display login prompt for RSVP when not authenticated', async ({ page }) => {
    // Navigate to an event
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    
    // Find and click on an event card
    const eventCard = page.locator('[data-testid^="event-card"]').first();
    if (await eventCard.isVisible()) {
      await eventCard.click();
      await page.waitForLoadState('networkidle');
      
      // Should see login prompt (not RSVP buttons when unauthenticated)
      await expect(page.locator('[data-testid="login-prompt"]')).toBeVisible();
    }
  });

  test('should show login prompt when not authenticated', async ({ page }) => {
    // Go to event detail page
    const eventsResponse = await page.request.get('/api/cities/bogota/events?limit=1');
    const events = await eventsResponse.json();
    
    if (events.data && events.data.length > 0) {
      const eventId = events.data[0].id;
      await page.goto(`/event/${eventId}`);
      await page.waitForLoadState('networkidle');
      
      // Should see login prompt for unauthenticated users
      await expect(page.locator('[data-testid="login-prompt"]')).toBeVisible();
    }
  });
});
