# Fixing Test Failures - Playbook

## General Process

When tests fail, follow this systematic approach:

```
1. Reproduce locally
   ├── Unit: npm run test:run -- [pattern]
   └── E2E: npx playwright test [file] --headed

2. Analyze failure
   ├── Read error message carefully
   ├── Check line numbers and stack traces
   └── Look at screenshots/videos (E2E)

3. Identify root cause
   ├── Test bug? (wrong assertion, stale selector)
   ├── Code bug? (regression introduced)
   ├── Flaky test? (timing, race condition)
   └── Environment? (CI vs local differences)

4. Fix and verify
   ├── Make minimal fix
   ├── Run test 3 times to confirm stability
   └── Run full suite to ensure no regressions
```

## Unit Test Failures

### Type 1: Assertion Mismatch

**Error:** `Expected: "Free" Received: undefined`

**Causes:**
- Function returns wrong value
- Test data doesn't match expected shape
- Missing null/undefined handling

**Fix:**
```typescript
// BEFORE (failing)
it('should format price', () => {
  expect(formatPrice(null)).toBe('Free'); // Fails: returns undefined
});

// AFTER (fixed)
it('should format price for null input', () => {
  expect(formatPrice(null)).toBe('Free');
});

// Fix the function:
function formatPrice(price: Price | null): string {
  if (!price || price.isFree) return 'Free';
  return `COP ${price.amount?.toLocaleString()}`;
}
```

### Type 2: Mock Not Working

**Error:** `Expected mock to be called 1 time, but was called 0 times`

**Causes:**
- Mock imported before vi.mock() declaration
- Wrong mock path
- Mock not restored between tests

**Fix:**
```typescript
// BEFORE (failing)
import { fetchEvent } from '@/lib/api';
vi.mock('@/lib/api'); // Too late, module already loaded

// AFTER (fixed)
vi.mock('@/lib/api', () => ({
  fetchEvent: vi.fn()
}));

import { fetchEvent } from '@/lib/api';

beforeEach(() => {
  vi.clearAllMocks(); // Not restoreAllMocks if you want mock persisted
});
```

### Type 3: Async Timing Issues

**Error:** `AssertionError: expected promise to resolve`

**Fix:**
```typescript
// BEFORE (failing)
it('should load events', async () => {
  const result = loadEvents();
  expect(result).toHaveLength(3); // Promise not awaited
});

// AFTER (fixed)
it('should load events', async () => {
  const result = await loadEvents();
  expect(result).toHaveLength(3);
});

// OR for hooks:
it('should update state', async () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  await waitFor(() => expect(result.current.count).toBe(1));
});
```

### Type 4: Date/Time Flakiness

**Error:** Test passes in morning, fails in evening

**Fix:**
```typescript
// BEFORE (flaky)
it('should filter today events', () => {
  const today = new Date();
  const events = filterByDate(mockEvents, 'today');
  expect(events.length).toBe(2); // Depends on real time
});

// AFTER (deterministic)
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-23T12:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

it('should filter today events', () => {
  const events = filterByDate(mockEvents, 'today');
  expect(events.length).toBe(2);
});
```

## E2E Test Failures

### Type 1: Element Not Found

**Error:** `Error: locator.click: Target page, context or browser has been closed`
**OR:** `Timeout 5000ms exceeded waiting for locator('[data-testid="submit"]')`

**Diagnosis:**
```bash
# Run in debug mode to see what's on screen
npx playwright test failing.spec.ts --headed --debug

# Or with screenshot on failure (already configured)
npx playwright test failing.spec.ts
# Check test-results/failing-test-chromium/test-failed-1.png
```

**Common causes and fixes:**

```typescript
// CAUSE 1: Element not yet rendered
// Fix: Wait for element before interacting
await page.waitForSelector('[data-testid="submit"]', { timeout: 10000 });
await page.click('[data-testid="submit"]');

// CAUSE 2: Element is hidden
// Fix: Check visibility
const element = page.locator('[data-testid="submit"]');
await expect(element).toBeVisible({ timeout: 10000 });
await element.click();

// CAUSE 3: Wrong selector
// Fix: Verify data-testid in component code
// Component should have: data-testid="submit-button"
// Test should use: '[data-testid="submit-button"]'

// CAUSE 4: Element in iframe or shadow DOM
// Fix: Use frame locators
const frame = page.frameLocator('iframe[name="payment"]');
await frame.locator('[data-testid="card-number"]').fill('4242...');

// CAUSE 5: Dialog/modal overlay blocking
// Fix: Close modal first or click through it
await page.keyboard.press('Escape');
await page.click('[data-testid="submit"]');
```

### Type 2: Race Conditions

**Error:** Test passes sometimes, fails others

**Fix patterns:**

```typescript
// BAD: Fixed wait (still flaky)
await page.waitForTimeout(500);

// GOOD: Wait for network idle
await page.waitForLoadState('networkidle');

// BETTER: Wait for specific API response
await page.waitForResponse(response => 
  response.url().includes('/api/events') && response.status() === 200
);

// BEST: Wait for UI state change
await expect(page.locator('[data-testid="events-count"]')).toHaveText(/\d+ events/);
```

### Type 3: Test Isolation Failures

**Error:** Test A passes, Test A+B fails (B depends on A's state)

**Fix:**
```typescript
test.describe('Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Reset to known state before EACH test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('test A', async ({ page }) => {
    // Creates an event
    await createEvent(page, 'Test Event');
  });

  test('test B', async ({ page }) => {
    // Must NOT depend on test A
    // Create its own event
    await createEvent(page, 'Another Event');
  });
});
```

### Type 4: Authentication State

**Error:** Redirects to login instead of dashboard

**Fix:**
```typescript
// Option 1: Login in beforeEach
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.fill('[data-testid="password-input"]', 'password');
  await page.click('[data-testid="login-submit"]');
  await expect(page).toHaveURL('/dashboard');
});

// Option 2: Use storage state (faster, login once)
// In playwright.config.ts:
// projects: [{ name: 'chromium', use: { storageState: 'e2e/.auth/user.json' } }]

// Option 3: Mock authentication (fastest)
// API tests can bypass UI login
```

### Type 5: Database State Conflicts

**Error:** "Email already exists" or "Event with this name exists"

**Fix:**
```typescript
// Use unique identifiers
const timestamp = Date.now();
const uniqueEmail = `test-${timestamp}@example.com`;
const uniqueTitle = `Test Event ${timestamp}`;

// Or clean up after test
test.afterEach(async ({ request }) => {
  await request.delete(`/api/test-cleanup?email=${uniqueEmail}`);
});
```

## Fixing Flaky Tests

### The 3-Run Rule

A test is flaky if it fails at least once in 3 consecutive runs:

```bash
# Run same test 3 times
for i in {1..3}; do
  echo "Run $i"
  npx playwright test flaky.spec.ts || echo "FAILED on run $i"
done
```

### Common Fixes

```typescript
// 1. Replace arbitrary waits with explicit conditions
// BEFORE:
await page.waitForTimeout(1000);
// AFTER:
await page.waitForSelector('[data-testid="loaded"]');

// 2. Handle animations
await page.click('[data-testid="modal-open"]');
await page.waitForSelector('[data-testid="modal"]', { state: 'visible' });

// 3. Scroll element into view
const element = page.locator('[data-testid="bottom-button"]');
await element.scrollIntoViewIfNeeded();
await element.click();

// 4. Use retry-able assertions
await expect(page.locator('[data-testid="status"]')).toHaveText('Complete', { timeout: 10000 });

// 5. Disable animations in test environment
// In playwright.config.ts:
// use: { ...devices['Desktop Chrome'], launchOptions: { slowMo: 0 } }
```

## Debugging Failed CI Runs

### Download Artifacts

```bash
# GitHub CLI
gh run download <run-id> --name playwright-report-ui

# Or download from GitHub Actions UI
# Actions > Run > Artifacts > playwright-report-ui
```

### View Trace

```bash
# Unzip trace
unzip playwright-report-ui.zip

# View in trace viewer
npx playwright show-trace test-results/trace.zip
```

### Analyze Screenshots

```bash
# Compare passing vs failing screenshots
# test-results/
#   passing-test-1.png
#   failing-test-1.png
```

## Test Failure Checklist

When a test fails:

- [ ] Can reproduce locally?
- [ ] Is it a test bug or code bug?
- [ ] Is it deterministic or flaky?
- [ ] Does it fail in isolation (only this test)?
- [ ] Are there screenshots/videos available?
- [ ] Did recent code change break it?
- [ ] Is it an environment issue (CI vs local)?
- [ ] Is there a race condition?
- [ ] Are selectors still valid?
- [ ] Is test data correct?

## Regression Prevention

After fixing a test or bug:

1. **Run the test 3 times** to confirm stability
2. **Run the full suite** to catch regressions
3. **Add a regression test** if it was a code bug
4. **Document the fix** in commit message
5. **Update selectors** if UI changed
6. **Update test data** if schema changed
