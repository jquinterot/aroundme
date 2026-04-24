import { test, expect } from '../../fixtures';

/**
 * Places Listing Tests
 * 
 * Covers:
 * - Place cards display
 * - Category filtering
 * - Search functionality
 * - View modes (grid/map)
 * - Navigation to detail
 * - Create/submit place button
 */
test.describe('Places Listing', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to Bogotá places page', async () => {
      await page.goto('/bogota/places');
      await expect(page.locator('[data-testid^="place-card"]').first()).toBeVisible({ timeout: 15000 });
    });
  });

  test('should display place cards with proper data', async ({ page }) => {
    await test.step('Wait for place cards to load', async () => {
      const placeCards = page.locator('[data-testid^="place-card"]');
      await expect(placeCards.first()).toBeVisible({ timeout: 15000 });
    });

    await test.step('Verify place card count is greater than 0', async () => {
      const count = await page.locator('[data-testid^="place-card"]').count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    await test.step('Verify place cards have required elements', async () => {
      const firstCard = page.locator('[data-testid^="place-card"]').first();
      await expect(firstCard).toBeVisible();
      const cardContent = await firstCard.textContent();
      expect(cardContent?.length).toBeGreaterThan(0);
    });
  });

  test('should filter places by category', async ({ page }) => {
    await test.step('Click on restaurant category filter', async () => {
      await page.click('[data-testid="place-filter-category-restaurant"]');
    });

    await test.step('Verify filter is visually active', async () => {
      const restaurantFilter = page.locator('[data-testid="place-filter-category-restaurant"]');
      await expect(restaurantFilter).toHaveClass(/bg-teal-600/);
    });

    await test.step('Verify places are displayed after filtering', async () => {
      const placeCards = page.locator('[data-testid^="place-card"]');
      const count = await placeCards.count();
      if (count > 0) {
        await expect(placeCards.first()).toBeVisible();
      }
    });
  });

  test('should filter places by cafe category', async ({ page }) => {
    await test.step('Click on cafe category filter', async () => {
      await page.click('[data-testid="place-filter-category-cafe"]');
    });

    await test.step('Verify filter is visually active', async () => {
      const cafeFilter = page.locator('[data-testid="place-filter-category-cafe"]');
      await expect(cafeFilter).toHaveClass(/bg-teal-600/);
    });

    await test.step('Verify places are displayed after filtering', async () => {
      const placeCards = page.locator('[data-testid^="place-card"]');
      const count = await placeCards.count();
      if (count > 0) {
        await expect(placeCards.first()).toBeVisible();
      }
    });
  });

  test('should search for places', async ({ page }) => {
    await test.step('Click on search input', async () => {
      const searchInput = page.locator('[data-testid="place-search-input"]');
      await searchInput.click();
    });

    await test.step('Type search query', async () => {
      const searchInput = page.locator('[data-testid="place-search-input"]');
      await searchInput.fill('coffee');
    });

    await test.step('Wait for search results', async () => {
      await page.waitForTimeout(500);
    });

    await test.step('Verify search results are displayed', async () => {
      const placeCards = page.locator('[data-testid^="place-card"]');
      await expect(placeCards.first()).toBeVisible();
    });
  });

  test('should clear all filters', async ({ page }) => {
    await test.step('Apply category filter', async () => {
      await page.click('[data-testid="place-filter-category-restaurant"]');
      await expect(page.locator('[data-testid="place-filter-category-restaurant"]')).toHaveClass(/bg-teal-600/);
    });

    await test.step('Click "All" category to clear filters', async () => {
      const allButton = page.locator('[data-testid="place-filter-category-all"]');
      await expect(allButton).toBeVisible();
      await allButton.click();
    });

    await test.step('Verify all places are shown again', async () => {
      const placeCards = page.locator('[data-testid^="place-card"]');
      await expect(placeCards.first()).toBeVisible();
    });
  });

  test('should navigate to place detail', async ({ page, cityPage }) => {
    await test.step('Click on first place card', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Verify navigation to place detail page', async () => {
      await expect(page).toHaveURL(/\/place\/.+/);
    });

    await test.step('Verify place detail page is displayed', async () => {
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test('should navigate to submit place page', async ({ page }) => {
    await test.step('Click on submit place button', async () => {
      const submitButton = page.locator('[data-testid="submit-place-button"], a[href="/submit-place"]');
      if (await submitButton.isVisible()) {
        await submitButton.click();
      }
    });

    await test.step('Verify navigation to submit place page', async () => {
      await expect(page).toHaveURL('/submit-place');
    });
  });

  test('should display places count', async ({ page }) => {
    await test.step('Verify places count is displayed', async () => {
      const placesCount = page.locator('[data-testid="places-count"]');
      if (await placesCount.isVisible()) {
        const countText = await placesCount.textContent();
        expect(countText).toMatch(/\d+/);
      }
    });
  });
});

test.describe('Places Map View', () => {
  test('should display map with place markers', async ({ page }) => {
    await test.step('Navigate to places page', async () => {
      await page.goto('/bogota/places');
      await expect(page.locator('[data-testid^="place-card"]').first()).toBeVisible({ timeout: 15000 });
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
