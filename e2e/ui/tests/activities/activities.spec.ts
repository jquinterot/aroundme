import { test, expect } from '@playwright/test';

test.describe('Activities Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
  });

  test('should display activity cards', async ({ page }) => {
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await expect(activityCards.first()).toBeVisible({ timeout: 15000 });
    
    const count = await activityCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should filter activities by category', async ({ page }) => {
    await page.click('button:has-text("Classes")');
    await page.waitForTimeout(500);
    
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await expect(activityCards.first()).toBeVisible();
  });

  test('should navigate to activity detail', async ({ page }) => {
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await activityCards.first().click();
    
    await expect(page).toHaveURL(/\/activity\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Activity Detail Page', () => {
  test('should display activity information', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await activityCards.first().click();
    
    await expect(page.locator('[data-testid="activity-detail-page"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="activity-title"]')).toBeVisible();
  });

  test('should display booking section', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await activityCards.first().click();
    
    await expect(page.locator('form')).toBeVisible();
  });
});
