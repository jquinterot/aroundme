# Test Architecture for AroundMe

## Test Directory Structure

```
aroundme/
├── src/
│   ├── test/                    # Unit tests
│   │   ├── setup.ts             # Vitest setup (jest-dom)
│   │   ├── basic.test.ts        # Utility tests (183 total)
│   │   ├── activity.test.ts
│   │   ├── checkin.test.ts
│   │   ├── features.test.ts
│   │   └── placeholder.test.ts
│   ├── lib/                     # Test utilities alongside source
│   │   └── utils.test.ts        # Colocated tests (if preferred)
│   └── ...
├── e2e/
│   ├── ui/                      # E2E UI tests
│   │   ├── pom/                 # Page Object Models
│   │   │   ├── BasePage.ts      # Base POM class
│   │   │   ├── LoginPage.ts
│   │   │   ├── DashboardPage.ts
│   │   │   └── index.ts         # Barrel exports
│   │   ├── fixtures/            # Test fixtures
│   │   │   ├── index.ts         # Fixtures definition
│   │   │   └── data.ts          # Test data
│   │   ├── tests/               # Test files
│   │   │   ├── auth/
│   │   │   │   ├── auth-flow.spec.ts
│   │   │   │   └── additional-tests.spec.ts
│   │   │   ├── events/
│   │   │   │   ├── listing.spec.ts
│   │   │   │   ├── detail.spec.ts
│   │   │   │   ├── rsvp-flow.spec.ts
│   │   │   │   ├── event-actions.spec.ts
│   │   │   │   ├── create-event.spec.ts
│   │   │   │   └── event-detail-best-practices.spec.ts
│   │   │   ├── places/
│   │   │   │   ├── listing.spec.ts
│   │   │   │   └── detail.spec.ts
│   │   │   ├── activities/
│   │   │   │   ├── listing.spec.ts
│   │   │   │   └── detail.spec.ts
│   │   │   ├── navigation/
│   │   │   │   ├── tab-navigation.spec.ts
│   │   │   │   └── search.spec.ts
│   │   │   ├── profile/
│   │   │   │   └── profile.spec.ts
│   │   │   ├── checkout/
│   │   │   │   └── checkout.spec.ts
│   │   │   └── create-event/
│   │   │       └── form-flow.spec.ts
│   │   └── utils/               # E2E utilities
│   └── api/                     # E2E API tests
│       └── tests/
│           ├── events/
│           │   ├── events.spec.ts
│           │   └── create.spec.ts
│           ├── places/
│           │   └── places.spec.ts
│           ├── activities/
│           │   └── activities.spec.ts
│           ├── cities/
│           │   └── cities.spec.ts
│           ├── search/
│           │   └── search.spec.ts
│           └── validation/
│               └── validation.spec.ts
├── playwright.config.ts          # E2E config
├── playwright.api.config.ts      # API test config (if separate)
├── vitest.config.ts              # Unit test config
└── .github/workflows/            # CI pipelines
    ├── unit-tests.yml
    ├── e2e-ui.yml
    ├── e2e-api.yml
    └── lint-build.yml
```

## Configuration Files

### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // No need to import describe/it/expect
    environment: 'jsdom',    // Browser-like environment
    setupFiles: ['./src/test/setup.ts'],  // Setup file
    include: ['src/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Playwright Config (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,    // Retry in CI
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  projects: [
    {
      name: 'chromium',
      testMatch: /ui\/.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts$/,
      use: {
        baseURL: 'http://localhost:3000/api',
      },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
    env: { PLAYWRIGHT: 'true' },
  },
  
  expect: { timeout: 10000 },
  timeout: 30 * 1000,
});
```

## Test Data Strategy

### Fixture Data

```typescript
// e2e/ui/fixtures/data.ts
export const testUsers = {
  valid: {
    email: 'test@aroundme.co',
    password: 'TestPass123!',
    name: 'Test User',
  },
  admin: {
    email: 'admin@aroundme.co',
    password: 'AdminPass123!',
    name: 'Admin User',
  },
};

export const testEvents = {
  music: {
    title: 'Rock Concert',
    category: 'music',
    description: 'Amazing rock concert',
    dateStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    venue: { name: 'Test Venue', coordinates: { lat: 4.711, lng: -74.072 } },
  },
};
```

### Database Seeding for Tests

```typescript
// prisma/seed.ts
// Seed script used by CI for consistent test data
async function main() {
  // Create test user
  await prisma.user.upsert({
    where: { email: 'test@aroundme.co' },
    update: {},
    create: {
      email: 'test@aroundme.co',
      name: 'Test User',
      password: await bcrypt.hash('TestPass123!', 12),
    },
  });

  // Create test events
  await prisma.event.createMany({
    data: generateMockEvents(20),
  });
}
```

## Test Isolation Levels

### Level 1: Pure Unit Tests (Fastest)

No external dependencies, no side effects:

```typescript
describe('formatPrice', () => {
  it('formats COP currency', () => {
    expect(formatPrice(50000)).toBe('COP 50,000');
  });
});
```

**Speed:** < 1ms
**Count:** 100+ tests

### Level 2: Unit Tests with Mocks

Mock external dependencies:

```typescript
describe('useEvent', () => {
  it('fetches event data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: '1', title: 'Test' }),
    });
    global.fetch = mockFetch;
    
    const { result } = renderHook(() => useEvent('1'));
    await waitFor(() => expect(result.current.data).toBeDefined());
  });
});
```

**Speed:** 10-50ms
**Count:** 50+ tests

### Level 3: API Tests

Test API routes with real HTTP:

```typescript
test('GET /api/events returns events', async ({ request }) => {
  const response = await request.get('/events');
  expect(response.ok()).toBeTruthy();
});
```

**Speed:** 100-500ms
**Count:** 15+ tests
**Requires:** Database, server running

### Level 4: E2E UI Tests (Slowest)

Full browser automation:

```typescript
test('user can create event', async ({ page }) => {
  await page.goto('/create-event');
  await page.fill('[data-testid="title-input"]', 'Test');
  await page.click('[data-testid="submit-button"]');
  await expect(page).toHaveURL(/\/event\/.+/);
});
```

**Speed:** 5-30 seconds
**Count:** 45 tests
**Requires:** Database, server, browser

## Testing Layers by Architecture

```
Presentation (Components)
  └── React Testing Library (minimal)
      - Component rendering
      - User interactions
      - Accessibility

Application (Hooks, Services)
  └── Vitest + mocks
      - Hook behavior
      - Service logic
      - State management

Domain (Business logic)
  └── Vitest (pure functions)
      - Validation rules
      - Calculations
      - Data transformations

Infrastructure (API, DB)
  └── Playwright API tests
      - Route handlers
      - Database queries
      - External integrations
```

## Test Utilities

### Custom Matchers

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { expect } from 'vitest';

// Custom matcher for API responses
expect.extend({
  toBeSuccessfulResponse(received) {
    const pass = received.success === true;
    return {
      pass,
      message: () => `expected response to be successful`,
    };
  },
});
```

### Helper Functions

```typescript
// e2e/ui/utils/test-helpers.ts
export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function clearAllFilters(page: Page) {
  const clearButton = page.locator('[data-testid="filter-clear"]');
  if (await clearButton.isVisible()) {
    await clearButton.click();
  }
}

export async function fillForm(page: Page, data: Record<string, string>) {
  for (const [field, value] of Object.entries(data)) {
    await page.fill(`[data-testid="${field}-input"]`, value);
  }
}
```

## Environment-Aware Testing

### Detect Test Environment

```typescript
// In application code
const isTestEnvironment = process.env.PLAYWRIGHT === 'true';
const isCI = process.env.CI === 'true';

// Disable animations in tests
if (isTestEnvironment) {
  document.documentElement.classList.add('disable-animations');
}
```

### Test-Specific Configuration

```typescript
// .env.test
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aroundme_test?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="re_test_xxx"
STRIPE_SECRET_KEY="sk_test_xxx"
```

## Adding Tests for New Features

### Feature: Event Waitlist

```
1. Unit tests (src/test/waitlist.test.ts)
   - waitlist sorting algorithm
   - notification trigger logic
   - capacity calculations

2. API tests (e2e/api/tests/events/waitlist.spec.ts)
   - POST /api/events/:id/waitlist
   - GET /api/events/:id/waitlist
   - DELETE /api/events/:id/waitlist

3. E2E tests (e2e/ui/tests/events/waitlist.spec.ts)
   - Join waitlist flow
   - Leave waitlist flow
   - Notification on spot available
```

### Implementation Order

1. Write API tests first (define contract)
2. Implement API route
3. Write unit tests for business logic
4. Implement components
5. Write E2E tests for critical path
6. Run full suite

## Performance Budgets

### Test Execution Time Budgets

| Suite | Target | Max |
|-------|--------|-----|
| Unit tests (all) | 3s | 10s |
| Single unit test | 50ms | 200ms |
| API tests (all) | 30s | 60s |
| Single API test | 1s | 3s |
| E2E UI tests (all) | 3min | 5min |
| Single E2E test | 10s | 30s |

### CI Pipeline Time Budgets

| Workflow | Target | Max |
|----------|--------|-----|
| Lint & Build | 2min | 3min |
| Unit Tests | 1min | 2min |
| E2E API | 2min | 3min |
| E2E UI | 5min | 8min |
| Total | 10min | 16min |

If tests exceed budgets:
1. Profile slow tests
2. Parallelize if possible
3. Move heavy tests to scheduled runs
4. Optimize test data setup
