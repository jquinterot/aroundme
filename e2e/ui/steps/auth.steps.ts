import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';

/**
 * Authentication reusable steps
 * 
 * Usage:
 * import { AuthSteps } from '../steps/auth.steps';
 * 
 * await AuthSteps.loginAsAdmin(page);
 * await AuthSteps.verifyAuthenticated(page);
 */

export interface TestUser {
  email: string;
  password: string;
  name?: string;
}

export const AuthSteps = {
  /**
   * Login as admin user
   */
  async loginAsAdmin(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin@aroundme.co', 'admin123');
    await page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 }).catch(() => {});
  },

  /**
   * Login as specific user
   */
  async loginAs(page: Page, user: TestUser): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.locator('[data-testid="login-email-input"]')).toBeVisible();
    await page.fill('[data-testid="login-email-input"]', user.email);
    await page.fill('[data-testid="login-password-input"]', user.password);
    await page.click('[data-testid="login-submit-button"]');
    await page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 }).catch(() => {});
  },

  /**
   * Verify user is on dashboard or home
   */
  async verifyAuthenticated(page: Page): Promise<void> {
    await expect(page).toHaveURL(/\/(dashboard|bogota)/, { timeout: 10000 });
  },

  /**
   * Logout current user
   */
  async logout(page: Page): Promise<void> {
    await page.goto('/logout');
    await page.waitForURL('/login', { timeout: 5000 }).catch(() => {});
  },

  /**
   * Clear all browser state
   */
  async clearState(page: Page): Promise<void> {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  },
};
