import { test, expect } from '../../fixtures';

test.describe('Profile Page', () => {
  test('should display profile page when authenticated', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('[data-testid="login-email-input"]')).toBeVisible();

    await page.fill('[data-testid="login-email-input"]', 'admin@aroundme.co');
    await page.fill('[data-testid="login-password-input"]', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 }).catch(() => {});

    await page.goto('/profile');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Dashboard', () => {
  test('should display dashboard when authenticated', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('[data-testid="login-email-input"]')).toBeVisible();

    await page.fill('[data-testid="login-email-input"]', 'admin@aroundme.co');
    await page.fill('[data-testid="login-password-input"]', 'admin123');
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 }).catch(() => {});

    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible({ timeout: 15000 });
  });
});
