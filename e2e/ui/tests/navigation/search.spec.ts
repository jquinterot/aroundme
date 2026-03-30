import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should display search bar in header', async ({ page }) => {
    await page.goto('/bogota');
    
    await expect(page.locator('[data-testid="search-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
  });

  test('should type in search input', async ({ page }) => {
    await page.goto('/bogota');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('coffee');
    
    await expect(searchInput).toHaveValue('coffee');
  });

  test('should show clear button when text is entered', async ({ page }) => {
    await page.goto('/bogota');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('test');
    
    await expect(page.locator('[data-testid="search-clear-button"]')).toBeVisible();
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    await page.goto('/bogota');
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('test');
    
    await page.click('[data-testid="search-clear-button"]');
    
    await expect(searchInput).toHaveValue('');
  });
});
