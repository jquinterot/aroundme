import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * City Page Object Model (Events/Places/Activities listing)
 */
export class CityPage extends BasePage {
  readonly pageTitle!: Locator;
  readonly eventsTab!: Locator;
  readonly placesTab!: Locator;
  readonly activitiesTab!: Locator;
  readonly eventCards!: Locator;
  readonly placeCards!: Locator;
  readonly activityCards!: Locator;
  readonly categoryFilter!: Locator;
  readonly dateFilter!: Locator;
  readonly priceFilter!: Locator;
  readonly searchInput!: Locator;

  constructor(page: Page, citySlug: string = 'bogota') {
    super(page, `/${citySlug}`);
    
    this.pageTitle = page.locator('h1');
    this.eventsTab = page.getByTestId('tab-events');
    this.placesTab = page.getByTestId('tab-places');
    this.activitiesTab = page.getByTestId('tab-activities');
    this.eventCards = page.getByTestId(/^event-card-/);
    this.placeCards = page.getByTestId(/^place-card-/);
    this.activityCards = page.getByTestId(/^activity-card-/);
    this.categoryFilter = page.getByTestId('event-filter-category-all');
    this.dateFilter = page.getByTestId('event-filter-date');
    this.priceFilter = page.getByTestId('event-filter-price');
    this.searchInput = page.getByTestId('event-search-input');
  }

  async switchToPlaces(): Promise<void> {
    await this.click(this.placesTab);
    await this.page.waitForURL('**/places');
  }

  async switchToActivities(): Promise<void> {
    await this.click(this.activitiesTab);
    await this.page.waitForURL('**/activities');
  }

  async switchToEvents(): Promise<void> {
    await this.click(this.eventsTab);
  }

  async getEventCardCount(): Promise<number> {
    return this.eventCards.count();
  }

  async getPlaceCardCount(): Promise<number> {
    return this.placeCards.count();
  }

  async getActivityCardCount(): Promise<number> {
    return this.activityCards.count();
  }

  async clickFirstEvent(): Promise<void> {
    await this.click(this.eventCards.first());
  }

  async clickFirstPlace(): Promise<void> {
    await this.click(this.placeCards.first());
  }

  async clickFirstActivity(): Promise<void> {
    await this.click(this.activityCards.first());
  }

  async filterByCategory(category: string): Promise<void> {
    await this.page.getByTestId(`event-filter-category-${category}`).click();
  }
}
