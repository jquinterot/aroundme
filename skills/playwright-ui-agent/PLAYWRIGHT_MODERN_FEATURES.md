# Playwright Modern Features Implementation Guide

This document shows how to apply Playwright 1.50+ modern features to the AroundMe E2E test suite for immediate value.

## 1. Replace Manual Selectors with `getByTestId()`

### POM Updates

```typescript
// e2e/ui/pom/LoginPage.ts — BEFORE
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/login');
    this.emailInput = page.locator('[data-testid="login-email-input"]');
    this.passwordInput = page.locator('[data-testid="login-password-input"]');
    this.submitButton = page.locator('[data-testid="login-submit-button"]');
  }
}

// e2e/ui/pom/LoginPage.ts — AFTER
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/login');
    this.emailInput = page.getByTestId('login-email-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
  }
}
```

### Test Updates

```typescript
// BEFORE
await page.click('[data-testid="event-filter-category-music"]');
await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();

// AFTER
await page.getByTestId('event-filter-category-music').click();
await expect(page.getByTestId('dashboard-page')).toBeVisible();
```

**Value**: Cleaner code, built-in Playwright support, better error messages.

---

## 2. Replace `waitForTimeout` with `expect.poll()`

### Current Anti-Patterns Found

```typescript
// e2e/ui/tests/events/listing.spec.ts — ANTI-PATTERN
await test.step('Wait for search results', async () => {
  await page.waitForTimeout(500);
});

// e2e/ui/tests/activities/listing.spec.ts — ANTI-PATTERN
await test.step('Wait for filter to apply', async () => {
  await page.waitForTimeout(500);
});
```

### Modern Replacement

```typescript
// AFTER — using expect.poll()
await test.step('Wait for search results', async () => {
  await expect.poll(
    async () => page.locator('[data-testid^="event-card"]').count(),
    { timeout: 5000 }
  ).toBeGreaterThan(0);
});
```

Or even simpler — just wait for the element:

```typescript
// BEST — direct element wait
await expect(page.locator('[data-testid^="event-card"]').first()).toBeVisible();
```

**Value**: Eliminates arbitrary waits, reduces flakiness, faster tests.

---

## 3. Replace `networkidle` with Element Waits

### Current Anti-Pattern

```typescript
// e2e/ui/tests/events/listing.spec.ts
await page.goto('/bogota');
await page.waitForLoadState('networkidle');

// e2e/ui/pom/BasePage.ts
async waitForPageLoad(): Promise<void> {
  await this.page.waitForLoadState('networkidle');
}
```

### Modern Replacement

```typescript
// BasePage.ts — AFTER
async waitForPageLoad(): Promise<void> {
  await this.page.waitForSelector('body', { state: 'visible' });
}

// Or in tests — wait for the specific element you need
await page.goto('/bogota');
await expect(page.locator('[data-testid^="event-card"]').first()).toBeVisible({ timeout: 15000 });
```

**Value**: `networkidle` is unreliable with SPAs and background requests. Element waits are deterministic.

---

## 4. Use `expect.soft()` for Multiple Independent Assertions

### Use Case: Event Detail Page

```typescript
// BEFORE — stops at first failure
test('should display event information', async ({ page }) => {
  await page.goto('/event/123');
  await expect(page.getByTestId('event-title')).toBeVisible();
  await expect(page.getByTestId('event-date')).toContainText('May');
  await expect(page.getByTestId('event-venue')).toBeVisible();
  await expect(page.getByTestId('event-category-badge')).toBeVisible();
});

// AFTER — all assertions run, reports all failures
import { test, expect } from '@playwright/test';

test('should display event information', async ({ page }) => {
  await page.goto('/event/123');
  await expect.soft(page.getByTestId('event-title')).toBeVisible();
  await expect.soft(page.getByTestId('event-date')).toContainText('May');
  await expect.soft(page.getByTestId('event-venue')).toBeVisible();
  await expect.soft(page.getByTestId('event-category-badge')).toBeVisible();
});
```

**Value**: See all failures at once instead of fixing one by one.

---

## 5. Use `page.clock` for Time-Sensitive Tests

### Use Case: Event Countdown, Session Expiry

```typescript
// e2e/ui/tests/events/countdown.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Event Countdown', () => {
  test('should show countdown for upcoming event', async ({ page }) => {
    await page.clock.install();
    
    await page.goto('/event/future-event-id');
    
    // Initial state: 2 days remaining
    await expect(page.getByTestId('countdown-days')).toHaveText('2');
    
    // Fast forward 1 day
    await page.clock.fastForward('1 day');
    await expect(page.getByTestId('countdown-days')).toHaveText('1');
    
    // Fast forward another day
    await page.clock.fastForward('1 day');
    await expect(page.getByTestId('countdown-days')).toHaveText('0');
  });
});
```

**Value**: Test time-dependent UI without waiting in real-time.

---

## 6. Use `locator.filter()` for Complex Selections

### Use Case: Filter Events by Multiple Criteria

```typescript
// BEFORE — complex CSS selector
const freeMusicEvent = page.locator(
  '[data-testid="event-card"]' +
  '[data-category="music"]' +
  ':has([data-testid="free-badge"])'
);

// AFTER — chain filters
const freeMusicEvent = page
  .getByTestId('event-card')
  .filter({ has: page.getByTestId('category-music') })
  .filter({ has: page.getByTestId('free-badge') });
```

**Value**: More readable, easier to maintain, less brittle.

---

## 7. Use `test.step()` with `box` for Internal Steps

### Use Case: Login Helper

```typescript
// e2e/ui/steps/auth.steps.ts
export const AuthSteps = {
  async loginAsAdmin(page: Page): Promise<void> {
    await test.step('Authenticate as admin', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('admin@aroundme.co', 'admin123');
      await page.waitForURL(/\/(dashboard|bogota)/, { timeout: 10000 }).catch(() => {});
    }, { box: true });
  },
};
```

With `box: true`, if login fails, the error points to the test line that called `loginAsAdmin()`, not deep inside the step.

**Value**: Cleaner error reports, easier debugging.

---

## 8. Use `test.info().annotations` for Test Metadata

### Use Case: Link Tests to Features

```typescript
test('should checkout with Stripe', async ({ page }) => {
  test.info().annotations.push(
    { type: 'feature', description: 'Stripe Checkout' },
    { type: 'story', description: 'USER-42' },
    { type: 'priority', description: 'critical' }
  );
  
  // Test code...
});
```

**Value**: Rich metadata in HTML reports, easier to filter and organize.

---

## 9. Use `mergeTests` for Composable Fixtures

### Use Case: Auth + Page Fixtures

```typescript
// e2e/ui/fixtures/auth-fixtures.ts
import { test as base } from '@playwright/test';
import { AuthSteps } from '../steps/auth.steps';

export const test = base.extend<{
  authSteps: AuthSteps;
}>({
  authSteps: async ({ page }, use) => {
    await use(new AuthSteps(page));
  },
});

// e2e/ui/fixtures/index.ts
import { mergeTests } from '@playwright/test';
import { test as authTest } from './auth-fixtures';
import { test as pageTest } from './page-fixtures';

export const test = mergeTests(authTest, pageTest);
```

**Value**: Modular fixtures, easier to maintain, no giant fixture files.

---

## 10. Add Mobile Viewport Tests with `test.use()`

### Use Case: Mobile Navigation

```typescript
// e2e/ui/tests/mobile/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 375, height: 667 },
  isMobile: true,
});

test.describe('Mobile Navigation', () => {
  test('should show hamburger menu', async ({ page }) => {
    await page.goto('/bogota');
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible();
    await expect(page.getByTestId('desktop-nav')).not.toBeVisible();
  });

  test('should expand mobile menu', async ({ page }) => {
    await page.goto('/bogota');
    await page.getByTestId('mobile-menu-button').click();
    await expect(page.getByTestId('mobile-menu-panel')).toBeVisible();
  });
});
```

**Value**: Test responsive design without separate device projects.

---

## Implementation Priority

| Priority | Feature | Effort | Value |
|----------|---------|--------|-------|
| **P0** | Replace `getByTestId()` | Low | High — cleaner code |
| **P0** | Remove `waitForTimeout(500)` | Low | High — faster, less flaky |
| **P0** | Remove `networkidle` waits | Low | High — deterministic |
| **P1** | Add `expect.soft()` | Low | Medium — better reporting |
| **P1** | Add `expect.poll()` | Low | Medium — dynamic waits |
| **P2** | Add `page.clock` | Medium | Medium — time tests |
| **P2** | Add mobile viewport tests | Medium | High — responsive coverage |
| **P3** | Add annotations | Low | Low — reporting enrichment |

---

## Files to Update

1. **e2e/ui/pom/BasePage.ts** — Remove `networkidle`, use element waits
2. **e2e/ui/pom/*.ts** — Replace `locator('[data-testid="..."]')` with `getByTestId('...')`
3. **e2e/ui/tests/**/*.spec.ts** — Remove all `waitForTimeout(500)`
4. **e2e/ui/steps/common.steps.ts** — Add `expect.poll()` helpers
5. **playwright.config.ts** — Consider adding mobile project

---

## Quick Migration Script

```bash
# Step 1: Find all waitForTimeout usages
grep -rn "waitForTimeout" e2e/ui/tests/ --include="*.ts"

# Step 2: Find all networkidle usages
grep -rn "networkidle" e2e/ui/ --include="*.ts"

# Step 3: Find all manual data-testid selectors
grep -rn 'data-testid="' e2e/ui/pom/ --include="*.ts"
```
