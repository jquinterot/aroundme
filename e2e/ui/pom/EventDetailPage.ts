import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Event Detail Page Object Model
 */
export class EventDetailPage extends BasePage {
  readonly pageContainer!: Locator;
  readonly title!: Locator;
  readonly description!: Locator;
  readonly date!: Locator;
  readonly venue!: Locator;
  readonly venueAddress!: Locator;
  readonly mapContainer!: Locator;
  readonly rsvpGoingButton!: Locator;
  readonly rsvpInterestedButton!: Locator;
  readonly rsvpMaybeButton!: Locator;
  readonly saveButton!: Locator;
  readonly shareButton!: Locator;
  readonly backLink!: Locator;
  readonly ticketSection!: Locator;

  constructor(page: Page, eventId: string) {
    super(page, `/event/${eventId}`);
    
    this.pageContainer = page.getByTestId('event-detail-page');
    this.title = page.locator('h1');
    this.description = page.getByTestId('event-description');
    this.date = page.getByTestId('event-date');
    this.venue = page.getByTestId('event-venue-name');
    this.venueAddress = page.getByTestId('event-venue-address');
    this.mapContainer = page.locator('.leaflet-container');
    this.rsvpGoingButton = page.getByTestId('rsvp-going-button');
    this.rsvpInterestedButton = page.getByTestId('rsvp-interested-button');
    this.rsvpMaybeButton = page.getByTestId('rsvp-maybe-button');
    this.saveButton = page.getByTestId('save-event-button');
    this.shareButton = page.getByTestId('share-event-button');
    this.backLink = page.getByTestId('back-to-events');
    this.ticketSection = page.getByTestId('ticket-section');
  }

  async rsvp(status: 'going' | 'interested' | 'maybe'): Promise<void> {
    switch (status) {
      case 'going':
        await this.click(this.rsvpGoingButton);
        break;
      case 'interested':
        await this.click(this.rsvpInterestedButton);
        break;
      case 'maybe':
        await this.click(this.rsvpMaybeButton);
        break;
    }
  }

  async saveEvent(): Promise<void> {
    await this.click(this.saveButton);
  }

  async goBack(): Promise<void> {
    await this.click(this.backLink);
  }

  async getEventTitle(): Promise<string> {
    return this.getText(this.title);
  }

  async isMapVisible(): Promise<boolean> {
    return this.isVisible(this.mapContainer);
  }
}
