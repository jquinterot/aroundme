import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Activity Detail Page Object Model
 */
export class ActivityDetailPage extends BasePage {
  readonly pageContainer!: Locator;
  readonly loading!: Locator;
  readonly notFound!: Locator;
  readonly bookingSuccess!: Locator;
  readonly title!: Locator;
  readonly provider!: Locator;
  readonly description!: Locator;
  readonly schedule!: Locator;
  readonly duration!: Locator;
  readonly price!: Locator;
  readonly capacity!: Locator;
  readonly skillLevel!: Locator;
  readonly category!: Locator;
  readonly address!: Locator;
  readonly mapContainer!: Locator;
  readonly backLink!: Locator;
  readonly browseActivitiesLink!: Locator;
  readonly saveButton!: Locator;
  readonly shareButton!: Locator;
  readonly bookingSection!: Locator;

  // Booking Form
  readonly guestNameInput!: Locator;
  readonly guestEmailInput!: Locator;
  readonly guestPhoneInput!: Locator;
  readonly ticketsInput!: Locator;
  readonly notesInput!: Locator;
  readonly bookButton!: Locator;

  constructor(page: Page) {
    super(page);

    this.pageContainer = page.locator('[data-testid="activity-detail-page"]');
    this.loading = page.locator('[data-testid="activity-loading"]');
    this.notFound = page.locator('[data-testid="activity-not-found"]');
    this.bookingSuccess = page.locator('[data-testid="booking-success"]');
    this.title = page.locator('[data-testid="activity-title"]');
    this.provider = page.locator('[data-testid="activity-provider"]');
    this.backLink = page.locator('[data-testid="back-to-activities"]');
    this.browseActivitiesLink = page.locator('[data-testid="browse-activities-link"]');
    this.saveButton = page.locator('[data-testid="save-activity-button"]');
    this.shareButton = page.locator('[data-testid="share-activity-button"]');
    this.mapContainer = page.locator('.leaflet-container');

    // Booking Form
    this.guestNameInput = page.locator('input[placeholder*="name" i], input[name="guestName"]').first();
    this.guestEmailInput = page.locator('input[type="email"], input[name="guestEmail"]').first();
    this.bookButton = page.locator('button:has-text("Book"), button:has-text("Reservar")');
  }

  async isPageLoaded(): Promise<boolean> {
    return this.isVisible(this.pageContainer);
  }

  async isLoading(): Promise<boolean> {
    return this.isVisible(this.loading);
  }

  async isNotFound(): Promise<boolean> {
    return this.isVisible(this.notFound);
  }

  async isBookingSuccessful(): Promise<boolean> {
    return this.isVisible(this.bookingSuccess);
  }

  async getActivityTitle(): Promise<string> {
    return this.getText(this.title);
  }

  async goBack(): Promise<void> {
    await this.click(this.backLink);
  }

  async isMapVisible(): Promise<boolean> {
    return this.isVisible(this.mapContainer);
  }

  async saveActivity(): Promise<void> {
    await this.click(this.saveButton);
  }

  async bookActivity(name: string, email: string, tickets: number = 1): Promise<void> {
    await this.fill(this.guestNameInput, name);
    await this.fill(this.guestEmailInput, email);
    if (tickets > 1) {
      const ticketsInput = this.page.locator('input[type="number"]').first();
      await ticketsInput.fill(tickets.toString());
    }
    await this.click(this.bookButton);
  }
}
