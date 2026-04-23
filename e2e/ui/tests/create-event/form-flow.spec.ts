import { test, expect } from '../../fixtures';

test.describe('Create Event Flow', () => {
  test('should navigate to create event page', async ({ page }) => {
    await page.goto('/create-event');
    await expect(page.locator('[data-testid="create-event-basic-info"]')).toBeVisible();
  });

  test('should display all form fields in basic info step', async ({ page }) => {
    await page.goto('/create-event');
    
    await expect(page.locator('[data-testid="event-title-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-city-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-category"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-description-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-basic-next-button"]')).toBeVisible();
  });

  test('should show category options', async ({ page }) => {
    await page.goto('/create-event');
    
    // Click on a category option
    await expect(page.locator('[data-testid="event-category-music"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-category-food"]')).toBeVisible();
    await expect(page.locator('[data-testid="event-category-sports"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/create-event');
    
    // Try to click continue without filling fields
    const nextButton = page.locator('[data-testid="event-basic-next-button"]');
    await expect(nextButton).toBeDisabled();
  });

  test('should fill basic info and continue to datetime step', async ({ page }) => {
    await page.goto('/create-event');
    
    // Fill in the form
    await page.fill('[data-testid="event-title-input"]', 'Test Event');
    // Click on mantine select to open dropdown and select Bogotá
    await page.click('[data-testid="event-city-select"]');
    await page.click('text=Bogotá');
    await page.click('[data-testid="event-category-music"]');
    await page.fill('[data-testid="event-description-input"]', 'This is a test event description');
    
    // Click continue
    await page.click('[data-testid="event-basic-next-button"]');
    
    // Should see datetime step
    await expect(page.locator('[data-testid="create-event-datetime"]')).toBeVisible();
  });
});
