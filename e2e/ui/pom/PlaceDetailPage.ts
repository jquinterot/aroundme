import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Place Detail Page Object Model
 */
export class PlaceDetailPage extends BasePage {
  readonly pageContainer!: Locator;
  readonly loading!: Locator;
  readonly notFound!: Locator;
  readonly title!: Locator;
  readonly description!: Locator;
  readonly address!: Locator;
  readonly mapContainer!: Locator;
  readonly rating!: Locator;
  readonly reviewCount!: Locator;
  readonly priceRange!: Locator;
  readonly category!: Locator;
  readonly verifiedBadge!: Locator;
  readonly backLink!: Locator;
  readonly backToPlacesLink!: Locator;
  readonly websiteLink!: Locator;
  readonly instagramLink!: Locator;
  readonly phoneLink!: Locator;
  readonly saveButton!: Locator;
  readonly shareButton!: Locator;
  readonly googleMapsLink!: Locator;
  readonly reviewsSection!: Locator;

  constructor(page: Page) {
    super(page);

    this.pageContainer = page.getByTestId('place-detail-page');
    this.loading = page.getByTestId('place-loading');
    this.notFound = page.getByTestId('place-not-found');
    this.title = page.locator('h1');
    this.backLink = page.getByTestId('back-to-places');
    this.backToPlacesLink = page.getByTestId('back-to-places-link');
    this.mapContainer = page.locator('.leaflet-container');
    this.rating = page.getByTestId('place-rating');
    this.reviewCount = page.getByTestId('place-review-count');
    this.priceRange = page.getByTestId('place-price-range');
    this.category = page.getByTestId('place-category-badge');
    this.verifiedBadge = page.getByTestId('place-verified-badge');
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

  async getPlaceTitle(): Promise<string> {
    return this.getText(this.title);
  }

  async goBack(): Promise<void> {
    await this.click(this.backLink);
  }

  async isMapVisible(): Promise<boolean> {
    return this.isVisible(this.mapContainer);
  }

  async getRating(): Promise<string> {
    return this.getText(this.rating);
  }

  async isVerified(): Promise<boolean> {
    return this.isVisible(this.verifiedBadge);
  }
}
