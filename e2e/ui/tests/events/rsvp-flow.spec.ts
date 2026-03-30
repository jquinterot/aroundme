import { test, expect } from '@playwright/test';

test.describe('RSVP Flow', () => {
  test('should display RSVP buttons on event detail', async ({ page }) => {
    // Navigate to an event with RSVP (need an existing event)
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    
    // Find and click on an event card
    const eventCard = page.locator('[data-testid^="event-card"]').first();
    if (await eventCard.isVisible()) {
      await eventCard.click();
      await page.waitForLoadState('networkidle');
      
      // Should see RSVP buttons
      await expect(page.locator('[data-testid="rsvp-buttons"]')).toBeVisible();
      await expect(page.locator('[data-testid="rsvp-going-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="rsvp-interested-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="rsvp-maybe-button"]')).toBeVisible();
    }
  });

  test('should show login prompt when not authenticated', async ({ page }) => {
    // Go to event detail page
    const eventsResponse = await page.request.get('/api/bogota/events?limit=1');
    const events = await eventsResponse.json();
    
    if (events.data && events.data.length > 0) {
      const eventId = events.data[0].id;
      await page.goto(`/event/${eventId}`);
      await page.waitForLoadState('networkidle');
      
      // Try to RSVP without being logged in - should show login prompt
      await page.click('[data-testid="rsvp-going-button"]');
      
      // Should redirect to login or show login prompt
      await expect(page.locator('[data-testid="login-prompt"]')).toBeVisible();
    }
  });
});
