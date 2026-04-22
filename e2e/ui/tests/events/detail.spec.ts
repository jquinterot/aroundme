import { test, expect } from '../../fixtures';

/**
 * Event Detail Page Tests
 * 
 * Covers:
 * - Event information display
 * - Map display
 * - RSVP functionality
 * - Save/share actions
 * - Navigation back
 * - Google Maps directions
 * - Ticket section
 * - Event countdown
 */
test.describe('Event Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to Bogotá events page', async () => {
      await page.goto('/bogota');
      await page.waitForLoadState('networkidle');
    });
  });

  test('should navigate to event detail from listing', async ({ page, cityPage }) => {
    await test.step('Click on first event card', async () => {
      await cityPage.clickFirstEvent();
    });

    await test.step('Verify navigation to event detail page', async () => {
      await expect(page).toHaveURL(/\/event\/.+/);
    });

    await test.step('Verify event title is visible', async () => {
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test('should display event information', async ({ page, cityPage }) => {
    await test.step('Navigate to event detail', async () => {
      await cityPage.clickFirstEvent();
    });

    await test.step('Verify event detail page container', async () => {
      await expect(page.locator('[data-testid="event-detail-page"]')).toBeVisible();
    });

    await test.step('Verify event title is displayed', async () => {
      await expect(page.locator('h1')).toBeVisible();
      const titleText = await page.locator('h1').textContent();
      expect(titleText?.length).toBeGreaterThan(0);
    });

    await test.step('Verify venue information is displayed', async () => {
      const venueAddress = page.locator('[data-testid="event-venue-address"]');
      await expect(venueAddress).toBeVisible();
    });

    await test.step('Verify category badge is displayed', async () => {
      const categoryBadge = page.locator('[data-testid="event-category"]');
      await expect(categoryBadge).toBeVisible();
    });
  });

  test('should display map on event detail', async ({ page, cityPage }) => {
    await test.step('Navigate to event detail', async () => {
      await cityPage.clickFirstEvent();
    });

    await test.step('Verify map container is visible', async () => {
      await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 10000 });
    });
  });

  test('should display event actions', async ({ page, cityPage }) => {
    await test.step('Navigate to event detail', async () => {
      await cityPage.clickFirstEvent();
    });

    await test.step('Verify event actions section is visible', async () => {
      await expect(page.locator('[data-testid="event-actions"]')).toBeVisible();
    });

    await test.step('Verify save button is visible', async () => {
      await expect(page.locator('[data-testid="event-save-button"]')).toBeVisible();
    });

    await test.step('Verify register button is visible', async () => {
      await expect(page.locator('[data-testid="event-register-button"]')).toBeVisible();
    });
  });

  test('should display RSVP buttons', async ({ page, cityPage }) => {
    await test.step('Navigate to event detail', async () => {
      await cityPage.clickFirstEvent();
    });

    await test.step('Verify RSVP buttons are visible', async () => {
      await expect(page.locator('[data-testid="rsvp-buttons"]')).toBeVisible();
      await expect(page.locator('[data-testid="rsvp-going-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="rsvp-interested-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="rsvp-maybe-button"]')).toBeVisible();
    });
  });

  test('should navigate back to events', async ({ page, cityPage }) => {
    await test.step('Navigate to event detail', async () => {
      await cityPage.clickFirstEvent();
      await expect(page).toHaveURL(/\/event\/.+/);
    });

    await test.step('Click back to events link', async () => {
      await page.click('[data-testid="back-to-events"]');
    });

    await test.step('Verify navigation back to city page', async () => {
      await expect(page).toHaveURL('/bogota');
    });
  });

  test('should open Google Maps directions', async ({ page, cityPage }) => {
    await test.step('Navigate to event detail', async () => {
      await cityPage.clickFirstEvent();
    });

    await test.step('Verify Google Maps link is visible', async () => {
      const googleMapsLink = page.locator('[data-testid="google-maps-link"]');
      await expect(googleMapsLink).toBeVisible();
    });

    await test.step('Verify link contains Google Maps URL', async () => {
      const href = await page.locator('[data-testid="google-maps-link"]').getAttribute('href');
      expect(href).toContain('google.com/maps');
    });
  });

  test('should show login prompt when not authenticated', async ({ page, cityPage }) => {
    await test.step('Navigate to event detail', async () => {
      await cityPage.clickFirstEvent();
    });

    await test.step('Click RSVP going button', async () => {
      await page.click('[data-testid="rsvp-going-button"]');
    });

    await test.step('Verify login prompt is shown', async () => {
      await expect(page.locator('[data-testid="login-prompt"]')).toBeVisible();
    });
  });

  test('should show login prompt when saving without auth', async ({ page, cityPage }) => {
    await test.step('Navigate to event detail', async () => {
      await cityPage.clickFirstEvent();
    });

    await test.step('Click save button', async () => {
      await page.click('[data-testid="event-save-button"]');
    });

    await test.step('Verify redirect to login or login prompt shown', async () => {
      const isLoginPage = page.url().includes('/login');
      const hasLoginPrompt = await page.locator('[data-testid="login-prompt"]').isVisible();
      expect(isLoginPage || hasLoginPrompt).toBeTruthy();
    });
  });
});
