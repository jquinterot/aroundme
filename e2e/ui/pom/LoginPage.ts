import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  readonly title!: Locator;
  readonly emailInput!: Locator;
  readonly passwordInput!: Locator;
  readonly submitButton!: Locator;
  readonly signupLink!: Locator;
  readonly forgotPasswordLink!: Locator;
  readonly errorMessage!: Locator;

  constructor(page: Page) {
    super(page, '/login');
    
    this.title = page.locator('[data-testid="login-title"]');
    this.emailInput = page.locator('[data-testid="login-email-input"]');
    this.passwordInput = page.locator('[data-testid="login-password-input"]');
    this.submitButton = page.locator('[data-testid="login-submit-button"]');
    this.signupLink = page.locator('a[href="/signup"]');
    this.forgotPasswordLink = page.locator('a[href="/forgot-password"]');
    this.errorMessage = page.locator('.text-red-600');
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  async navigateToSignup(): Promise<void> {
    await this.click(this.signupLink);
  }

  async navigateToForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }
}
