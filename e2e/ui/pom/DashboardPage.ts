import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page Object Model
 */
export class DashboardPage extends BasePage {
  readonly pageContainer!: Locator;
  readonly title!: Locator;
  readonly statsSection!: Locator;
  readonly eventsCount!: Locator;
  readonly placesCount!: Locator;
  readonly rsvpsCount!: Locator;
  readonly earningsSection!: Locator;

  // Navigation Links
  readonly myEventsLink!: Locator;
  readonly myPlacesLink!: Locator;
  readonly myTicketsLink!: Locator;
  readonly savedEventsLink!: Locator;
  readonly myRsvpsLink!: Locator;
  readonly profileLink!: Locator;
  readonly earningsLink!: Locator;

  // Actions
  readonly createEventButton!: Locator;
  readonly createActivityButton!: Locator;
  readonly submitPlaceButton!: Locator;

  constructor(page: Page) {
    super(page, '/dashboard');

    this.pageContainer = page.locator('[data-testid="dashboard-page-container"]');
    this.title = page.locator('h1');
    this.myEventsLink = page.locator('[data-testid="my-events-link"]');
    this.myPlacesLink = page.locator('[data-testid="my-places-link"]');
    this.myTicketsLink = page.locator('[data-testid="my-tickets-link"]');
    this.savedEventsLink = page.locator('[data-testid="saved-events-link"]');
    this.myRsvpsLink = page.locator('[data-testid="my-rsvps-link"]');
    this.profileLink = page.locator('[data-testid="profile-link"]');
    this.createEventButton = page.locator('a[href="/create-event"]');
    this.createActivityButton = page.locator('a[href="/create-activity"]');
    this.submitPlaceButton = page.locator('a[href="/submit-place"]');
  }

  async navigateToMyEvents(): Promise<void> {
    await this.click(this.myEventsLink);
  }

  async navigateToMyPlaces(): Promise<void> {
    await this.click(this.myPlacesLink);
  }

  async navigateToMyTickets(): Promise<void> {
    await this.click(this.myTicketsLink);
  }

  async navigateToSavedEvents(): Promise<void> {
    await this.click(this.savedEventsLink);
  }

  async navigateToMyRsvps(): Promise<void> {
    await this.click(this.myRsvpsLink);
  }

  async navigateToProfile(): Promise<void> {
    await this.click(this.profileLink);
  }

  async createNewEvent(): Promise<void> {
    await this.click(this.createEventButton);
  }

  async createNewActivity(): Promise<void> {
    await this.click(this.createActivityButton);
  }

  async submitNewPlace(): Promise<void> {
    await this.click(this.submitPlaceButton);
  }
}
