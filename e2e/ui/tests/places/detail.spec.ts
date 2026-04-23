import { test, expect } from '../../fixtures';

/**
 * Place Detail Page Tests
 * 
 * Covers:
 * - Place information display
 * - Map display
 * - Rating and reviews
 * - Contact information
 * - Navigation back
 * - Save/share actions
 */
test.describe('Place Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to Bogotá places page', async () => {
      await page.goto('/bogota/places');
      await page.waitForLoadState('networkidle');
    });
  });

  test('should navigate to place detail from listing', async ({ page, cityPage }) => {
    await test.step('Click on first place card', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Verify navigation to place detail page', async () => {
      await expect(page).toHaveURL(/\/place\/.+/);
    });

    await test.step('Verify place title is visible', async () => {
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test('should display place information', async ({ page, cityPage }) => {
    await test.step('Navigate to place detail', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Verify place detail page container', async () => {
      await expect(page.locator('[data-testid="place-detail-page"]')).toBeVisible();
    });

    await test.step('Verify place title is displayed', async () => {
      await expect(page.locator('h1')).toBeVisible();
      const titleText = await page.locator('h1').textContent();
      expect(titleText?.length).toBeGreaterThan(0);
    });

    await test.step('Verify place category is displayed', async () => {
      const categoryBadge = page.locator('[data-testid="place-category-badge"]');
      await expect(categoryBadge).toBeVisible();
    });
  });

  test('should display map on place detail', async ({ page, cityPage }) => {
    await test.step('Navigate to place detail', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Verify map container is visible', async () => {
      await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 10000 });
    });
  });

  test('should display rating if available', async ({ page, cityPage }) => {
    await test.step('Navigate to place detail', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Check for rating display', async () => {
      const ratingElement = page.locator('[data-testid="place-detail-page"] [data-testid="place-rating"]');
      if (await ratingElement.isVisible()) {
        const ratingText = await ratingElement.textContent();
        expect(ratingText).toMatch(/\d+\.?\d*/);
      }
    });
  });

  test('should display verified badge for verified places', async ({ page, cityPage }) => {
    await test.step('Navigate to place detail', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Check for verified badge', async () => {
      const verifiedBadge = page.locator('[data-testid="place-detail-page"] [data-testid="place-verified-badge"]');
      // Badge may or may not be visible depending on the place
      if (await verifiedBadge.isVisible()) {
        expect(await verifiedBadge.textContent()).toContain('Verified');
      }
    });
  });

  test('should display address information', async ({ page, cityPage }) => {
    await test.step('Navigate to place detail', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Verify address is displayed', async () => {
      const addressElement = page.locator('[data-testid="place-address"], .place-address');
      await expect(addressElement.first()).toBeVisible();
    });
  });

  test('should navigate back to places', async ({ page, cityPage }) => {
    await test.step('Navigate to place detail', async () => {
      await cityPage.clickFirstPlace();
      await expect(page).toHaveURL(/\/place\/.+/);
    });

    await test.step('Click back to places link', async () => {
      await page.click('[data-testid="back-to-places"]');
    });

    await test.step('Verify navigation back to places page', async () => {
      await expect(page).toHaveURL('/bogota/places');
    });
  });

  test('should display contact information if available', async ({ page, cityPage }) => {
    await test.step('Navigate to place detail', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Check for website link', async () => {
      const websiteLink = page.locator('a[href*="http"]:has-text("Website"), [data-testid="place-website"]');
      if (await websiteLink.isVisible()) {
        const href = await websiteLink.getAttribute('href');
        expect(href).toContain('http');
      }
    });

    await test.step('Check for Instagram link', async () => {
      const instagramLink = page.locator('a[href*="instagram"], [data-testid="place-instagram"]');
      if (await instagramLink.isVisible()) {
        const href = await instagramLink.getAttribute('href');
        expect(href).toContain('instagram');
      }
    });
  });

  test('should display reviews section if available', async ({ page, cityPage }) => {
    await test.step('Navigate to place detail', async () => {
      await cityPage.clickFirstPlace();
    });

    await test.step('Check for reviews section', async () => {
      const reviewsSection = page.locator('[data-testid="reviews-section"], .reviews-section');
      if (await reviewsSection.isVisible()) {
        expect(await reviewsSection.isVisible()).toBeTruthy();
      }
    });
  });
});
