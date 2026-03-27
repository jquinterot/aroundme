import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/AroundMe/);
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should navigate to city page from hero', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Bogotá")');
    await expect(page).toHaveURL(/\/bogota/);
  });
});

test.describe('City Events Page', () => {
  test('should load events page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/bogota');
    await expect(page.locator('h1')).toContainText("Discover what's happening in");
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should display at least one event card', async ({ page }) => {
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    
    const eventCards = page.locator('[data-testid^="event-card"]');
    await expect(eventCards.first()).toBeVisible({ timeout: 15000 });
    const count = await eventCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should switch to Places tab and load places', async ({ page }) => {
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/places"]');
    await expect(page).toHaveURL('/bogota/places');
    await expect(page.locator('h1')).toContainText('places');
    
    await page.waitForLoadState('networkidle');
    const placeCards = page.locator('[data-testid^="place-card"]');
    await expect(placeCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('should switch to Activities tab and load activities', async ({ page }) => {
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/activities"]');
    await expect(page).toHaveURL('/bogota/activities');
    await expect(page.locator('h1')).toContainText('Activities');
    
    await page.waitForLoadState('networkidle');
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await expect(activityCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('should load events after switching tabs', async ({ page }) => {
    await page.goto('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota"]');
    await expect(page).toHaveURL('/bogota');
    
    await page.waitForLoadState('networkidle');
    const eventCards = page.locator('[data-testid^="event-card"]');
    await expect(eventCards.first()).toBeVisible({ timeout: 15000 });
    const count = await eventCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('City Places Page', () => {
  test('should load places page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/bogota/places');
    await expect(page.locator('h1')).toContainText('places');
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should display at least one place card', async ({ page }) => {
    await page.goto('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    const placeCards = page.locator('[data-testid^="place-card"]');
    await expect(placeCards.first()).toBeVisible({ timeout: 15000 });
    const count = await placeCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should switch to Events tab and load events', async ({ page }) => {
    await page.goto('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota"]');
    await expect(page).toHaveURL('/bogota');
    
    await page.waitForLoadState('networkidle');
    const eventCards = page.locator('[data-testid^="event-card"]');
    await expect(eventCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('should switch to Activities tab and load activities', async ({ page }) => {
    await page.goto('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/activities"]');
    await expect(page).toHaveURL('/bogota/activities');
    
    await page.waitForLoadState('networkidle');
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await expect(activityCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('should load places after switching tabs', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/places"]');
    await expect(page).toHaveURL('/bogota/places');
    
    await page.waitForLoadState('networkidle');
    const placeCards = page.locator('[data-testid^="place-card"]');
    await expect(placeCards.first()).toBeVisible({ timeout: 15000 });
    const count = await placeCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('City Activities Page', () => {
  test('should load activities page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/bogota/activities');
    await expect(page.locator('h1')).toContainText('Activities');
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should display at least one activity card', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await expect(activityCards.first()).toBeVisible({ timeout: 15000 });
    const count = await activityCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should switch to Events tab and load events', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota"]');
    await expect(page).toHaveURL('/bogota');
    
    await page.waitForLoadState('networkidle');
    const eventCards = page.locator('[data-testid^="event-card"]');
    await expect(eventCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('should switch to Places tab and load places', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/places"]');
    await expect(page).toHaveURL('/bogota/places');
    
    await page.waitForLoadState('networkidle');
    const placeCards = page.locator('[data-testid^="place-card"]');
    await expect(placeCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('should filter activities by category', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Classes")');
    await expect(page.locator('button:has-text("Classes")')).toHaveClass(/bg-amber-600/);
  });

  test('should navigate to activity detail page', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForSelector('a[href^="/activity/"]', { timeout: 10000 });
    
    await page.click('a[href^="/activity/"]');
    await expect(page).toHaveURL(/\/activity\/.+/);
    await page.waitForLoadState('networkidle');
  });

  test('should load activities after switching tabs', async ({ page }) => {
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/activities"]');
    await expect(page).toHaveURL('/bogota/activities');
    
    await page.waitForLoadState('networkidle');
    const activityCards = page.locator('[data-testid^="activity-card"]');
    await expect(activityCards.first()).toBeVisible({ timeout: 15000 });
    const count = await activityCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Activity Detail Page', () => {
  test('should load activity detail from activities list', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('We are cleaning up async info') && !text.includes('Suspense boundary')) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto('/bogota/activities');
    await page.waitForSelector('a[href^="/activity/"]', { timeout: 10000 });
    
    await page.click('a[href^="/activity/"]');
    await expect(page).toHaveURL(/\/activity\/.+/);
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const activityTitle = page.locator('h1');
    await expect(activityTitle).not.toHaveText('Activity not found', { timeout: 5000 });
    
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    }
    expect(consoleErrors.filter(e => e.includes('Failed to fetch'))).toHaveLength(0);
  });
});

test.describe('Tab Navigation with Content Verification', () => {
  test('should maintain events after switching between Places and Activities', async ({ page }) => {
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    
    const initialEventCount = await page.locator('[data-testid^="event-card"]').count();
    expect(initialEventCount).toBeGreaterThanOrEqual(1);
    
    await page.click('a[href="/bogota/places"]');
    await expect(page).toHaveURL('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/activities"]');
    await expect(page).toHaveURL('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota"]');
    await expect(page).toHaveURL('/bogota');
    await page.waitForLoadState('networkidle');
    
    const finalEventCount = await page.locator('[data-testid^="event-card"]').count();
    expect(finalEventCount).toBeGreaterThanOrEqual(1);
  });

  test('should maintain places after switching between Events and Activities', async ({ page }) => {
    await page.goto('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    const initialPlaceCount = await page.locator('[data-testid^="place-card"]').count();
    expect(initialPlaceCount).toBeGreaterThanOrEqual(1);
    
    await page.click('a[href="/bogota"]');
    await expect(page).toHaveURL('/bogota');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/activities"]');
    await expect(page).toHaveURL('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/places"]');
    await expect(page).toHaveURL('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    const finalPlaceCount = await page.locator('[data-testid^="place-card"]').count();
    expect(finalPlaceCount).toBeGreaterThanOrEqual(1);
  });

  test('should maintain activities after switching between Events and Places', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    const initialActivityCount = await page.locator('[data-testid^="activity-card"]').count();
    expect(initialActivityCount).toBeGreaterThanOrEqual(1);
    
    await page.click('a[href="/bogota"]');
    await expect(page).toHaveURL('/bogota');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/places"]');
    await expect(page).toHaveURL('/bogota/places');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="/bogota/activities"]');
    await expect(page).toHaveURL('/bogota/activities');
    await page.waitForLoadState('networkidle');
    
    const finalActivityCount = await page.locator('[data-testid^="activity-card"]').count();
    expect(finalActivityCount).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Tab Navigation Stress Test', () => {
  test('should rapidly switch between all tabs without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid^="event-card"]', { timeout: 15000 });

    for (let i = 0; i < 5; i++) {
      await page.click('a[href="/bogota/places"]');
      await expect(page).toHaveURL('/bogota/places');
      await page.waitForSelector('[data-testid^="place-card"]', { timeout: 15000 });
      
      const placeCount = await page.locator('[data-testid^="place-card"]').count();
      expect(placeCount).toBeGreaterThanOrEqual(1);

      await page.click('a[href="/bogota/activities"]');
      await expect(page).toHaveURL('/bogota/activities');
      await page.waitForSelector('[data-testid^="activity-card"]', { timeout: 15000 });
      
      const activityCount = await page.locator('[data-testid^="activity-card"]').count();
      expect(activityCount).toBeGreaterThanOrEqual(1);

      await page.click('a[href="/bogota"]');
      await expect(page).toHaveURL('/bogota');
      await page.waitForSelector('[data-testid^="event-card"]', { timeout: 15000 });
      
      const eventCount = await page.locator('[data-testid^="event-card"]').count();
      expect(eventCount).toBeGreaterThanOrEqual(1);
    }

    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should visit all three tabs in sequence and verify content', async ({ page }) => {
    await page.goto('/bogota');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid^="event-card"]', { timeout: 15000 });
    
    await page.click('a[href="/bogota/places"]');
    await expect(page).toHaveURL('/bogota/places');
    await page.waitForSelector('[data-testid^="place-card"]', { timeout: 15000 });
    const placeCount = await page.locator('[data-testid^="place-card"]').count();
    expect(placeCount).toBeGreaterThanOrEqual(1);
    
    await page.click('a[href="/bogota/activities"]');
    await expect(page).toHaveURL('/bogota/activities');
    await page.waitForSelector('[data-testid^="activity-card"]', { timeout: 15000 });
    const activityCount = await page.locator('[data-testid^="activity-card"]').count();
    expect(activityCount).toBeGreaterThanOrEqual(1);
    
    await page.click('a[href="/bogota"]');
    await expect(page).toHaveURL('/bogota');
    await page.waitForSelector('[data-testid^="event-card"]', { timeout: 15000 });
    const eventCount = await page.locator('[data-testid^="event-card"]').count();
    expect(eventCount).toBeGreaterThanOrEqual(1);
  });

  test('should visit all three tabs in reverse sequence and verify content', async ({ page }) => {
    await page.goto('/bogota/activities');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid^="activity-card"]', { timeout: 15000 });
    
    await page.click('a[href="/bogota/places"]');
    await expect(page).toHaveURL('/bogota/places');
    await page.waitForSelector('[data-testid^="place-card"]', { timeout: 15000 });
    const placeCount = await page.locator('[data-testid^="place-card"]').count();
    expect(placeCount).toBeGreaterThanOrEqual(1);
    
    await page.click('a[href="/bogota"]');
    await expect(page).toHaveURL('/bogota');
    await page.waitForSelector('[data-testid^="event-card"]', { timeout: 15000 });
    const eventCount = await page.locator('[data-testid^="event-card"]').count();
    expect(eventCount).toBeGreaterThanOrEqual(1);
    
    await page.click('a[href="/bogota/activities"]');
    await expect(page).toHaveURL('/bogota/activities');
    await page.waitForSelector('[data-testid^="activity-card"]', { timeout: 15000 });
    const activityCount = await page.locator('[data-testid^="activity-card"]').count();
    expect(activityCount).toBeGreaterThanOrEqual(1);
  });
});