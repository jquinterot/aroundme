# UI E2E Testing Best Practices Guide

This document outlines the best practices applied to the AroundMe UI E2E testing framework.

## 📁 Test Architecture

```
e2e/ui/
├── pom/                   # Page Object Models
├── fixtures/             # Test data
├── utils/                # Test utilities
├── types.ts              # TypeScript types
└── tests/                # Test suites
    ├── events/
    ├── places/
    └── ...
```

## ✅ Best Practices Implemented

### 1. **Page Object Model (POM) Pattern**

**Purpose**: Separate UI logic from test logic for maintainability.

**Implementation**:
- Base class with common methods
- Specific POMs for each page
- Reusable across multiple tests

```typescript
// Usage
const loginPage = new LoginPage(page);
await loginPage.login(user.email, user.password);
```

### 2. **Test Data Fixtures**

**Purpose**: Centralized, reusable test data.

**Benefits**:
- Consistent test data
- Easy to maintain
- Type-safe with TypeScript

```typescript
import { users, events, places } from '../fixtures';

const testUser = users.valid;
const testEvent = events.music;
```

**Available Fixtures**:
- `users` - valid, admin, new, invalid
- `events` - music, food, tech, minimal
- `places` - restaurant, cafe, bar
- `activities` - dance, tour, yoga
- `bookings` - valid, minimal
- `reviews` - excellent, good, average
- `cities` - bogota, medellin, cali
- `filters` - today, week, category filters

### 3. **Test Steps with `test.step()`**

**Purpose**: Clear test structure and better reporting.

```typescript
test('should complete checkout', async ({ page }) => {
  await test.step('Login', async () => {
    await authenticateUser(page, users.valid);
  });
  
  await test.step('Add to cart', async () => {
    await addToCart(page, product);
  });
  
  await test.step('Complete checkout', async () => {
    await completeCheckout(page);
  });
});
```

**Benefits**:
- Clear test structure in reports
- Easy to debug specific steps
- Better failure messages

### 4. **Test Utilities & Helpers**

**Available Helpers**:

```typescript
// Authentication
await authenticateUser(page, user);

// Cleanup
await clearBrowserState(page);

// Waits
await waitForElementWithRetry(page, selector);
await waitForNetworkIdle(page);

// Verification
await verifyToast(page, 'Success!');
await elementExists(page, selector);

// Error Handling
const consoleErrors = setupConsoleErrorListener(page);
assertNoReactErrors(consoleErrors);
```

### 5. **Console Error Monitoring**

**Purpose**: Catch JavaScript errors during tests.

```typescript
let consoleErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  consoleErrors = setupConsoleErrorListener(page);
});

test.afterEach(() => {
  assertNoReactErrors(consoleErrors);
});
```

### 6. **Proper Cleanup**

**Purpose**: Ensure tests are isolated.

```typescript
test.beforeEach(async ({ page }) => {
  await clearBrowserState(page);
});
```

### 7. **Data Generators**

**Purpose**: Create unique test data to avoid conflicts.

```typescript
import { generateUniqueEvent, generateUniqueUser } from '../fixtures';

const uniqueEvent = generateUniqueEvent(events.music);
const uniqueUser = generateUniqueUser(users.valid);
```

### 8. **Test Organization**

**Structure**:
```typescript
test.describe('Feature: Description', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test.afterEach(() => {
    // Assertions & cleanup
  });

  test('should do something', async ({ page }) => {
    // Test body with steps
  });
});
```

### 9. **Assertion Best Practices**

**Always use Playwright's auto-waiting assertions**:

```typescript
// Good - auto-waits
await expect(page.locator('.element')).toBeVisible();

// Bad - might race
expect(await page.locator('.element').isVisible()).toBe(true);
```

**Prefer soft assertions for non-critical checks**:

```typescript
await expect.soft(page.locator('.optional')).toBeVisible();
```

### 10. **Test Data Management**

**Use fixtures for static data**:
```typescript
const user = users.valid;
```

**Generate unique data for dynamic tests**:
```typescript
const event = generateUniqueEvent(events.music);
```

**Keep test data minimal**:
```typescript
// Only include fields under test
const minimalEvent = {
  title: 'Test',
  description: 'Test description',
  // ... other required fields
};
```

## 🎯 Test Design Patterns

### AAA Pattern (Arrange-Act-Assert)

```typescript
test('should RSVP to event', async ({ page }) => {
  // Arrange
  await authenticateUser(page, users.valid);
  const cityPage = new CityPage(page, 'bogota');
  
  // Act
  await cityPage.goto();
  await cityPage.clickFirstEvent();
  await page.click('[data-testid="rsvp-going-button"]');
  
  // Assert
  await expect(page.locator('[data-testid="rsvp-going-button"]'))
    .toHaveClass(/active/);
});
```

### Given-When-Then Pattern

```typescript
test('user can save event', async ({ page }) => {
  // Given
  await authenticateUser(page, users.valid);
  
  // When
  await page.goto('/event/some-event-id');
  await page.click('[data-testid="save-event-button"]');
  
  // Then
  await expect(page.locator('[data-testid="save-event-button"]'))
    .toHaveClass(/saved/);
});
```

## 📊 Test Reporting

**HTML Report**:
```bash
npm run test:e2e:ui
npm run test:e2e:report
```

**List Reporter**:
```bash
npx playwright test e2e/ui --reporter=list
```

## 🔧 Configuration Best Practices

### playwright.config.ts

```typescript
export default defineConfig({
  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  
  // Retries
  retries: process.env.CI ? 2 : 0,
  
  // Timeouts
  timeout: 30 * 1000,
  expect: { timeout: 10000 },
  
  // Tracing
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

## 🚀 Running Tests

```bash
# Run all UI tests
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/ui/tests/events/event-detail.spec.ts

# Run with headed browser
npm run test:e2e:ui:headed

# Debug mode
npm run test:e2e:ui:debug

# Run with project filter
npx playwright test e2e/ui --project=chromium

# Generate report
npm run test:e2e:report
```

## 📝 Naming Conventions

**Test files**: `feature-name.spec.ts`
**Test suites**: `describe('Feature: Description', ...)`
**Test cases**: `test('should behavior when condition', ...)`
**Test steps**: `step('Action description', ...)`

## ✅ Checklist

When writing tests, ensure:

- [ ] Uses POM pattern
- [ ] Imports from fixtures for test data
- [ ] Uses test.step() for multi-step tests
- [ ] Has beforeEach/afterEach for setup/cleanup
- [ ] Monitors console errors
- [ ] Uses auto-waiting assertions
- [ ] Has descriptive test names
- [ ] Tests are independent
- [ ] Data is cleaned up after tests
- [ ] Screenshots on failure enabled

## 📚 Example Test

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage, EventDetailPage } from '../pom';
import { users, events, generateUniqueEvent } from '../fixtures';
import { authenticateUser, clearBrowserState, assertNoReactErrors, setupConsoleErrorListener } from '../utils/test-helpers';

test.describe('Event: RSVPing', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = setupConsoleErrorListener(page);
    await clearBrowserState(page);
  });

  test.afterEach(() => {
    assertNoReactErrors(consoleErrors);
  });

  test('should allow authenticated user to RSVP as going', async ({ page }) => {
    const event = generateUniqueEvent(events.music);
    const eventDetailPage = new EventDetailPage(page, 'event-id');
    
    await test.step('Authenticate user', async () => {
      await authenticateUser(page, users.valid);
    });
    
    await test.step('Navigate to event', async () => {
      await eventDetailPage.goto();
      await eventDetailPage.waitForPageLoad();
    });
    
    await test.step('RSVP as going', async () => {
      await eventDetailPage.rsvp('going');
    });
    
    await test.step('Verify RSVP success', async () => {
      await expect(page.locator('[data-testid="rsvp-going-button"]'))
        .toHaveClass(/active/);
    });
  });
});
```
