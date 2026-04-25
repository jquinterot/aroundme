import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object Model
 * All page objects should extend this class
 */
export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '/') {
    this.page = page;
    this.url = url;
  }

  /**
   * Navigate to the page URL
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector('body', { state: 'visible' });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  /**
   * Click on element
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill input field
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Get text content of element
   */
  async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text ?? '';
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Take screenshot
   */
  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}
