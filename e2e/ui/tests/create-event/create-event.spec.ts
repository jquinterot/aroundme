import { test, expect } from '@playwright/test';

test.describe('Create Event Flow', () => {
  test('should navigate to create event page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'test@example.com');
    await page.fill('[data-testid="login-password-input"]', 'TestPass123!');
    await page.click('[data-testid="login-submit-button"]');
    
    await page.goto('/create-event');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="create-event-page-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="create-event-title"]')).toContainText('Create New Event');
  });
});

test.describe('Submit Place Flow', () => {
  test('should navigate to submit place page', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'test@example.com');
    await page.fill('[data-testid="login-password-input"]', 'TestPass123!');
    await page.click('[data-testid="login-submit-button"]');
    
    await page.goto('/submit-place');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="submit-place-page-container"]')).toBeVisible();
  });
});
