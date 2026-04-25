import { Page, expect } from '@playwright/test';

/**
 * Common reusable test steps for all UI tests
 * 
 * Usage:
 * import { CommonSteps } from '../steps/common.steps';
 * 
 * await CommonSteps.navigateTo(page, '/dashboard');
 * await CommonSteps.verifyElementVisible(page, 'dashboard-page');
 */

export const CommonSteps = {
  /**
   * Navigate to URL and wait for page to be ready
   */
  async navigateTo(page: Page, url: string): Promise<void> {
    await page.goto(url);
    await expect(page.locator('body')).toBeVisible();
  },

  /**
   * Verify page container is visible
   */
  async verifyPageContainer(page: Page, testId: string): Promise<void> {
    await expect(page.getByTestId(testId)).toBeVisible({ timeout: 15000 });
  },

  /**
   * Verify element contains expected text
   */
  async verifyText(page: Page, testId: string, expectedText: string | RegExp): Promise<void> {
    await expect(page.getByTestId(testId)).toContainText(expectedText);
  },

  /**
   * Fill form fields and submit
   */
  async fillAndSubmitForm(
    page: Page,
    fields: Record<string, string>,
    submitTestId: string
  ): Promise<void> {
    for (const [testId, value] of Object.entries(fields)) {
      await page.getByTestId(testId).fill(value);
    }
    await page.getByTestId(submitTestId).click();
  },

  /**
   * Verify URL matches pattern
   */
  async verifyUrl(page: Page, pattern: string | RegExp): Promise<void> {
    await expect(page).toHaveURL(pattern);
  },

  /**
   * Click element by data-testid
   */
  async clickElement(page: Page, testId: string): Promise<void> {
    await page.getByTestId(testId).click();
  },

  /**
   * Select category filter
   */
  async selectCategory(
    page: Page,
    category: string,
    type: 'event' | 'place' | 'activity'
  ): Promise<void> {
    await page.getByTestId(`${type}-filter-category-${category}`).click();
  },

  /**
   * Verify at least N cards are visible
   */
  async verifyCardCount(page: Page, prefix: string, minCount: number): Promise<void> {
    const cards = page.getByTestId(new RegExp(`^${prefix}`));
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  },

  /**
   * Wait for at least N cards to be present using expect.poll
   */
  async waitForCardCount(page: Page, prefix: string, minCount: number): Promise<void> {
    await expect.poll(
      async () => page.getByTestId(new RegExp(`^${prefix}`)).count(),
      { timeout: 5000 }
    ).toBeGreaterThanOrEqual(minCount);
  },

  /**
   * Verify first card is visible
   */
  async verifyFirstCardVisible(page: Page, prefix: string): Promise<void> {
    await expect(page.getByTestId(new RegExp(`^${prefix}`)).first()).toBeVisible({ timeout: 15000 });
  },

  /**
   * Wait for element to be visible
   */
  async waitForElement(page: Page, testId: string, timeout = 5000): Promise<void> {
    await expect(page.getByTestId(testId)).toBeVisible({ timeout });
  },

  /**
   * Verify element has CSS class
   */
  async verifyHasClass(page: Page, testId: string, classPattern: RegExp): Promise<void> {
    await expect(page.getByTestId(testId)).toHaveClass(classPattern);
  },
};
