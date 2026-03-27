import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test('should display profile page when authenticated', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('[data-testid="login-email-input"]', 'test@example.com');
    await page.fill('[data-testid="login-password-input"]', 'TestPass123!');
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 }).catch(() => {});
    
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test('should display dashboard when authenticated', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('[data-testid="login-email-input"]', 'test@example.com');
    await page.fill('[data-testid="login-password-input"]', 'TestPass123!');
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 }).catch(() => {});
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });
});
