import { Page, expect, test } from '@playwright/test';
import { TestUser } from '../types';

/**
 * Test Utilities
 * 
 * Best Practices Applied:
 * - Reusable authentication helper
 * - Consistent wait strategies
 * - Error handling utilities
 * - Data cleanup helpers
 */

/**
 * Authenticate user and return session
 */
export async function authenticateUser(page: Page, user: TestUser): Promise<void> {
  await test.step('Authenticate user', async () => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('[data-testid="login-email-input"]', user.email);
    await page.fill('[data-testid="login-password-input"]', user.password);
    await page.click('[data-testid="login-submit-button"]');
    
    // Wait for navigation to dashboard or home
    await page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 });
  });
}

/**
 * Clear browser storage and cookies
 */
export async function clearBrowserState(page: Page): Promise<void> {
  try {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch {
    // Ignore errors on about:blank or other special pages
  }
}

/**
 * Wait for element with retry logic
 */
export async function waitForElementWithRetry(
  page: Page,
  selector: string,
  options: { timeout?: number; retries?: number } = {}
): Promise<void> {
  const { timeout = 5000, retries = 3 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForSelector(selector, { timeout: timeout / retries });
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await page.waitForTimeout(500);
    }
  }
}

/**
 * Check if element exists without failing
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return page.locator(selector).count().then(count => count > 0);
}

/**
 * Get element text safely
 */
export async function getElementText(page: Page, selector: string): Promise<string> {
  const locator = page.locator(selector);
  if (await locator.count() === 0) return '';
  const text = await locator.textContent();
  return text ?? '';
}

/**
 * Fill form fields from object
 */
export async function fillForm(page: Page, fields: Record<string, string>): Promise<void> {
  for (const [selector, value] of Object.entries(fields)) {
    await page.fill(selector, value);
  }
}

/**
 * Verify toast notification
 */
export async function verifyToast(page: Page, expectedText: string): Promise<void> {
  const toast = page.locator('[data-testid="toast-notification"], .toast, [role="alert"]');
  await expect(toast).toContainText(expectedText, { timeout: 5000 });
}

/**
 * Take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `./test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Retry action with exponential backoff
 */
export async function retryWithBackoff<T>(
  action: () => Promise<T>,
  options: { maxRetries?: number; baseDelay?: number } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000 } = options;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await action();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, i)));
    }
  }
  
  throw new Error('Retry failed');
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string): Promise<void> {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, selector);
  await page.waitForTimeout(300);
}

/**
 * Wait for network idle with timeout
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 10000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Check console errors
 */
export function setupConsoleErrorListener(page: Page): string[] {
  const consoleErrors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  return consoleErrors;
}

/**
 * Assert no React errors
 */
export function assertNoReactErrors(consoleErrors: string[]): void {
  const reactErrors = consoleErrors.filter(e => 
    e.includes('We are cleaning up async info') || 
    e.includes('Suspense boundary')
  );
  
  if (reactErrors.length > 0) {
    console.error('React errors found:', reactErrors);
  }
  
  expect(reactErrors).toHaveLength(0);
}

/**
 * Generate random string
 */
export function randomString(length: number = 8): string {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Generate timestamped email
 */
export function generateTestEmail(prefix: string = 'test'): string {
  return `${prefix}${Date.now()}${randomString(4)}@example.com`;
}

// Re-export test from playwright for step usage
export { test } from '@playwright/test';
