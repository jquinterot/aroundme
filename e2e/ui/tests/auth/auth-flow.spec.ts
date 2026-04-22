import { test, expect } from '../../fixtures';

test.describe('Login Flow', () => {
  test('should display login page elements', async ({ page, loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Verify page title', async () => {
      await expect(loginPage.title).toContainText('Welcome back');
    });

    await test.step('Verify form elements are present', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });

    await test.step('Verify OAuth buttons are present', async () => {
      await expect(page.locator('[data-testid="google-oauth-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="github-oauth-button"]')).toBeVisible();
    });

    await test.step('Verify navigation links are present', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.signupLink).toBeVisible();
    });
  });

  test('should show error for invalid credentials', async ({ page, loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Fill invalid credentials', async () => {
      await loginPage.login('invalid@example.com', 'wrongpassword');
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    });
  });

  test('should login with valid credentials', async ({ page, loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Fill valid credentials', async () => {
      await loginPage.login('admin@aroundme.co', 'admin123');
    });

    await test.step('Verify redirect to dashboard', async () => {
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    });
  });

  test('should navigate to forgot password page', async ({ page, loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Click forgot password link', async () => {
      await loginPage.navigateToForgotPassword();
    });

    await test.step('Verify navigation to forgot password page', async () => {
      await expect(page).toHaveURL('/forgot-password');
    });
  });

  test('should navigate to signup page', async ({ page, loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Click signup link', async () => {
      await loginPage.navigateToSignup();
    });

    await test.step('Verify navigation to signup page', async () => {
      await expect(page).toHaveURL('/signup');
    });
  });
});

test.describe('Signup Flow', () => {
  test('should display signup page elements', async ({ signupPage }) => {
    await test.step('Navigate to signup page', async () => {
      await signupPage.goto();
    });

    await test.step('Verify page title', async () => {
      await expect(signupPage.title).toBeVisible();
    });

    await test.step('Verify form elements are present', async () => {
      await expect(signupPage.nameInput).toBeVisible();
      await expect(signupPage.emailInput).toBeVisible();
      await expect(signupPage.passwordInput).toBeVisible();
      await expect(signupPage.submitButton).toBeVisible();
    });

    await test.step('Verify login link is present', async () => {
      await expect(signupPage.loginLink).toBeVisible();
    });
  });
});

test.describe('Forgot Password Flow', () => {
  test('should display forgot password page', async ({ page }) => {
    await test.step('Navigate to forgot password page', async () => {
      await page.goto('/forgot-password');
    });

    await test.step('Verify page title', async () => {
      await expect(page.locator('[data-testid="forgot-password-title"]')).toContainText('Forgot password');
    });

    await test.step('Verify email input is present', async () => {
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    await test.step('Verify submit button is present', async () => {
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    await test.step('Verify back to login link is present', async () => {
      await expect(page.locator('[data-testid="back-to-login-link"]')).toBeVisible();
    });
  });

  test('should navigate back to login', async ({ page }) => {
    await test.step('Navigate to forgot password page', async () => {
      await page.goto('/forgot-password');
    });

    await test.step('Click back to login link', async () => {
      await page.click('[data-testid="back-to-login-link"]');
    });

    await test.step('Verify navigation to login page', async () => {
      await expect(page).toHaveURL('/login');
    });
  });
});
