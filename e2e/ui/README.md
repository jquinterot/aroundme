# UI E2E Testing - Page Object Model (POM) Structure

This folder contains UI/End-to-End tests using Playwright with the Page Object Model pattern.

## Folder Structure

```
e2e/ui/
├── pom/                      # Page Object Models
│   ├── BasePage.ts          # Base class with common methods
│   ├── LoginPage.ts         # Login page POM
│   ├── HeaderPage.ts        # Header component POM
│   ├── CityPage.ts          # City listing page POM
│   ├── EventDetailPage.ts   # Event detail page POM
│   └── index.ts             # Export all POMs
├── fixtures/                 # Test data and fixtures
├── utils/                    # Test utilities and helpers
└── tests/                    # Test suites
    ├── auth/                # Authentication tests
    ├── navigation/          # Navigation and tab tests
    ├── events/              # Event-related tests
    ├── places/              # Place-related tests
    ├── activities/          # Activity-related tests
    ├── profile/             # Profile tests
    └── checkout/            # Checkout/Payment tests
```

## Page Object Model Pattern

### Why POM?
1. Separation of Concerns: UI logic separate from test logic
2. Reusability: Common actions defined once, used many times
3. Maintainability: Changes to UI only require updates in one place
4. Readability: Tests read like user stories

## Running Tests

```bash
# Run all UI tests
npm run test:e2e:ui

# Run with headed browser
npm run test:e2e:ui:headed

# Debug mode
npm run test:e2e:ui:debug

# Run all API tests
npm run test:e2e:api

# Run all E2E tests
npm run test:e2e:all
```
