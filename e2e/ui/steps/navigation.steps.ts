import { Page, expect } from '@playwright/test';

/**
 * Navigation reusable steps
 */

export const NavigationSteps = {
  /**
   * Navigate to city page
   */
  async goToCity(page: Page, citySlug: string): Promise<void> {
    await page.goto(`/${citySlug}`);
    await expect(page.locator('body')).toBeVisible();
  },

  /**
   * Navigate to city events
   */
  async goToCityEvents(page: Page, citySlug: string): Promise<void> {
    await page.goto(`/${citySlug}/events`);
    await expect(page.locator('[data-testid^="event-card"]').first()).toBeVisible({ timeout: 15000 });
  },

  /**
   * Navigate to city places
   */
  async goToCityPlaces(page: Page, citySlug: string): Promise<void> {
    await page.goto(`/${citySlug}/places`);
    await expect(page.locator('[data-testid^="place-card"]').first()).toBeVisible({ timeout: 15000 });
  },

  /**
   * Navigate to city activities
   */
  async goToCityActivities(page: Page, citySlug: string): Promise<void> {
    await page.goto(`/${citySlug}/activities`);
    await expect(page.locator('[data-testid^="activity-card"]').first()).toBeVisible({ timeout: 15000 });
  },

  /**
   * Click tab by label
   */
  async clickTab(page: Page, label: string): Promise<void> {
    await page.click(`button:has-text("${label}")`);
  },

  /**
   * Switch view mode (grid/list/map)
   */
  async switchViewMode(page: Page, mode: 'grid' | 'list' | 'map'): Promise<void> {
    await page.click(`[data-testid="view-mode-${mode}"]`);
  },
};
