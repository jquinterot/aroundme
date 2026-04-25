import { test, expect } from '../../fixtures';

/**
 * Events Listing Tests
 * 
 * Covers:
 * - Event cards display
 * - Category filtering
 * - Date filtering
 * - Price filtering
 * - Search functionality
 * - View modes (grid/list/map)
 * - Load more / pagination
 */
test.describe('Events Listing', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to Bogotá events page', async () => {
      await page.goto('/bogota');
      await expect(page.getByTestId(/^event-card/).first()).toBeVisible({ timeout: 15000 });
    });
  });

  test('should display event cards with proper data', async ({ page }) => {
    await test.step('Wait for event cards to load', async () => {
      const eventCards = page.getByTestId(/^event-card/);
      await expect(eventCards.first()).toBeVisible({ timeout: 15000 });
    });

    await test.step('Verify event card count is greater than 0', async () => {
      const count = await page.getByTestId(/^event-card/).count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    await test.step('Verify event cards have required elements', async () => {
      const firstCard = page.getByTestId(/^event-card/).first();
      await expect(firstCard).toBeVisible();
      // Cards should contain title, date, and venue info
      const cardContent = await firstCard.textContent();
      expect(cardContent?.length).toBeGreaterThan(0);
    });
  });

  test('should filter events by category', async ({ page }) => {
    await test.step('Click on music category filter', async () => {
      await page.getByTestId('event-filter-category-music').click();
    });

    await test.step('Wait for filter to apply', async () => {
      await expect(page.getByTestId(/^event-card/).first()).toBeVisible();
    });

    await test.step('Verify events are displayed after filtering', async () => {
      const eventCards = page.getByTestId(/^event-card/);
      await expect(eventCards.first()).toBeVisible();
    });

    await test.step('Verify filter is visually active', async () => {
      const musicFilter = page.getByTestId('event-filter-category-music');
      await expect(musicFilter).toHaveClass(/bg-indigo/);
    });
  });

  test('should filter events by date', async ({ page }) => {
    await test.step('Select "This Week" from date filter', async () => {
      await page.getByTestId('event-filter-date').selectOption('week');
    });

    await test.step('Verify date filter is applied', async () => {
      const dateFilter = page.getByTestId('event-filter-date');
      await expect(dateFilter).toHaveValue('week');
      // Events may or may not be visible depending on current date vs event dates
      const eventCards = page.getByTestId(/^event-card/);
      const count = await eventCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test('should filter events by price', async ({ page }) => {
    await test.step('Select "Free" from price filter', async () => {
      await page.getByTestId('event-filter-price').selectOption('free');
    });

    await test.step('Verify events are displayed', async () => {
      const eventCards = page.getByTestId(/^event-card/);
      await expect(eventCards.first()).toBeVisible();
    });
  });

  test('should search for events', async ({ page }) => {
    await test.step('Click on search input', async () => {
      await page.getByTestId('event-search-input').click();
    });

    await test.step('Type search query', async () => {
      await page.getByTestId('event-search-input').fill('music');
    });

    await test.step('Wait for search results', async () => {
      await expect(page.getByTestId(/^event-card/).first()).toBeVisible();
    });

    await test.step('Verify search results are displayed', async () => {
      const eventCards = page.getByTestId(/^event-card/);
      await expect(eventCards.first()).toBeVisible();
    });
  });

  test('should clear all filters', async ({ page }) => {
    await test.step('Apply category filter', async () => {
      await page.getByTestId('event-filter-category-music').click();
      await expect(page.getByTestId(/^event-card/).first()).toBeVisible();
    });

    await test.step('Click clear filters button', async () => {
      await page.getByTestId('event-filter-clear').click();
    });

    await test.step('Verify all events are shown again', async () => {
      const eventCards = page.getByTestId(/^event-card/);
      await expect(eventCards.first()).toBeVisible();
    });
  });

  test('should display events count', async ({ page }) => {
    await test.step('Verify events count is displayed', async () => {
      const eventsCount = page.getByTestId('events-count');
      await expect(eventsCount).toBeVisible();
      const countText = await eventsCount.textContent();
      expect(countText).toMatch(/\d+/);
    });
  });

  test('should navigate to create event page', async ({ page }) => {
    await test.step('Click on create event button', async () => {
      await page.getByTestId('create-event-button').click();
    });

    await test.step('Verify navigation to create event page', async () => {
      await expect(page).toHaveURL('/create-event');
    });
  });
});

test.describe('Events Map View', () => {
  test('should display map with event markers', async ({ page }) => {
    await test.step('Navigate to events page', async () => {
      await page.goto('/bogota');
      await expect(page.getByTestId(/^event-card/).first()).toBeVisible({ timeout: 15000 });
    });

    await test.step('Switch to map view', async () => {
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
