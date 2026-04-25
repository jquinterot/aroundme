---
name: playwright-ui-agent
description: Expert Playwright UI testing agent for the AroundMe Next.js application. Use when writing, reviewing, refactoring, or debugging E2E UI tests. Covers design patterns (POM, Factory, Builder, Command, Singleton), latest Playwright features (soft assertions, clock API, expect.poll, toPass, mergeTests, getByTestId), TypeScript quality, reusable test steps, test organization, coverage analysis, and CI alignment. Triggers on E2E test creation, test refactoring, flaky test debugging, POM creation, test coverage gaps, or modern Playwright feature adoption.
---

# Playwright UI Testing Expert — AroundMe

Expert E2E UI testing skill tailored for AroundMe's Playwright 1.58+ + TypeScript + POM framework.

## Tech Stack Context

- **Framework**: Playwright 1.58.2+
- **Pattern**: Page Object Model (POM) with Fixtures
- **Language**: TypeScript (strict)
- **App**: Next.js 16 + React 18 + TanStack Query
- **Test Location**: `e2e/ui/`
- **POM Location**: `e2e/ui/pom/`
- **Fixtures**: `e2e/ui/fixtures/index.ts`
- **Utils**: `e2e/ui/utils/test-helpers.ts`
- **Steps**: `e2e/ui/steps/*.steps.ts`

## Design Patterns for Playwright E2E

### 1. Page Object Model (POM) — Core Pattern

Every page has a POM class extending `BasePage`:

```typescript
// e2e/ui/pom/EventDetailPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EventDetailPage extends BasePage {
  readonly title: Locator;
  readonly rsvpButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page, eventId: string = '') {
    super(page, eventId ? `/event/${eventId}` : '/event/test-id');
    this.title = page.locator('[data-testid="event-title"]');
    this.rsvpButton = page.locator('[data-testid="rsvp-going-button"]');
    this.saveButton = page.locator('[data-testid="event-save-button"]');
  }

  async rsvp(status: 'going' | 'interested' | 'maybe'): Promise<void> {
    await this.click(this.page.locator(`[data-testid="rsvp-${status}-button"]`));
  }

  async isSoldOut(): Promise<boolean> {
    return this.page.locator('[data-testid="sold-out-badge"]').isVisible();
  }
}
```

**Rules:**
- One POM per page/major feature
- Selectors use `data-testid` only (never CSS classes)
- Actions return `Promise<void>` or `Promise<T>`
- No assertions in POMs — assertions belong in tests

---

### 2. Factory Pattern — Test Data Creation

Use factories for creating test data objects:

```typescript
// e2e/ui/factories/UserFactory.ts
import { TestUser } from '../types';

export class UserFactory {
  static create(overrides: Partial<TestUser> = {}): TestUser {
    const timestamp = Date.now();
    return {
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User',
      ...overrides,
    };
  }

  static createAdmin(): TestUser {
    return {
      email: 'admin@aroundme.co',
      password: 'admin123',
      name: 'Admin User',
    };
  }
}
```

**Benefits:**
- Centralized test data
- Easy to add required fields
- Prevents copy-paste data across tests

---

### 3. Builder Pattern — Complex Form Data

For multi-step forms with many fields:

```typescript
// e2e/ui/builders/EventFormBuilder.ts
import { EventFormData } from '../types';

export class EventFormBuilder {
  private data: Partial<EventFormData> = {};

  withTitle(title: string): this {
    this.data.title = title;
    return this;
  }

  withCategory(category: string): this {
    this.data.category = category;
    return this;
  }

  withDate(start: string, end?: string): this {
    this.data.startDate = start;
    this.data.endDate = end;
    return this;
  }

  build(): EventFormData {
    return {
      title: this.data.title || 'Test Event',
      category: this.data.category || 'music',
      startDate: this.data.startDate || new Date().toISOString(),
      ...this.data,
    } as EventFormData;
  }
}

// Usage:
const event = new EventFormBuilder()
  .withTitle('My Concert')
  .withCategory('music')
  .withDate('2026-05-01', '2026-05-02')
  .build();
```

---

### 4. Command Pattern — Reusable Test Steps

Encapsulate reusable workflows as commands:

```typescript
// e2e/ui/commands/AuthCommands.ts
import { Page } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';

export class AuthCommands {
  constructor(private page: Page) {}

  async loginAsAdmin(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login('admin@aroundme.co', 'admin123');
    await this.page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 });
  }

  async loginAs(user: { email: string; password: string }): Promise<void> {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
  }

  async logout(): Promise<void> {
    await this.page.goto('/logout');
    await this.page.waitForURL('/login', { timeout: 5000 });
  }
}
```

**Register in fixtures:**
```typescript
export const test = base.extend<{
  authCommands: AuthCommands;
}>({
  authCommands: async ({ page }, use) => {
    await use(new AuthCommands(page));
  },
});
```

---

### 5. Singleton Pattern — Shared Test State

Use for cross-test shared data (with caution):

```typescript
// e2e/ui/state/TestState.ts
export class TestState {
  private static instance: TestState;
  private createdEventIds: string[] = [];

  static getInstance(): TestState {
    if (!TestState.instance) {
      TestState.instance = new TestState();
    }
    return TestState.instance;
  }

  addEventId(id: string): void {
    this.createdEventIds.push(id);
  }

  getEventIds(): string[] {
    return [...this.createdEventIds];
  }

  clear(): void {
    this.createdEventIds = [];
  }
}
```

**Warning:** Singletons can cause test interdependence. Prefer fixtures or per-test setup.

---

## Reusable Test Steps Library

Create a library of common test steps that can be composed:

```typescript
// e2e/ui/steps/common.steps.ts
import { Page, expect } from '@playwright/test';

export const CommonSteps = {
  async navigateTo(page: Page, url: string) {
    await page.goto(url);
    await expect(page.locator('body')).toBeVisible();
  },

  async verifyPageTitle(page: Page, testId: string, expectedText: string) {
    await expect(page.locator(`[data-testid="${testId}"]`)).toContainText(expectedText);
  },

  async fillAndSubmitForm(page: Page, fields: Record<string, string>, submitTestId: string) {
    for (const [testId, value] of Object.entries(fields)) {
      await page.fill(`[data-testid="${testId}"]`, value);
    }
    await page.click(`[data-testid="${submitTestId}"]`);
  },

  async verifyUrl(page: Page, pattern: string | RegExp) {
    await expect(page).toHaveURL(pattern);
  },

  async verifyElementVisible(page: Page, testId: string, timeout = 5000) {
    await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible({ timeout });
  },

  async clickElement(page: Page, testId: string) {
    await page.click(`[data-testid="${testId}"]`);
  },

  async selectCategory(page: Page, category: string, type: 'event' | 'place' | 'activity') {
    const testId = `${type}-filter-category-${category}`;
    await page.click(`[data-testid="${testId}"]`);
  },

  async verifyCardCount(page: Page, prefix: string, minCount: number) {
    const cards = page.locator(`[data-testid^="${prefix}"]`);
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  },
};
```

**Usage in tests:**
```typescript
test('should filter events', async ({ page }) => {
  await CommonSteps.navigateTo(page, '/bogota/events');
  await CommonSteps.selectCategory(page, 'music', 'event');
  await CommonSteps.verifyCardCount(page, 'event-card', 1);
});
```

---

## TypeScript Quality Guidelines

### Strict Typing
```typescript
// ✅ Good: Explicit return types
async function createEvent(page: Page, data: EventFormData): Promise<string> {
  // ...
  return eventId;
}

// ❌ Bad: Implicit any
async function createEvent(page, data) {
  // ...
}
```

### Interface over Type
```typescript
// ✅ Good: Interface for object shapes
interface TestUser {
  email: string;
  password: string;
  name: string;
}

// ❌ Bad: Type alias for simple objects
type TestUser = { email: string; password: string };
```

### Discriminated Unions for Test States
```typescript
type TestResult =
  | { status: 'passed'; duration: number }
  | { status: 'failed'; duration: number; error: string }
  | { status: 'skipped'; reason: string };
```

### Never Use `any`
```typescript
// ❌ Bad
const data: any = await response.json();

// ✅ Good
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
const data = await response.json() as ApiResponse<Event>;
```

---

## Test Organization Best Practices

### File Structure
```
e2e/ui/
├── pom/                    # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── ...
├── fixtures/               # Test fixtures
│   └── index.ts
├── factories/              # Test data factories
│   ├── UserFactory.ts
│   └── EventFactory.ts
├── builders/               # Complex object builders
│   └── EventFormBuilder.ts
├── commands/               # Reusable command workflows
│   ├── AuthCommands.ts
│   └── EventCommands.ts
├── steps/                  # Reusable test steps
│   ├── common.steps.ts
│   ├── auth.steps.ts
│   └── navigation.steps.ts
├── types.ts                # Shared TypeScript types
├── utils/                  # Utility functions
│   └── test-helpers.ts
└── tests/                  # Test files
    ├── auth/
    ├── events/
    ├── places/
    ├── activities/
    ├── profile/
    └── navigation/
```

### Naming Conventions
- **Test files**: `feature-area.spec.ts` (e.g., `rsvp-flow.spec.ts`)
- **POM files**: `FeaturePage.ts` (e.g., `EventDetailPage.ts`)
- **Describe blocks**: `Feature Area` (e.g., `Event Detail Page`)
- **Test names**: `should [expected behavior] when [condition]`

### Test Independence
```typescript
// ✅ Good: Each test is self-contained
test('should save event', async ({ page }) => {
  await AuthSteps.login(page);
  await page.goto('/event/123');
  await page.click('[data-testid="save-button"]');
  await expect(page.locator('[data-testid="saved-indicator"]')).toBeVisible();
});

// ❌ Bad: Test depends on previous test state
test('step 1: login', async () => { /* sets global state */ });
test('step 2: save event', async () => { /* reads global state */ });
```

### Setup/Teardown
```typescript
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await AuthSteps.loginAsAdmin(page);
    await page.goto('/dashboard');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // Tests...
});
```

---

## test.step Best Practices & Modern Usage

### Current State Analysis
The project has **236 `test.step` usages** across E2E UI tests. This is excellent for reporting and debugging. However, there are issues:

**Problems Found:**
1. **Over-stepping**: Simple single-action tests have 4-5 steps that could be 1-2
2. **Still using `networkidle`**: `beforeEach` hooks use `waitForLoadState('networkidle')` which is unreliable
3. **`waitForTimeout(500)`**: Used in 6+ tests instead of proper waits
4. **Inconsistent granularity**: Some tests have steps for every line, others have none

### test.step Rules

```typescript
// ✅ GOOD: Steps represent user intentions, not every line
test('should filter events by category', async ({ page }) => {
  await test.step('Navigate to events and apply music filter', async () => {
    await page.goto('/bogota/events');
    await expect(page.locator('[data-testid^="event-card"]').first()).toBeVisible({ timeout: 15000 });
    await page.click('[data-testid="event-filter-category-music"]');
  });

  await test.step('Verify filtered results', async () => {
    await expect(page.locator('[data-testid^="event-card"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="event-filter-category-music"]')).toHaveClass(/bg-indigo/);
  });
});

// ❌ BAD: Too granular — every line is a step
test('should filter events by category', async ({ page }) => {
  await test.step('Click on music category filter', async () => {
    await page.click('[data-testid="event-filter-category-music"]');
  });
  await test.step('Wait for filter to apply', async () => {
    await page.waitForTimeout(500); // Anti-pattern!
  });
  await test.step('Verify events are displayed after filtering', async () => {
    const eventCards = page.locator('[data-testid^="event-card"]');
    await expect(eventCards.first()).toBeVisible();
  });
  await test.step('Verify filter is visually active', async () => {
    const musicFilter = page.locator('[data-testid="event-filter-category-music"]');
    await expect(musicFilter).toHaveClass(/bg-indigo/);
  });
});
```

### When to use test.step
- **Group related actions** into a user intention (e.g., "Apply category filter")
- **Isolate setup** from assertions (e.g., "Login and navigate" vs "Verify dashboard")
- **Wrap conditional logic** or loops
- **NOT for every single line** — that's noise

---

## Modern Playwright Features (1.50+)

### 1. `getByTestId()` — Dedicated Locator (USE THIS)

Playwright now has a built-in `getByTestId()` method. Use it instead of manual attribute selectors:

```typescript
// ❌ OLD WAY
await page.click('[data-testid="login-submit-button"]');
await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();

// ✅ NEW WAY — cleaner, built-in
await page.getByTestId('login-submit-button').click();
await expect(page.getByTestId('dashboard-page')).toBeVisible();
```

**POM Update:**
```typescript
export class LoginPage extends BasePage {
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/login');
    this.submitButton = page.getByTestId('login-submit-button');
  }
}
```

---

### 2. `expect.soft()` — Multiple Assertions That All Run

When you have multiple independent assertions that should all be checked:

```typescript
// ❌ OLD: Stops at first failure
test('should display event details', async ({ page }) => {
  await expect(page.getByTestId('event-title')).toBeVisible();
  await expect(page.getByTestId('event-date')).toContainText('May 1');
  await expect(page.getByTestId('event-venue')).toContainText('Bogotá');
});

// ✅ NEW: All assertions run, reports all failures
import { test, expect } from '@playwright/test';

test('should display event details', async ({ page }) => {
  await expect.soft(page.getByTestId('event-title')).toBeVisible();
  await expect.soft(page.getByTestId('event-date')).toContainText('May 1');
  await expect.soft(page.getByTestId('event-venue')).toContainText('Bogotá');
});
```

---

### 3. `expect.poll()` — Dynamic Conditions

For values that change over time:

```typescript
// ❌ OLD: Manual retry loop
let count = 0;
for (let i = 0; i < 10; i++) {
  count = await page.locator('[data-testid^="event-card"]').count();
  if (count > 0) break;
  await page.waitForTimeout(500);
}

// ✅ NEW: Built-in polling
await expect.poll(
  async () => page.locator('[data-testid^="event-card"]').count(),
  { intervals: [500], timeout: 10000 }
).toBeGreaterThan(0);
```

---

### 4. `expect.toPass()` — Retry Flaky Assertions

For assertions that may need multiple attempts:

```typescript
// Retry this block up to 3 times with exponential backoff
await expect(async () => {
  const count = await page.locator('[data-testid^="event-card"]').count();
  expect(count).toBeGreaterThanOrEqual(3);
}).toPass({ intervals: [1000, 2000, 3000] });
```

---

### 5. `page.clock` — Time Manipulation (1.51+)

Control time for testing time-sensitive features (event countdowns, session expiry):

```typescript
test('should show expired event badge', async ({ page }) => {
  // Install clock before navigation
  await page.clock.install();
  
  await page.goto('/event/past-event-id');
  
  // Fast-forward 2 days
  await page.clock.fastForward('2 days');
  
  await expect(page.getByTestId('expired-badge')).toBeVisible();
});
```

---

### 6. `mergeTests` — Compose Fixtures

Combine multiple fixture sets:

```typescript
import { mergeTests } from '@playwright/test';
import { test as authTest } from './fixtures/auth-fixtures';
import { test as pageTest } from './fixtures/page-fixtures';

export const test = mergeTests(authTest, pageTest);
```

---

### 7. `locator.filter()` — Chain Filtering

More readable than complex CSS selectors:

```typescript
// ❌ OLD: Complex selector
const musicEvent = page.locator('[data-testid="event-card"].music-category:has-text("Concert")');

// ✅ NEW: Chain filters
const musicEvent = page
  .getByTestId('event-card')
  .filter({ hasText: 'Concert' })
  .filter({ has: page.getByTestId('category-music') });
```

---

### 8. `test.info().annotations` — Test Metadata

Add metadata for reporting:

```typescript
test('should purchase premium ticket', async ({ page }) => {
  test.info().annotations.push({
    type: 'feature',
    description: 'Ticket checkout with Stripe',
  });
  test.info().annotations.push({
    type: 'jira',
    description: 'TICKET-123',
  });
  
  // Test code...
});
```

---

### 9. `test.step()` with `box` Option — Better Error Reporting

When a step should be treated as internal implementation detail:

```typescript
test('should save event', async ({ page }) => {
  await test.step('Login and navigate to event', async () => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('user@example.com');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard');
    await page.goto('/event/123');
  }, { box: true }); // Internal step — errors point to test line, not inside step

  await page.getByTestId('save-button').click();
  await expect(page.getByTestId('saved-indicator')).toBeVisible();
});
```

---

### 10. `test.use()` with Project-Level Config

Override settings per test file:

```typescript
// e2e/ui/tests/mobile/navigation.spec.ts
test.use({
  viewport: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
});

test.describe('Mobile Navigation', () => {
  test('should show hamburger menu', async ({ page }) => {
    await page.goto('/bogota');
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible();
  });
});
```

---

## Anti-Patterns to Eliminate

1. **`waitForLoadState('networkidle')`** — Use explicit element waits instead
2. **`page.waitForTimeout(n)`** — Almost always wrong; use `expect().toBeVisible()` or `expect.poll()`
3. **CSS class selectors** — Always use `data-testid` or `getByTestId()`
4. **Assertions in POMs** — Keep POMs pure; assertions in tests only
5. **Hardcoded URLs in tests** — Use POM `url` property or constants
6. **Magic strings** — Use constants/enums for categories, statuses
7. **Long test files** — Split at 150 lines; group by feature area
8. **Missing `test.step()`** — Every logical block should be a step
9. **No cleanup** — Clear state after tests that create data
10. **Duplicated login code** — Use `AuthCommands` or fixtures
11. **Manual retry loops** — Use `expect.toPass()` or `expect.poll()`
12. **Complex CSS selectors** — Use `locator.filter()` chaining

---

## Coverage Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Signup flow
- [ ] Forgot password
- [ ] OAuth (Google, GitHub)
- [ ] Logout
- [ ] Session persistence
- [ ] Protected route redirects

### Events
- [ ] List events
- [ ] Filter by category
- [ ] Filter by date
- [ ] Filter by price
- [ ] Search events
- [ ] View event detail
- [ ] RSVP (going, interested, maybe)
- [ ] Save event
- [ ] Share event
- [ ] Create event form
- [ ] Event map view

### Places
- [ ] List places
- [ ] Filter by category
- [ ] Search places
- [ ] View place detail
- [ ] Submit place
- [ ] Place reviews
- [ ] Save place

### Activities
- [ ] List activities
- [ ] Filter by category
- [ ] Search activities
- [ ] View activity detail
- [ ] Book activity
- [ ] Save activity

### Dashboard
- [ ] View stats
- [ ] View saved events
- [ ] View RSVPs
- [ ] View tickets
- [ ] View earnings
- [ ] View notifications

### Navigation
- [ ] Tab switching
- [ ] City selector
- [ ] Search bar
- [ ] Mobile navigation

---

## CI Alignment

### Local vs CI Parity
| Setting | Local | CI |
|---------|-------|-----|
| Workers | 3 | 1 |
| Retries | 1 | 2 |
| Headed | Optional | false |
| Video | retain-on-failure | on-first-retry |
| Screenshot | only-on-failure | only-on-failure |

### Pre-Push Checklist
```bash
npm run lint
npm run test:run
npm run build
npx playwright test --project=chromium
npx playwright test --project=api
```

---

## Quick Reference

```bash
# Run specific test file
npx playwright test e2e/ui/tests/events/listing.spec.ts

# Run with UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Generate test from user actions
npx playwright codegen http://localhost:3000

# Show report
npx playwright show-report
```

## Commands Summary

| Command | Purpose |
|---------|---------|
| `skill("playwright-ui-agent")` | Load this skill |
| `task(subagent_type="general")` | Delegate to sub-agent with this context |
