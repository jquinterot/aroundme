# API E2E Testing Best Practices Guide

This document outlines the best practices for API testing in the AroundMe project.

## 📁 Test Architecture

```
e2e/api/
├── utils/                # Test utilities & API client
│   ├── api-client.ts    # Reusable API client
│   └── test-helpers.ts  # Test utilities
├── fixtures/            # Test data
│   └── index.ts        # All test data
├── types.ts            # TypeScript types
├── tests/              # Test suites
│   ├── auth/
│   ├── events/
│   ├── places/
│   └── ...
└── BEST_PRACTICES.md   # This file
```

## ✅ Best Practices Implemented

### 1. **Centralized API Client**

**Purpose**: Reusable HTTP client with consistent error handling.

```typescript
// Usage
const client = createApiClient(request);
const response = await client.createEvent(eventData);

// Response structure
{
  success: boolean,
  status: number,
  data?: T,
  error?: string,
  code?: string,
  errorId?: string,
  timestamp?: string
}
```

### 2. **Type-Safe Fixtures**

**Purpose**: Consistent, type-safe test data.

```typescript
import { users, events, places } from '../fixtures';

const testUser = users.valid;
const testEvent = generateUniqueEvent(events.music);
```

**Available Fixtures**:
- `users` - valid, admin, new, invalid
- `events` - music, food, tech, minimal, invalid
- `places` - restaurant, cafe, bar, minimal, invalid
- `activities` - dance, tour, yoga
- `rsvps` - going, interested, maybe, invalid
- `bookings` - valid, minimal, invalid
- `reviews` - excellent, good, average
- `cities` - bogota, medellin, cali
- `errorCodes` - all error codes
- `httpStatus` - HTTP status codes

### 3. **Test Steps with `test.step()`**

```typescript
test('should create event', async ({ request }) => {
  await test.step('Setup authenticated client', async () => {
    client = await createAuthenticatedClient(request, users.valid);
  });
  
  await test.step('Create event', async () => {
    response = await client.createEvent(eventData);
  });
  
  await test.step('Verify response', async () => {
    verifySuccessResponse(response);
  });
});
```

### 4. **Data Cleanup**

```typescript
const testData = new TestDataCollector();

test.afterEach(async ({ request }) => {
  const client = createApiClient(request);
  await cleanupTestData(client, {
    events: testData.getEventIds(),
    places: testData.getPlaceIds(),
  });
});
```

### 5. **Consistent Error Verification**

```typescript
// Standard error assertion
verifyErrorResponse(response, 400, 'VALIDATION_ERROR');

// Field-specific error
assertFieldError(response, 'title', 'required');

// Success assertion
verifySuccessResponse(response);
```

### 6. **Test Isolation**

```typescript
// Each test should be independent
test('should create event', async ({ request }) => {
  const client = await createAuthenticatedClient(request, users.new);
  // Test logic
});

// Generate unique data
const event = generateUniqueEvent(events.music);
```

## 🎯 API Test Patterns

### AAA Pattern (Arrange-Act-Assert)

```typescript
test('should RSVP to event', async ({ request }) => {
  // Arrange
  const client = await createAuthenticatedClient(request, users.valid);
  const eventResponse = await client.createEvent(events.music);
  const eventId = eventResponse.data?.id;
  
  // Act
  const rsvpResponse = await client.rsvpToEvent(eventId, 'going');
  
  // Assert
  verifySuccessResponse(rsvpResponse);
  expect(rsvpResponse.data?.rsvp.status).toBe('going');
});
```

### Given-When-Then

```typescript
test('should return 400 for invalid email', async ({ request }) => {
  // Given
  const client = createApiClient(request);
  const invalidUser = users.invalid;
  
  // When
  const response = await client.register(
    invalidUser.email,
    invalidUser.password,
    invalidUser.name
  );
  
  // Then
  verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  expect(response.error).toContain('email');
});
```

## 🔧 API Client Features

### Authentication

```typescript
// Manual auth
await client.login(user.email, user.password);

// Auto-auth helper
const client = await createAuthenticatedClient(request, user);

// Set session manually
client.setSessionCookie('session-token');
```

### Generic Requests

```typescript
// Any HTTP method
const response = await client.requestWithAuth('GET', '/events');
const response = await client.requestWithAuth('POST', '/events', data);
const response = await client.requestWithAuth('PUT', `/events/${id}`, data);
const response = await client.requestWithAuth('DELETE', `/events/${id}`);
```

### Error Handling

```typescript
// All errors include:
{
  success: false,
  status: 400,
  error: "Human-readable message",
  code: "ERROR_CODE",
  errorId: "err_1699123456789_abc123xyz",
  timestamp: "2024-01-15T10:30:45.123Z"
}
```

## 🧪 Test Categories

### 1. **Happy Path Tests**

```typescript
test('should create event with valid data', async ({ request }) => {
  const client = await createAuthenticatedClient(request, users.valid);
  const event = generateUniqueEvent(events.music);
  
  const response = await client.createEvent(event);
  
  verifySuccessResponse(response);
  expect(response.data?.id).toBeDefined();
  expect(response.data?.title).toBe(event.title);
});
```

### 2. **Validation Tests**

```typescript
test('should require title field', async ({ request }) => {
  const client = await createAuthenticatedClient(request, users.valid);
  
  const response = await client.createEvent({
    ...events.minimal,
    title: '',
  });
  
  verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
  assertFieldError(response, 'title');
});
```

### 3. **Authorization Tests**

```typescript
test('should require auth for protected endpoints', async ({ request }) => {
  const client = createApiClient(request); // No auth
  
  const response = await client.createEvent(events.music);
  
  verifyErrorResponse(response, 401, 'UNAUTHORIZED');
});
```

### 4. **Error Handling Tests**

```typescript
test('should handle 404 gracefully', async ({ request }) => {
  const client = await createAuthenticatedClient(request, users.valid);
  
  const response = await client.getEvent('non-existent-id');
  
  verifyErrorResponse(response, 404, 'NOT_FOUND');
});
```

### 5. **Edge Case Tests**

```typescript
test('should handle special characters in title', async ({ request }) => {
  const client = await createAuthenticatedClient(request, users.valid);
  const event = {
    ...events.minimal,
    title: 'Event with special chars: <>&"\'',
  };
  
  const response = await client.createEvent(event);
  
  verifySuccessResponse(response);
});
```

## 📊 Testing Patterns

### CRUD Operations

```typescript
test.describe('Events CRUD', () => {
  test('CREATE - should create event', async () => {
    // Test creation
  });
  
  test('READ - should get event by id', async () => {
    // Test retrieval
  });
  
  test('UPDATE - should update event', async () => {
    // Test update
  });
  
  test('DELETE - should delete event', async () => {
    // Test deletion
  });
});
```

### Pagination

```typescript
test('should paginate results', async ({ request }) => {
  const client = createApiClient(request);
  
  const response = await client.requestWithAuth(
    'GET', 
    '/cities/bogota/events?page=1&limit=10'
  );
  
  assertPaginationResponse(response, 1, 10);
});
```

### Filtering

```typescript
test('should filter events by category', async ({ request }) => {
  const client = createApiClient(request);
  
  const response = await client.requestWithAuth(
    'GET',
    '/cities/bogota/events?category=music'
  );
  
  verifySuccessResponse(response);
  // Verify all events have music category
});
```

## 🚀 Running Tests

```bash
# Run all API tests
npm run test:e2e:api

# Run specific test file
npx playwright test e2e/api/tests/events/events.spec.ts --project=api

# Run with debug
npm run test:e2e:api:debug

# Run with reporter
npx playwright test e2e/api --reporter=list

# Run specific test
npx playwright test -g "should create event"
```

## ✅ Checklist

When writing API tests:

- [ ] Use API client from utils
- [ ] Import fixtures for test data
- [ ] Use test.step() for multi-step tests
- [ ] Create authenticated client for protected endpoints
- [ ] Clean up test data after tests
- [ ] Use verifyErrorResponse/verifySuccessResponse helpers
- [ ] Test validation errors with assertFieldError
- [ ] Include error code assertions
- [ ] Generate unique data to avoid conflicts
- [ ] Test both success and failure cases
- [ ] Verify error response structure
- [ ] Use meaningful test names

## 📝 Example Test

```typescript
import { test, expect } from '@playwright/test';
import { createApiClient, createAuthenticatedClient } from '../utils/api-client';
import { users, events, generateUniqueEvent } from '../fixtures';
import { 
  verifySuccessResponse, 
  verifyErrorResponse,
  assertFieldError,
  TestDataCollector 
} from '../utils/test-helpers';

test.describe('POST /api/events', () => {
  const testData = new TestDataCollector();
  
  test.afterEach(async ({ request }) => {
    const client = createApiClient(request);
    await cleanupTestData(client, { events: testData.getEventIds() });
  });

  test('should create event with valid data', async ({ request }) => {
    await test.step('Setup authenticated client', async () => {
      const client = await createAuthenticatedClient(request, users.valid);
    });
    
    await test.step('Generate unique event data', async () => {
      const event = generateUniqueEvent(events.music);
    });
    
    await test.step('Create event', async () => {
      const response = await client.createEvent(event);
      testData.addEvent(response.data?.id);
    });
    
    await test.step('Verify response', async () => {
      verifySuccessResponse(response);
      expect(response.data?.id).toBeDefined();
      expect(response.data?.title).toBe(event.title);
    });
  });

  test('should return 400 when title is missing', async ({ request }) => {
    await test.step('Setup and create event without title', async () => {
      const client = await createAuthenticatedClient(request, users.valid);
      const response = await client.createEvent({
        ...events.minimal,
        title: '',
      });
    });
    
    await test.step('Verify validation error', async () => {
      verifyErrorResponse(response, 400, 'VALIDATION_ERROR');
      assertFieldError(response, 'title', 'required');
      expect(response.errorId).toBeDefined();
      expect(response.timestamp).toBeDefined();
    });
  });
});
```

## 🔍 Debugging

```typescript
// Enable API logging
process.env.DEBUG_API = 'true';

// Log requests
logApiRequest('POST', '/events', data);

// Log responses
logApiResponse(response);

// Retry with backoff
const response = await retryApiCall(
  () => client.createEvent(event),
  { maxRetries: 3 }
);
```

## 📈 Test Coverage Areas

- ✅ Authentication (login, register, logout)
- ✅ Event CRUD operations
- ✅ Event RSVP
- ✅ Event filtering & search
- ✅ Place CRUD
- ✅ Place reviews
- ✅ Activity CRUD
- ✅ Activity bookings
- ✅ User profiles
- ✅ Error handling
- ✅ Validation
- ✅ Authorization
- ✅ Pagination
- ✅ Rate limiting (if applicable)
