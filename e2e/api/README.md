# API Testing Project for AroundMe

This folder contains API-specific end-to-end tests for the AroundMe application.

## Structure

```
e2e/api/
├── README.md                 # This file
├── playwright.config.ts      # API-specific Playwright config
├── fixtures/                 # Test fixtures and mock data
│   ├── events.ts
│   ├── places.ts
│   └── users.ts
├── tests/                    # API test suites
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── register.spec.ts
│   │   └── logout.spec.ts
│   ├── events/
│   │   ├── create.spec.ts
│   │   ├── read.spec.ts
│   │   ├── update.spec.ts
│   │   ├── delete.spec.ts
│   │   └── rsvp.spec.ts
│   ├── places/
│   │   ├── create.spec.ts
│   │   ├── read.spec.ts
│   │   ├── update.spec.ts
│   │   └── delete.spec.ts
│   ├── validation/
│   │   ├── events.spec.ts
│   │   └── places.spec.ts
│   └── error-handling/
│       └── api-errors.spec.ts
└── utils/
    ├── api-client.ts         # Reusable API client
    ├── assertions.ts         # Custom assertions
    └── test-helpers.ts       # Test utilities
```

## Running API Tests

```bash
# Run all API tests
npx playwright test e2e/api

# Run specific test file
npx playwright test e2e/api/tests/auth/login.spec.ts

# Run with UI mode
npx playwright test e2e/api --ui

# Run with debug
npx playwright test e2e/api --debug
```

## Test Categories

### 1. Authentication (`auth/`)
- Login/logout flows
- Registration
- Password reset
- Token validation
- Session management

### 2. Events (`events/`)
- CRUD operations
- RSVPs
- Tickets
- Analytics
- Featured events

### 3. Places (`places/`)
- CRUD operations
- Reviews
- Claims
- Verification

### 4. Validation (`validation/`)
- Input validation
- Schema validation
- Error messages
- Edge cases

### 5. Error Handling (`error-handling/`)
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error
- Rate limiting

## Best Practices

1. **Independent Tests**: Each test should be self-contained
2. **Cleanup**: Always clean up test data after tests
3. **Assertions**: Check both success and error responses
4. **Validation**: Test edge cases and invalid inputs
5. **Documentation**: Document test purpose and expected behavior

## Environment

Tests run against the local development server by default:
- Base URL: `http://localhost:3000/api`
- Database: SQLite (test database)
- Authentication: Session-based

## Adding New Tests

1. Create a new `.spec.ts` file in the appropriate folder
2. Import the API client from `utils/api-client.ts`
3. Use fixtures for test data
4. Add cleanup in `test.afterEach()` or `test.afterAll()`
5. Run tests to verify they pass

## CI/CD Integration

API tests run in CI/CD pipeline:
- Before: Start dev server, seed test database
- After: Clean up test data, stop server
