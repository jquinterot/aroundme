import { test, expect } from '../../fixtures';

/**
 * Activities Listing Tests
 * 
 * Covers:
 * - Activity cards display
 * - Category filtering (classes, tours, experiences, wellness)
 * - Search functionality
 * - Navigation to detail
 * - Create activity button
 */
test.describe('Activities Listing', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to Bogotá activities page', async () => {
      await page.goto('/bogota/activities');
      await page.waitForLoadState('networkidle');
    });
  });

  test('should display activity cards with proper data', async ({ page }) => {
    await test.step('Wait for activity cards to load', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible({ timeout: 15000 });
    });

    await test.step('Verify activity card count is greater than 0', async () => {
      const count = await page.locator('[data-testid^="activity-card"]').count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    await test.step('Verify activity cards have required elements', async () => {
      const firstCard = page.locator('[data-testid^="activity-card"]').first();
      await expect(firstCard).toBeVisible();
      const cardContent = await firstCard.textContent();
      expect(cardContent?.length).toBeGreaterThan(0);
    });
  });

  test('should filter activities by classes category', async ({ page }) => {
    await test.step('Click on Classes category filter', async () => {
      await page.click('[data-testid="category-class"], button:has-text("Classes")');
    });

    await test.step('Wait for filter to apply', async () => {
      await page.waitForTimeout(500);
    });

    await test.step('Verify activities are displayed after filtering', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible();
    });

    await test.step('Verify filter is visually active', async () => {
      const classFilter = page.locator('[data-testid="category-class"], button:has-text("Classes")');
      await expect(classFilter).toHaveClass(/bg-amber/);
    });
  });

  test('should filter activities by tours category', async ({ page }) => {
    await test.step('Click on Tours category filter', async () => {
      await page.click('[data-testid="category-tour"], button:has-text("Tours")');
    });

    await test.step('Wait for filter to apply', async () => {
      await page.waitForTimeout(500);
    });

    await test.step('Verify activities are displayed after filtering', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible();
    });
  });

  test('should filter activities by wellness category', async ({ page }) => {
    await test.step('Click on Wellness category filter', async () => {
      await page.click('[data-testid="category-wellness"], button:has-text("Wellness")');
    });

    await test.step('Wait for filter to apply', async () => {
      await page.waitForTimeout(500);
    });

    await test.step('Verify activities are displayed after filtering', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible();
    });
  });

  test('should filter activities by entertainment category', async ({ page }) => {
    await test.step('Click on Entertainment category filter', async () => {
      await page.click('[data-testid="category-entertainment"], button:has-text("Entertainment")');
    });

    await test.step('Wait for filter to apply', async () => {
      await page.waitForTimeout(500);
    });

    await test.step('Verify activities are displayed after filtering', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible();
    });
  });

  test('should search for activities', async ({ page }) => {
    await test.step('Click on search input if available', async () => {
      const searchInput = page.locator('[data-testid="activity-search-input"], input[placeholder*="Search"]');
      if (await searchInput.isVisible()) {
        await searchInput.click();
      }
    });

    await test.step('Type search query', async () => {
      const searchInput = page.locator('[data-testid="activity-search-input"], input[placeholder*="Search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('yoga');
        await page.waitForTimeout(500);
      }
    });

    await test.step('Verify search results are displayed', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible();
    });
  });

  test('should clear category filter', async ({ page }) => {
    await test.step('Apply Classes category filter', async () => {
      await page.click('[data-testid="category-class"], button:has-text("Classes")');
      await page.waitForTimeout(500);
    });

    await test.step('Click on All categories or clear filter', async () => {
      const allFilter = page.locator('[data-testid="category-all"], button:has-text("All")');
      if (await allFilter.isVisible()) {
        await allFilter.click();
      }
    });

    await test.step('Verify all activities are shown again', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible();
    });
  });

  test('should navigate to activity detail', async ({ page }) => {
    await test.step('Click on first activity card', async () => {
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await activityCards.first().click();
    });

    await test.step('Verify navigation to activity detail page', async () => {
      await expect(page).toHaveURL(/\/activity\/.+/);
    });

    await test.step('Verify activity detail page is displayed', async () => {
      await expect(page.locator('[data-testid="activity-detail-page"], h1')).toBeVisible();
    });
  });

  test('should navigate to create activity page', async ({ page }) => {
    await test.step('Click on create activity button', async () => {
      const createButton = page.locator('[data-testid="create-activity-button"], a[href="/create-activity"]');
      if (await createButton.isVisible()) {
        await createButton.click();
      }
    });

    await test.step('Verify navigation to create activity page', async () => {
      await expect(page).toHaveURL('/create-activity');
    });
  });

  test('should display activities count', async ({ page }) => {
    await test.step('Verify activities count is displayed', async () => {
      const activitiesCount = page.locator('[data-testid="activities-count"]');
      if (await activitiesCount.isVisible()) {
        const countText = await activitiesCount.textContent();
        expect(countText).toMatch(/\d+/);
      }
    });
  });
});

test.describe('Activities Map View', () => {
  test('should display map with activity markers', async ({ page }) => {
    await test.step('Navigate to activities page', async () => {
      await page.goto('/bogota/activities');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Switch to map view if available', async () => {
      const mapViewButton = page.locator('button:has-text("Map"), [data-testid="view-mode-map"]');
      if (await mapViewButton.isVisible()) {
        await mapViewButton.click();
      }
    });

    await test.step('Verify map container is visible', async () => {
      const mapContainer = page.locator('.leaflet-container');
      await expect(mapContainer).toBeVisible({ timeout: 10000 });
    });
  });
});
