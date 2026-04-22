---
name: test-writer
description: Write Vitest unit tests and Playwright E2E tests with POM pattern. Use when adding or updating tests for components, utilities, API routes, or user flows.
---

This skill guides test creation for the AroundMe application using Vitest (unit) and Playwright (E2E).

## Test Commands

```bash
# Unit tests
npm run test          # Watch mode
npm run test:run      # Single run

# E2E tests
npx playwright test                     # All tests
npx playwright test --project=chromium  # UI only
npx playwright test e2e/ui/tests/events # Specific folder
```

## Unit Tests (Vitest)

### Location
- `src/**/*.test.ts` - Tests colocated with source
- `src/**/*.spec.ts` - Alternative extension

### Pattern

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from './module';

describe('functionToTest', () => {
  it('should handle normal case', () => {
    const result = functionToTest('input');
    expect(result).toBe('expected');
  });

  it('should handle edge case', () => {
    const result = functionToTest('');
    expect(result).toBeNull();
  });

  it('should throw on invalid input', () => {
    expect(() => functionToTest(null)).toThrow();
  });
});
```

### Good Candidates for Unit Tests
- Pure utility functions (`src/lib/*.ts`)
- Validation logic (`src/lib/validation/`)
- Constants mapping
- Date/time calculations
- Search query parsing

### Avoid Unit Tests For
- Components requiring database
- Complex API mocking
- Visual/CSS testing

## E2E Tests (Playwright)

### Structure
```
e2e/ui/
├── pom/              # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── index.ts
├── fixtures/         # Test data & fixtures
│   └── index.ts
├── tests/            # Test files
│   ├── events/
│   ├── places/
│   ├── activities/
│   ├── auth/
│   └── navigation/
├── utils/            # Helper functions
└── types.ts          # TypeScript types
```

### Page Object Model Pattern

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page, '/login');
    
    this.emailInput = page.locator('[data-testid="login-email-input"]');
    this.passwordInput = page.locator('[data-testid="login-password-input"]');
    this.submitButton = page.locator('[data-testid="login-submit-button"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }
}
```

### Fixtures Pattern

```typescript
// e2e/ui/fixtures/index.ts
import { test as base } from '@playwright/test';
import { LoginPage, CityPage, DashboardPage } from '../pom';

type TestFixtures = {
  loginPage: LoginPage;
  cityPage: CityPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  cityPage: async ({ page }, use) => {
    await use(new CityPage(page, 'bogota'));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

### Test Pattern with Steps

```typescript
import { test, expect } from '../../fixtures';

test.describe('Feature Name', () => {
  test('should do something', async ({ page, loginPage }) => {
    await test.step('Setup precondition', async () => {
      await loginPage.goto();
      await loginPage.login('admin@aroundme.co', 'admin123');
    });

    await test.step('Perform action', async () => {
      await page.click('[data-testid="action-button"]');
    });

    await test.step('Verify result', async () => {
      await expect(page.locator('[data-testid="result"]')).toBeVisible();
    });
  });
});
```

### Test Data

Use fixtures from `e2e/ui/fixtures/index.ts`:

```typescript
import { users, events, places, activities } from '../../fixtures';

const testUser = users.valid;
const testEvent = events.music;
```

### Wait Patterns

```typescript
// Wait for page load
await page.waitForLoadState('networkidle');

// Wait for specific element
await expect(page.locator('[data-testid="card"]')).toBeVisible({ timeout: 15000 });

// Wait for URL change
await expect(page).toHaveURL(/\/event\/.+/);

// Wait for selector
await page.waitForSelector('[data-testid^="event-card"]', { timeout: 10000 });
```

## Test Organization

### Events Tests
```
e2e/ui/tests/events/
├── listing.spec.ts    # Cards, filters, search
├── detail.spec.ts     # Detail page, RSVP, map
└── create.spec.ts     # Event creation flow
```

### Places Tests
```
e2e/ui/tests/places/
├── listing.spec.ts    # Cards, filters, search
├── detail.spec.ts     # Detail page, reviews
└── submit.spec.ts     # Place submission
```

### Activities Tests
```
e2e/ui/tests/activities/
├── listing.spec.ts    # Cards, filters, search
├── detail.spec.ts     # Detail page, booking
└── create.spec.ts     # Activity creation
```

## Common Selectors

```typescript
// Cards
'[data-testid^="event-card-"]'
'[data-testid^="place-card-"]'
'[data-testid^="activity-card-"]'

// Page containers
'[data-testid="event-detail-page"]'
'[data-testid="login-page"]'

// Form elements
'[data-testid="event-title-input"]'
'[data-testid="event-category-music"]'

// Buttons
'[data-testid="login-submit-button"]'
'[data-testid="rsvp-going-button"]'
```

## Checklist for New Tests

- [ ] Uses test.step() for clarity
- [ ] Uses POM fixtures, not raw selectors
- [ ] Has proper beforeEach setup
- [ ] Tests both success and failure cases
- [ ] Uses data-testid selectors
- [ ] Includes proper waits (waitForLoadState)
- [ ] Added to appropriate feature folder
- [ ] Lint passes
