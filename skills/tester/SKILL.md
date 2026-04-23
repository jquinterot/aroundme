---
name: tester
description: Expert software testing agent for the AroundMe Next.js application. Use when writing, fixing, or reviewing tests (unit and E2E), setting up CI/CD test pipelines, debugging test failures, ensuring code coverage, or verifying that code changes don't break existing tests. Triggers on test writing, test fixing, CI configuration, coverage analysis, or regression testing.
---

# Tester - AroundMe Testing Expert

Comprehensive testing skill for the AroundMe Next.js + React + TypeScript stack. Ensures tests are robust, maintainable, and aligned with project architecture.

## Test Stack Overview

| Layer | Tool | Count | Location |
|-------|------|-------|----------|
| Unit | Vitest + jsdom | 183 tests | `src/test/**/*.test.ts` |
| E2E UI | Playwright | 45 tests | `e2e/ui/**/*.spec.ts` |
| E2E API | Playwright Request | 15+ tests | `e2e/api/**/*.spec.ts` |
| CI | GitHub Actions | 4 workflows | `.github/workflows/` |

## Test Commands Quick Reference

```bash
# Unit tests
npm run test           # Watch mode (dev)
npm run test:run       # Single run (CI)
npm run test:ui        # Watch mode with UI

# E2E tests
npm run test:e2e:ui              # All UI tests (headless)
npm run test:e2e:ui:headed       # UI tests (headed)
npm run test:e2e:ui:debug        # UI tests (debug mode)
npm run test:e2e:api             # All API tests
npm run test:e2e:all             # All E2E tests
npm run test:e2e:report          # Show last report

# Playwright specific
npx playwright test e2e/ui/tests/events/listing.spec.ts     # Single file
npx playwright test --project=chromium --grep "search"      # Filter by title
npx playwright codegen http://localhost:3000                 # Record new tests
```

## Testing Philosophy

### Test Pyramid for This Project

```
      /\
     /  \  E2E (slow, expensive)     - 60 tests
    /----\                           - User journeys, critical paths
   /      \  Integration             - API contracts, DB queries
  /--------\                         - Service layer tests
 /          \  Unit (fast, cheap)    - 183 tests
/------------\                       - Pure functions, utilities, validation
```

**Guidelines:**
- Favor unit tests for business logic (cheap, fast, deterministic)
- Use E2E for critical user journeys only (login, checkout, create event)
- Avoid E2E for edge cases that can be unit tested
- API tests validate contracts between frontend and backend

### What to Test

**Unit Tests (Vitest):**
- ✅ Utility functions (`src/lib/utils.ts`, `src/lib/events/utils.ts`)
- ✅ Validation logic (Zod schemas, form validators)
- ✅ Constants and mapping functions (`src/lib/constants.ts`)
- ✅ Date/time calculations and formatting
- ✅ Search/filter/sort algorithms
- ✅ Price calculations and tier logic
- ✅ Business rules (RSVP logic, feature flags)

**Avoid Unit Tests For:**
- ❌ Components requiring complex DOM mocking
- ❌ Database queries (test at API layer instead)
- ❌ External API integrations (test at service layer)
- ❌ Visual/CSS testing (use E2E or visual regression)

**E2E Tests (Playwright):**
- ✅ Authentication flows (login, signup, logout)
- ✅ Content discovery (events, places, activities listings)
- ✅ Critical user journeys (create event, RSVP, checkout)
- ✅ Navigation and search
- ✅ Form submissions with validation
- ✅ Map interactions
- ✅ Admin operations

**Avoid E2E Tests For:**
- ❌ Pure utility functions (use unit tests)
- ❌ Edge cases that don't affect UI
- ❌ Internal state management

## Unit Test Patterns (Vitest)

### Basic Structure

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Group related tests
describe('Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Reset state, mocks
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test cases follow Arrange-Act-Assert
  it('should [expected behavior] when [condition]', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });

  it('should handle [edge case]', () => {
    expect(() => functionToTest(null)).toThrow('Invalid input');
  });
});
```

### Testing Utilities with Mocks

```typescript
import { vi } from 'vitest';

describe('API utilities', () => {
  it('should handle rate limit errors', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: 'Too many requests' }),
    });

    const result = await fetchWithRetry('/api/events');
    
    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(3); // Retries
  });
});
```

### Testing React Components (Minimal)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Date/Time Logic

```typescript
describe('Event date filtering', () => {
  // Use fixed dates for deterministic tests
  const mockNow = new Date('2026-04-23T12:00:00Z');
  
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should filter events happening today', () => {
    const events = [
      { id: '1', dateStart: '2026-04-23T14:00:00Z' },
      { id: '2', dateStart: '2026-04-24T10:00:00Z' },
    ];
    
    const todayEvents = filterEventsByDate(events, 'today');
    expect(todayEvents).toHaveLength(1);
    expect(todayEvents[0].id).toBe('1');
  });
});
```

## E2E Test Patterns (Playwright)

### Page Object Model (POM)

All E2E tests use POM pattern with fixtures:

```typescript
// e2e/ui/pom/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

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

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
  }
}
```

### Test with Fixtures

```typescript
// e2e/ui/tests/auth/login.spec.ts
import { test, expect } from '../../fixtures';

test.describe('Login Flow', () => {
  test('should login with valid credentials', async ({ page, loginPage }) => {
    await test.step('Navigate to login', async () => {
      await loginPage.goto();
      await loginPage.waitForPageLoad();
    });

    await test.step('Fill credentials and submit', async () => {
      await loginPage.login('user@example.com', 'password123');
    });

    await test.step('Verify redirect to dashboard', async () => {
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('[data-testid="dashboard-page-container"]')).toBeVisible();
    });
  });
});
```

### API Test Pattern

```typescript
// e2e/api/tests/events/events.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Events API', () => {
  test('GET /api/events returns list of events', async ({ request }) => {
    const response = await request.get('/events');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('POST /api/events creates event with valid data', async ({ request }) => {
    const response = await request.post('/events', {
      data: {
        title: 'Test Event',
        description: 'Test description',
        category: 'music',
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.title).toBe('Test Event');
  });
});
```

## CI/CD Testing

### GitHub Actions Workflows

**Unit Tests** (`.github/workflows/unit-tests.yml`):
- Runs on push/PR to `main` and `develop`
- Node 20, `npm ci`, `npx prisma generate`, `npm run test:run`
- Concurrency: cancels in-progress runs on new push

**E2E UI Tests** (`.github/workflows/e2e-ui.yml`):
- PostgreSQL 16 service container
- Database reset with seed data
- Full build + start app
- Playwright Chromium tests
- Uploads screenshots/videos on failure

**Lint & Build** (`.github/workflows/lint-build.yml`):
- Runs `npm run lint` and `npm run build`
- Ensures no TypeScript or lint errors

### Test Quality Gates

Every PR must pass:
1. ✅ Lint check (`npm run lint`)
2. ✅ Unit tests (`npm run test:run` - 183 tests)
3. ✅ Build (`npm run build`)
4. ✅ E2E UI tests (`npm run test:e2e:ui` - 45 tests)
5. ✅ E2E API tests (`npm run test:e2e:api`)

### Local CI Simulation

Before pushing, run locally:
```bash
#!/bin/bash
set -e

echo "=== 1. Lint ==="
npm run lint

echo "=== 2. Unit Tests ==="
npm run test:run

echo "=== 3. Build ==="
npm run build

echo "=== 4. DB Reset ==="
npm run db:reset

echo "=== 5. E2E Tests ==="
npx playwright test

echo "=== ALL CI CHECKS PASSED ==="
```

## Debugging Test Failures

### Unit Test Failures

```bash
# Run specific test file
npx vitest run src/test/basic.test.ts

# Run with verbose output
npx vitest run --reporter=verbose

# Debug specific test
npx vitest run --testNamePattern="should filter events"

# Watch mode for debugging
npx vitest src/test/basic.test.ts
```

### E2E Test Failures

```bash
# Run in headed mode to see what's happening
npx playwright test e2e/ui/tests/events/listing.spec.ts --headed

# Run with debug mode
npx playwright test e2e/ui/tests/events/listing.spec.ts --debug

# Run specific test by title
npx playwright test --grep "should display event cards"

# View last run report
npx playwright show-report

# Trace viewer (if trace enabled)
npx playwright show-trace test-results/trace.zip
```

### Common Failure Patterns and Fixes

**Flaky E2E: Timing issues**
```typescript
// BAD: Fixed waits
await page.waitForTimeout(1000);

// GOOD: Wait for specific state
await page.waitForLoadState('networkidle');
await expect(page.locator('[data-testid="result"]')).toBeVisible({ timeout: 15000 });
```

**Flaky E2E: Race conditions**
```typescript
// BAD: Click without checking visibility
await page.click('[data-testid="submit"]');

// GOOD: Ensure element is ready
const button = page.locator('[data-testid="submit"]');
await expect(button).toBeEnabled();
await button.click();
```

**Unit test: Mock not restored**
```typescript
// BAD: Mock persists between tests
vi.fn().mockResolvedValue({});

// GOOD: Restore after each
afterEach(() => {
  vi.restoreAllMocks();
});
```

**Unit test: Time-based flakiness**
```typescript
// BAD: Uses real time
const result = isEventUpcoming(eventDate);

// GOOD: Fake timers
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-04-23'));
```

## Test Coverage Strategy

### Coverage Goals

| Layer | Target | Current |
|-------|--------|---------|
| Utilities | 90%+ | ~85% |
| Validation | 95%+ | ~90% |
| API Routes | 70%+ | ~60% |
| Components | 60%+ | ~40% |
| E2E Critical Paths | 100% | ~80% |

### Adding Coverage for New Code

When implementing a new feature, add tests for:
1. **Happy path** - Normal operation succeeds
2. **Validation errors** - Invalid inputs rejected
3. **Edge cases** - Empty arrays, null values, boundary conditions
4. **Error handling** - Network failures, database errors
5. **Permissions** - Unauthorized access blocked

### Coverage Report

```bash
# Generate coverage report
npx vitest run --coverage

# View HTML report
coverage/index.html
```

## Writing Tests for Architecture

### Testing Repository Pattern

```typescript
describe('PrismaEventRepository', () => {
  let repository: PrismaEventRepository;
  let mockPrisma: MockedObject<PrismaClient>;

  beforeEach(() => {
    mockPrisma = {
      event: { findUnique: vi.fn() },
    } as unknown as MockedObject<PrismaClient>;
    
    repository = new PrismaEventRepository(mockPrisma);
  });

  it('should find event by id', async () => {
    const mockEvent = { id: '1', title: 'Test' };
    mockPrisma.event.findUnique.mockResolvedValue(mockEvent);

    const result = await repository.findById('1');
    
    expect(result).toEqual(mockEvent);
    expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
```

### Testing Service Layer

```typescript
describe('EventService', () => {
  it('should not allow RSVP for past events', async () => {
    const pastEvent = { dateStart: new Date('2020-01-01') };
    
    await expect(
      eventService.rsvpToEvent(pastEvent.id, 'going')
    ).rejects.toThrow('Event has already passed');
  });
});
```

### Testing Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useEvent', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch event data', async () => {
    const { result } = renderHook(() => useEvent('1'), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toBeDefined();
  });
});
```

## Regression Testing

When fixing bugs, always add a test that would have caught the bug:

```typescript
describe('Bug fixes', () => {
  // Regression test for: "Event price shows NaN for free events"
  it('should display "Free" for events with price.isFree=true', () => {
    const event = { price: { isFree: true, amount: null } };
    expect(formatEventPrice(event)).toBe('Free');
  });

  // Regression test for: "RSVP count incorrect after cancellation"
  it('should decrement count when RSVP is cancelled', () => {
    const rsvps = [{ userId: '1', status: 'going' }];
    const updated = cancelRSVP(rsvps, '1');
    expect(getRSVPCount(updated, 'going')).toBe(0);
  });
});
```

## Test Maintenance

### When to Update Tests

- **Adding features** - Add new test cases
- **Refactoring** - Ensure tests still pass (they are your safety net)
- **API changes** - Update mocks and assertions
- **UI changes** - Update selectors if data-testid changes
- **Bug fixes** - Add regression test

### When to Delete Tests

- Feature removed
- Test duplicated elsewhere
- Test testing implementation detail (not behavior)
- Test consistently flaky and cannot be fixed

### Test Naming Convention

```typescript
// Good: Describes behavior, not implementation
it('should display "Free" badge for free events')
it('should redirect unauthenticated users to login')
it('should send confirmation email after RSVP')

// Bad: Describes implementation
it('should call setState with true')
it('should render div with className foo')
it('should make POST request to /api/events')
```

## Checklist for New Tests

### Unit Tests
- [ ] Test file in `src/test/` or colocated with source
- [ ] Uses `describe`/`it` structure with clear names
- [ ] Follows Arrange-Act-Assert pattern
- [ ] Tests happy path and at least one error case
- [ ] Mocks external dependencies (fetch, dates, random)
- [ ] Restores mocks in `afterEach`
- [ ] Runs in under 1 second
- [ ] Deterministic (no real timers, no random data)

### E2E Tests
- [ ] Uses POM fixtures from `e2e/ui/fixtures`
- [ ] Uses `test.step()` for clarity
- [ ] Uses `data-testid` selectors (not CSS classes)
- [ ] Waits for elements before interacting
- [ ] Tests one user journey per test
- [ ] Has proper `beforeEach` setup
- [ ] Cleans up state (logout, delete created data)
- [ ] Runs in under 30 seconds

### CI/CD
- [ ] Added to appropriate GitHub Actions workflow
- [ ] Passes in CI environment (headless, fresh DB)
- [ ] Uploads artifacts on failure (screenshots, logs)
- [ ] Does not increase build time by >2 minutes
