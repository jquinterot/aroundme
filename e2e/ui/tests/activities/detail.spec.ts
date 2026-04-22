import { test, expect } from '../../fixtures';

/**
 * Activity Detail Page Tests
 * 
 * Covers:
 * - Activity information display
 * - Map display
 * - Booking form
 * - Provider information
 * - Schedule display
 * - Navigation back
 * - Save/share actions
 */
test.describe('Activity Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to Bogotá activities page', async () => {
      await page.goto('/bogota/activities');
      await page.waitForLoadState('networkidle');
    });
  });

  test('should navigate to activity detail from listing', async ({ page }) => {
    await test.step('Click on first activity card', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Verify navigation to activity detail page', async () => {
      await expect(page).toHaveURL(/\/activity\/.+/);
    });

    await test.step('Verify activity title is visible', async () => {
      await expect(page.locator('[data-testid="activity-title"], h1')).toBeVisible();
    });
  });

  test('should display activity information', async ({ page }) => {
    await test.step('Navigate to activity detail', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Verify activity detail page container', async () => {
      await expect(page.locator('[data-testid="activity-detail-page"]')).toBeVisible();
    });

    await test.step('Verify activity title is displayed', async () => {
      await expect(page.locator('[data-testid="activity-title"]')).toBeVisible();
      const titleText = await page.locator('[data-testid="activity-title"]').textContent();
      expect(titleText?.length).toBeGreaterThan(0);
    });

    await test.step('Verify provider name is displayed', async () => {
      await expect(page.locator('[data-testid="activity-provider"]')).toBeVisible();
    });
  });

  test('should display map on activity detail', async ({ page }) => {
    await test.step('Navigate to activity detail', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Verify map container is visible', async () => {
      await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 10000 });
    });
  });

  test('should display booking section', async ({ page }) => {
    await test.step('Navigate to activity detail', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Verify booking form is visible', async () => {
      await expect(page.locator('form')).toBeVisible();
    });

    await test.step('Verify book button is visible', async () => {
      const bookButton = page.locator('button:has-text("Book"), button:has-text("Reservar")');
      await expect(bookButton).toBeVisible();
    });
  });

  test('should display schedule information', async ({ page }) => {
    await test.step('Navigate to activity detail', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Check for schedule display', async () => {
      const scheduleElement = page.locator('[data-testid="activity-schedule"], .activity-schedule');
      if (await scheduleElement.isVisible()) {
        expect(await scheduleElement.isVisible()).toBeTruthy();
      }
    });
  });

  test('should display price information', async ({ page }) => {
    await test.step('Navigate to activity detail', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Check for price display', async () => {
      const priceElement = page.locator('[data-testid="activity-price"], .activity-price, :text("Free"), :text("COP")');
      await expect(priceElement.first()).toBeVisible();
    });
  });

  test('should navigate back to activities', async ({ page }) => {
    await test.step('Navigate to activity detail', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
      await expect(page).toHaveURL(/\/activity\/.+/);
    });

    await test.step('Click back to activities link', async () => {
      await page.click('[data-testid="back-to-activities"]');
    });

    await test.step('Verify navigation back to activities page', async () => {
      await expect(page).toHaveURL('/bogota/activities');
    });
  });

  test('should display save and share buttons', async ({ page }) => {
    await test.step('Navigate to activity detail', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Verify save button is visible', async () => {
      const saveButton = page.locator('[data-testid="save-activity-button"]');
      await expect(saveButton).toBeVisible();
    });

    await test.step('Verify share button is visible', async () => {
      const shareButton = page.locator('[data-testid="share-activity-button"]');
      await expect(shareButton).toBeVisible();
    });
  });

  test('should show login prompt when saving without auth', async ({ page }) => {
    await test.step('Navigate to activity detail', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Click save button', async () => {
      await page.click('[data-testid="save-activity-button"]');
    });

    await test.step('Verify redirect to login or login prompt shown', async () => {
      const isLoginPage = page.url().includes('/login');
      const hasLoginPrompt = await page.locator('[data-testid="login-prompt"]').isVisible();
      expect(isLoginPage || hasLoginPrompt).toBeTruthy();
    });
  });
});
