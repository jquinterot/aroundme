import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Header Component Page Object Model
 */
export class HeaderPage extends BasePage {
  readonly logo: Locator;
  readonly eventsLink: Locator;
  readonly placesLink: Locator;
  readonly activitiesLink: Locator;
  readonly searchInput: Locator;
  readonly userMenu: Locator;
  readonly loginButton: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.logo = page.locator('[data-testid="header-logo"]');
    this.eventsLink = page.locator('[data-testid="nav-events-link"]');
    this.placesLink = page.locator('[data-testid="nav-places-link"]');
    this.activitiesLink = page.locator('[data-testid="nav-activities-link"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.userMenu = page.locator('[data-testid="user-menu-button"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.signupButton = page.locator('[data-testid="signup-button"]');
  }

  async navigateToEvents(): Promise<void> {
    await this.click(this.eventsLink);
  }

  async navigateToPlaces(): Promise<void> {
    await this.click(this.placesLink);
  }

  async navigateToActivities(): Promise<void> {
    await this.click(this.activitiesLink);
  }

  async search(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.searchInput.press('Enter');
  }

  async openUserMenu(): Promise<void> {
    await this.click(this.userMenu);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return this.isVisible(this.userMenu);
  }
}
