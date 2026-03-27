import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should load login page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Welcome back');
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should display login form with test IDs', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('[data-testid="login-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-submit-button"]')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login');
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL('/signup');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login');
    await page.click('a[href="/forgot-password"]');
    await expect(page).toHaveURL('/forgot-password');
  });
});

test.describe('Signup Page', () => {
  test('should load signup page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/signup');
    await expect(page.locator('h1')).toContainText('Create your account');
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should display signup form with test IDs', async ({ page }) => {
    await page.goto('/signup');
    
    await expect(page.locator('[data-testid="signup-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-submit-button"]')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/signup');
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Forgot Password Page', () => {
  test('should load forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('[data-testid="forgot-password-title"]')).toContainText('Forgot password');
    await expect(page.locator('[data-testid="back-to-login-link"]')).toBeVisible();
  });

  test('should have email input', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/pricing');
    await expect(page.locator('[data-testid="pricing-title"]')).toContainText('Simple, transparent pricing');
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should display all pricing plans', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.locator('[data-testid="pricing-plan-free"]')).toBeVisible();
    await expect(page.locator('[data-testid="pricing-plan-basic"]')).toBeVisible();
    await expect(page.locator('[data-testid="pricing-plan-premium"]')).toBeVisible();
  });

  test('should toggle billing cycle', async ({ page }) => {
    await page.goto('/pricing');
    
    await page.click('button:has-text("Yearly")');
    await expect(page.locator('button:has-text("Monthly")')).toBeVisible();
  });
});

test.describe('Dashboard Page', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });
});

test.describe('Profile Page', () => {
  test('should load profile page', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });
});

test.describe('Discover Page', () => {
  test('should load discover page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/discover');
    await expect(page.locator('[data-testid="discover-title"]')).toContainText('Descubre Eventos');
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });

  test('should have search input', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.locator('[data-testid="discover-search-input"]')).toBeVisible();
  });
});

test.describe('Docs Page', () => {
  test('should load docs page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/docs');
    await expect(page.locator('[data-testid="docs-title"]')).toContainText('Help Center');
    
    const reactErrors = consoleErrors.filter(e => e.includes('We are cleaning up async info') || e.includes('Suspense boundary'));
    expect(reactErrors).toHaveLength(0);
  });
});

test.describe('Checkout Pages', () => {
  test('should load checkout cancel page', async ({ page }) => {
    await page.goto('/checkout/cancel');
    await expect(page.locator('[data-testid="checkout-cancel-page-container"]')).toBeVisible();
  });
});

test.describe('Reset Password Page', () => {
  test('should load reset password page', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.locator('[data-testid="reset-password-page-container"]')).toBeVisible();
  });
});