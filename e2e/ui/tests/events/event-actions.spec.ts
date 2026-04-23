import { test, expect } from '../../fixtures';

test.describe('Event Actions', () => {
  test('should display event actions on event detail', async ({ page }) => {
    // Navigate to an event
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    
    const eventCard = page.locator('[data-testid^="event-card"]').first();
    if (await eventCard.isVisible()) {
      await eventCard.click();
      await page.waitForLoadState('networkidle');
      
      // Should see event actions
      await expect(page.locator('[data-testid="event-actions"]')).toBeVisible();
      await expect(page.locator('[data-testid="event-register-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="event-save-button"]')).toBeVisible();
    }
  });

  test('should show login prompt when saving without authentication', async ({ page }) => {
    // Go to event detail
    const eventsResponse = await page.request.get('/api/cities/bogota/events?limit=1');
    const events = await eventsResponse.json();
    
    if (events.data && events.data.length > 0) {
      const eventId = events.data[0].id;
      await page.goto(`/event/${eventId}`);
      await page.waitForLoadState('networkidle');
      
      // Try to save event without being logged in
      await page.click('[data-testid="event-save-button"]');
      
      // Should redirect to login
      await expect(page).toHaveURL(/login/);
    }
  });
});
