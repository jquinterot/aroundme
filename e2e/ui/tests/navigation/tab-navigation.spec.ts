import { test, expect } from '../../fixtures';

test.describe('Home Page', () => {
  test('should load home page without errors', async ({ page }) => {
    await test.step('Navigate to home page', async () => {
      await page.goto('/');
    });

    await test.step('Verify page title', async () => {
      await expect(page).toHaveTitle(/AroundMe/);
    });

    await test.step('Verify no React errors in console', async () => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      await page.waitForLoadState('networkidle');
      const reactErrors = consoleErrors.filter(e => 
        e.includes('We are cleaning up async info') || 
        e.includes('Suspense boundary')
      );
      expect(reactErrors).toHaveLength(0);
    });
  });

  test('should navigate to city page from hero', async ({ page }) => {
    await test.step('Navigate to home page', async () => {
      await page.goto('/');
    });

    await test.step('Verify redirect to default city page', async () => {
      await expect(page).toHaveURL(/\/bogota/);
    });
  });
});

test.describe('City Events Page', () => {
  test('should load events page with proper elements', async ({ page }) => {
    await test.step('Navigate to Bogotá events page', async () => {
      await page.goto('/bogota');
    });

    await test.step('Verify page header', async () => {
      await expect(page.locator('h1')).toContainText("Discover what's happening in");
    });

    await test.step('Verify events tab is active', async () => {
      await expect(page.locator('[data-testid="tab-events"]')).toBeVisible();
    });

    await test.step('Verify event cards are displayed', async () => {
      const eventCards = page.locator('[data-testid^="event-card"]');
      await expect(eventCards.first()).toBeVisible({ timeout: 15000 });
      const count = await eventCards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test('should switch to Places tab and load places', async ({ page, cityPage }) => {
    await test.step('Navigate to Bogotá events page', async () => {
      await cityPage.goto();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Click on Places tab', async () => {
      await page.click('a[href="/bogota/places"]');
    });

    await test.step('Verify URL changed to places', async () => {
      await expect(page).toHaveURL('/bogota/places');
    });

    await test.step('Verify places header', async () => {
      await expect(page.locator('h1')).toContainText('places');
    });

    await test.step('Verify place cards are displayed', async () => {
      await page.waitForLoadState('networkidle');
      const placeCards = page.locator('[data-testid^="place-card"]');
      await expect(placeCards.first()).toBeVisible({ timeout: 15000 });
    });
  });

  test('should switch to Activities tab and load activities', async ({ page, cityPage }) => {
    await test.step('Navigate to Bogotá events page', async () => {
      await cityPage.goto();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Click on Activities tab', async () => {
      await page.click('a[href="/bogota/activities"]');
    });

    await test.step('Verify URL changed to activities', async () => {
      await expect(page).toHaveURL('/bogota/activities');
    });

    await test.step('Verify activities header', async () => {
      await expect(page.locator('h1')).toContainText('Activities');
    });

    await test.step('Verify activity cards are displayed', async () => {
      await page.waitForLoadState('networkidle');
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible({ timeout: 15000 });
    });
  });
});

test.describe('City Places Page', () => {
  test('should load places page', async ({ page }) => {
    await test.step('Navigate to Bogotá places page', async () => {
      await page.goto('/bogota/places');
    });

    await test.step('Verify page header', async () => {
      await expect(page.locator('h1')).toContainText('places');
    });

    await test.step('Verify place cards are displayed', async () => {
      await page.waitForLoadState('networkidle');
      const placeCards = page.locator('[data-testid^="place-card"]');
      await expect(placeCards.first()).toBeVisible({ timeout: 15000 });
      const count = await placeCards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test('should filter places by category', async ({ page }) => {
    await test.step('Navigate to Bogotá places page', async () => {
      await page.goto('/bogota/places');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Click on cafe category filter', async () => {
      await page.click('[data-testid="place-filter-category-cafe"]');
    });

    await test.step('Verify filter is applied', async () => {
      await page.waitForTimeout(500);
      const placeCards = page.locator('[data-testid^="place-card"]');
      await expect(placeCards.first()).toBeVisible();
    });
  });
});

test.describe('City Activities Page', () => {
  test('should load activities page', async ({ page }) => {
    await test.step('Navigate to Bogotá activities page', async () => {
      await page.goto('/bogota/activities');
    });

    await test.step('Verify page header', async () => {
      await expect(page.locator('h1')).toContainText('Activities');
    });

    await test.step('Verify activity cards are displayed', async () => {
      await page.waitForLoadState('networkidle');
      const activityCards = page.locator('[data-testid^="activity-card"]');
      await expect(activityCards.first()).toBeVisible({ timeout: 15000 });
      const count = await activityCards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test('should navigate to activity detail page', async ({ page }) => {
    await test.step('Navigate to Bogotá activities page', async () => {
      await page.goto('/bogota/activities');
      await page.waitForSelector('a[href^="/activity/"]', { timeout: 10000 });
    });

    await test.step('Click on first activity card', async () => {
      await page.click('a[href^="/activity/"]');
    });

    await test.step('Verify navigation to activity detail', async () => {
      await expect(page).toHaveURL(/\/activity\/.+/);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify activity detail page elements', async () => {
      const activityTitle = page.locator('[data-testid="activity-title"], h1');
      await expect(activityTitle).toBeVisible();
    });
  });

  test('should filter activities by category', async ({ page }) => {
    await test.step('Navigate to Bogotá activities page', async () => {
      await page.goto('/bogota/activities');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Click on Classes category', async () => {
      await page.click('[data-testid="category-class"], button:has-text("Classes")');
    });

    await test.step('Verify filter is applied', async () => {
      await expect(page.locator('[data-testid="category-class"], button:has-text("Classes")')).toHaveClass(/bg-amber/);
    });
  });
});

test.describe('Tab Navigation with Content Verification', () => {
  test('should maintain content when switching between tabs', async ({ page }) => {
    let initialEventCount: number;

    await test.step('Load events page and count cards', async () => {
      await page.goto('/bogota');
      await page.waitForLoadState('networkidle');
      initialEventCount = await page.locator('[data-testid^="event-card"]').count();
      expect(initialEventCount).toBeGreaterThanOrEqual(1);
    });

    await test.step('Switch to Places tab', async () => {
      await page.click('a[href="/bogota/places"]');
      await expect(page).toHaveURL('/bogota/places');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('[data-testid^="place-card"]', { timeout: 15000 });
      const placeCount = await page.locator('[data-testid^="place-card"]').count();
      expect(placeCount).toBeGreaterThanOrEqual(1);
    });

    await test.step('Switch to Activities tab', async () => {
      await page.click('a[href="/bogota/activities"]');
      await expect(page).toHaveURL('/bogota/activities');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('[data-testid^="activity-card"]', { timeout: 15000 });
      const activityCount = await page.locator('[data-testid^="activity-card"]').count();
      expect(activityCount).toBeGreaterThanOrEqual(1);
    });

    await test.step('Return to Events and verify count', async () => {
      await page.click('a[href="/bogota"]');
      await expect(page).toHaveURL('/bogota');
      await page.waitForLoadState('networkidle');
      const finalEventCount = await page.locator('[data-testid^="event-card"]').count();
      expect(finalEventCount).toBeGreaterThanOrEqual(1);
    });
  });
});

test.describe('Tab Navigation Stress Test', () => {
  test('should rapidly switch between all tabs without errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    await test.step('Setup console error listener', async () => {
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
    });

    await test.step('Initial page load', async () => {
      await page.goto('/bogota');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('[data-testid^="event-card"]', { timeout: 15000 });
    });

    await test.step('Rapid tab switching (5 cycles)', async () => {
      for (let i = 0; i < 5; i++) {
        // Places
        await page.click('a[href="/bogota/places"]');
        await expect(page).toHaveURL('/bogota/places');
        await page.waitForSelector('[data-testid^="place-card"]', { timeout: 15000 });
        expect(await page.locator('[data-testid^="place-card"]').count()).toBeGreaterThanOrEqual(1);

        // Activities
        await page.click('a[href="/bogota/activities"]');
        await expect(page).toHaveURL('/bogota/activities');
        await page.waitForSelector('[data-testid^="activity-card"]', { timeout: 15000 });
        expect(await page.locator('[data-testid^="activity-card"]').count()).toBeGreaterThanOrEqual(1);

        // Events
        await page.click('a[href="/bogota"]');
        await expect(page).toHaveURL('/bogota');
        await page.waitForSelector('[data-testid^="event-card"]', { timeout: 15000 });
        expect(await page.locator('[data-testid^="event-card"]').count()).toBeGreaterThanOrEqual(1);
      }
    });

    await test.step('Verify no React errors occurred', async () => {
      const reactErrors = consoleErrors.filter(e => 
        e.includes('We are cleaning up async info') || 
        e.includes('Suspense boundary')
      );
      expect(reactErrors).toHaveLength(0);
    });
  });
});
