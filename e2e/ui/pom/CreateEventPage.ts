import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Create Event Page Object Model
 */
export class CreateEventPage extends BasePage {
  readonly pageContainer!: Locator;
  readonly title!: Locator;
  readonly backLink!: Locator;

  // Step 1: Basic Info
  readonly stepBasicInfo!: Locator;
  readonly eventTitleInput!: Locator;
  readonly citySelect!: Locator;
  readonly categorySelector!: Locator;
  readonly descriptionInput!: Locator;
  readonly basicInfoNextButton!: Locator;

  // Step 2: Date & Time
  readonly stepDateTime!: Locator;
  readonly startDateInput!: Locator;
  readonly startTimeInput!: Locator;
  readonly endDateInput!: Locator;
  readonly endTimeInput!: Locator;
  readonly recurringCheckbox!: Locator;
  readonly dateTimeBackButton!: Locator;
  readonly dateTimeNextButton!: Locator;

  // Step 3: Location
  readonly stepLocation!: Locator;
  readonly venueNameInput!: Locator;
  readonly addressSearchInput!: Locator;
  readonly locationPicker!: Locator;
  readonly freeToggle!: Locator;
  readonly paidToggle!: Locator;
  readonly priceInput!: Locator;
  readonly imageUrlInput!: Locator;
  readonly tagsInput!: Locator;
  readonly submitButton!: Locator;
  readonly locationBackButton!: Locator;

  // Form Stepper
  readonly formStepper!: Locator;

  constructor(page: Page) {
    super(page, '/create-event');

    this.pageContainer = page.getByTestId('create-event-page-container');
    this.title = page.getByTestId('create-event-title');
    this.backLink = page.getByTestId('back-link');

    // Step 1
    this.stepBasicInfo = page.getByTestId('create-event-basic-info');
    this.eventTitleInput = page.getByTestId('event-title-input');
    this.citySelect = page.getByTestId('event-city-select');
    this.categorySelector = page.getByTestId('event-category');
    this.descriptionInput = page.getByTestId('event-description-input');
    this.basicInfoNextButton = page.getByTestId('event-basic-next-button');

    // Step 2
    this.stepDateTime = page.getByTestId('create-event-datetime');
    this.recurringCheckbox = page.getByTestId('event-recurring-checkbox');
    this.dateTimeBackButton = page.getByTestId('event-datetime-back-button');
    this.dateTimeNextButton = page.getByTestId('event-datetime-next-button');

    // Step 3
    this.venueNameInput = page.locator('input[placeholder*="Parque"]').first();
    this.submitButton = page.locator('button:has-text("Submit Event")');
    this.locationBackButton = page.locator('button:has-text("Back")');

    // Form Stepper
    this.formStepper = page.locator('[class*="FormStepper"], .flex.items-center.justify-between');
  }

  async fillBasicInfo(title: string, city: string, category: string, description: string): Promise<void> {
    await this.fill(this.eventTitleInput, title);
    await this.citySelect.selectOption(city);
    await this.page.getByTestId(`event-category-${category}`).click();
    await this.fill(this.descriptionInput, description);
  }

  async goToNextStep(): Promise<void> {
    await this.basicInfoNextButton.click();
  }

  async selectCategory(category: string): Promise<void> {
    await this.page.getByTestId(`event-category-${category}`).click();
  }

  async setStartDate(date: string): Promise<void> {
    const dateInput = this.page.locator('input[type="date"]').first();
    await dateInput.fill(date);
  }

  async setStartTime(time: string): Promise<void> {
    const timeInput = this.page.locator('input[type="time"]').first();
    await timeInput.fill(time);
  }

  async toggleRecurring(enabled: boolean): Promise<void> {
    const isChecked = await this.recurringCheckbox.isChecked();
    if (isChecked !== enabled) {
      await this.recurringCheckbox.click();
    }
  }

  async fillVenueInfo(venueName: string, address: string): Promise<void> {
    await this.fill(this.venueNameInput, venueName);
    const addressInput = this.page.locator('[placeholder*="address"]').first();
    await this.fill(addressInput, address);
  }

  async setFreeEvent(): Promise<void> {
    await this.page.click('text=Free Event');
  }

  async setPaidEvent(price: string): Promise<void> {
    await this.page.click('text=Paid Event');
    await this.fill(this.priceInput, price);
  }

  async submitEvent(): Promise<void> {
    await this.click(this.submitButton);
  }

  async getCurrentStep(): Promise<number> {
    const activeStep = this.page.locator('.bg-indigo-600.text-white').first();
    const text = await activeStep.textContent();
    return parseInt(text || '1', 10);
  }
}
