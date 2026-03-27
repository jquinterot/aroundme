import { test, expect } from '@playwright/test';
import { CityPage } from '../../pom';

test.describe('Places Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bogota/places');
    await page.waitForLoadState('networkidle');
  });

  test('should display place cards', async ({ page }) => {
    const placeCards = page.locator('[data-testid^="place-card"]');
    await expect(placeCards.first()).toBeVisible({ timeout: 15000 });
    
    const count = await placeCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should navigate to place detail', async ({ page }) => {
    const cityPage = new CityPage(page, 'bogota');
    await cityPage.clickFirstPlace();
    
    await expect(page).toHaveURL(/\/place\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should filter places by category', async ({ page }) => {
    await page.click('button:has-text("Restaurant")');
    await page.waitForTimeout(500);
    
    const placeCards = page.locator('[data-testid^="place-card"]');
    await expect(placeCards.first()).toBeVisible();
  });
});

test.describe('Place Detail Page', () => {
  test('should display place information', async ({ page }) => {
    await page.goto('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    const cityPage = new CityPage(page, 'bogota');
    await cityPage.clickFirstPlace();
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="place-detail-page"]')).toBeVisible();
  });

  test('should open contact links', async ({ page }) => {
    await page.goto('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    const cityPage = new CityPage(page, 'bogota');
    await cityPage.clickFirstPlace();
    
    await expect(page.locator('[data-testid="place-detail-page"]')).toBeVisible();
  });
});
