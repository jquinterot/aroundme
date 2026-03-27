import { test, expect } from '@playwright/test';
import { CityPage } from '../../pom';

test.describe('Event Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to event detail from listing', async ({ page }) => {
    const cityPage = new CityPage(page, 'bogota');
    
    await cityPage.clickFirstEvent();
    
    await expect(page).toHaveURL(/\/event\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display event information', async ({ page }) => {
    const cityPage = new CityPage(page, 'bogota');
    await cityPage.clickFirstEvent();
    
    await expect(page.locator('[data-testid="event-detail-page"]')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display map on event detail', async ({ page }) => {
    const cityPage = new CityPage(page, 'bogota');
    await cityPage.clickFirstEvent();
    
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate back to events', async ({ page }) => {
    const cityPage = new CityPage(page, 'bogota');
    await cityPage.clickFirstEvent();
    
    await page.click('[data-testid="back-to-events"]');
    
    await expect(page).toHaveURL('/bogota');
  });

  test('should open Google Maps directions', async ({ page }) => {
    const cityPage = new CityPage(page, 'bogota');
    await cityPage.clickFirstEvent();
    
    const googleMapsLink = page.locator('[data-testid="google-maps-link"]');
    await expect(googleMapsLink).toBeVisible();
    
    const href = await googleMapsLink.getAttribute('href');
    expect(href).toContain('google.com/maps');
  });
});

test.describe('Event Creation Flow', () => {
  test('should navigate to create event page', async ({ page }) => {
    await page.goto('/create-event');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('Create New Event');
    await expect(page.locator('[data-testid="create-event-title"]')).toBeVisible();
  });
});

test.describe('Event Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
  });

  test('should filter events by category', async ({ page }) => {
    const cityPage = new CityPage(page, 'bogota');
    
    await cityPage.filterByCategory('music');
    await page.waitForTimeout(500);
    
    const eventCards = page.locator('[data-testid^="event-card"]');
    await expect(eventCards.first()).toBeVisible();
  });

  test('should clear filters', async ({ page }) => {
    const cityPage = new CityPage(page, 'bogota');
    
    await cityPage.filterByCategory('music');
    await page.click('[data-testid="event-filter-clear"]');
    
    await expect(page.locator('[data-testid^="event-card"]').first()).toBeVisible();
  });
});
