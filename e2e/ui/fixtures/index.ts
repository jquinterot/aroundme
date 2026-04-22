import { test as base } from '@playwright/test';
import {
  LoginPage,
  SignupPage,
  HeaderPage,
  CityPage,
  EventDetailPage,
  PlaceDetailPage,
  ActivityDetailPage,
  CreateEventPage,
  DashboardPage,
} from '../pom';

/**
 * Extended test fixtures with Page Object Models
 * 
 * Usage in tests:
 * import { test, expect } from '../fixtures';
 * 
 * test('my test', async ({ loginPage, cityPage }) => {
 *   await loginPage.goto();
 *   await loginPage.login('email', 'password');
 * });
 */
type TestFixtures = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  headerPage: HeaderPage;
  cityPage: CityPage;
  eventDetailPage: EventDetailPage;
  placeDetailPage: PlaceDetailPage;
  activityDetailPage: ActivityDetailPage;
  createEventPage: CreateEventPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  headerPage: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },
  cityPage: async ({ page }, use) => {
    await use(new CityPage(page, 'bogota'));
  },
  eventDetailPage: async ({ page }, use) => {
    await use(new EventDetailPage(page, ''));
  },
  placeDetailPage: async ({ page }, use) => {
    await use(new PlaceDetailPage(page));
  },
  activityDetailPage: async ({ page }, use) => {
    await use(new ActivityDetailPage(page));
  },
  createEventPage: async ({ page }, use) => {
    await use(new CreateEventPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
