import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Signup Page Object Model
 */
export class SignupPage extends BasePage {
  readonly pageContainer!: Locator;
  readonly title!: Locator;
  readonly nameInput!: Locator;
  readonly emailInput!: Locator;
  readonly passwordInput!: Locator;
  readonly confirmPasswordInput!: Locator;
  readonly submitButton!: Locator;
  readonly loginLink!: Locator;
  readonly errorMessage!: Locator;
  readonly successMessage!: Locator;

  constructor(page: Page) {
    super(page, '/signup');

    this.pageContainer = page.getByTestId('signup-page');
    this.title = page.getByTestId('signup-title');
    this.nameInput = page.getByTestId('signup-name-input');
    this.emailInput = page.getByTestId('signup-email-input');
    this.passwordInput = page.getByTestId('signup-password-input');
    this.confirmPasswordInput = page.getByTestId('signup-confirm-password-input');
    this.submitButton = page.getByTestId('signup-submit-button');
    this.loginLink = page.getByTestId('auth-login-link');
    this.errorMessage = page.getByTestId('signup-error');
    this.successMessage = page.getByTestId('signup-success');
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    await this.fill(this.nameInput, name);
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.fill(this.confirmPasswordInput, password);
    await this.click(this.submitButton);
  }

  async navigateToLogin(): Promise<void> {
    await this.click(this.loginLink);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }
}
