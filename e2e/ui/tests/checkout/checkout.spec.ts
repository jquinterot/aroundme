import { test, expect } from '@playwright/test';

test.describe('Checkout Success/Cancel', () => {
  test('should display cancel page', async ({ page }) => {
    await page.goto('/checkout/cancel');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="checkout-cancel-page-container"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Payment Cancelled');
  });
});
