# AroundMe - Architecture & Design Patterns

## Current Architecture: Modified Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Layer                                 │
│  (src/app/**/page.tsx, src/components/**)                  │
│  - React components, TanStack Query for data fetching        │
├─────────────────────────────────────────────────────────────┤
│                   Business Logic Layer                        │
│  (src/lib/*.ts - auth.ts, email.ts, notifications.ts, etc.) │
│  - Utilities, validation, business rules                      │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                              │
│  (src/services/api.ts - ApiService)                         │
│  - HTTP client, retry logic                                  │
├─────────────────────────────────────────────────────────────┤
│                  Data Access Layer                            │
│  (API routes directly use Prisma)                            │
│  - Database queries in route handlers                         │
└─────────────────────────────────────────────────────────────┘
```

**Issues:**
- API routes directly call Prisma (leaky data access)
- No formal Service Layer abstraction
- Business logic scattered between `lib/` and API routes

---

## Design Patterns Currently Implemented

### ✅ Singleton
- `src/lib/prisma.ts` - Global Prisma client
- `src/services/api.ts` - Single ApiService instance
- `src/lib/stripe.ts` - Lazy-loaded Stripe instance

### ✅ Factory
- `src/lib/validation/schemas/*.ts` - `createEventValidationRules()`
- `src/lib/email.ts` - EMAIL_TEMPLATES object

### ✅ Context (React)
- `src/contexts/AuthContext.tsx` - Auth state
- `src/contexts/ThemeContext.tsx` - Theme state

### ✅ Custom Hooks
- `src/hooks/useApi.ts` - Generic API calls
- `src/hooks/usePremium.ts` - Feature gating
- `src/hooks/usePushNotifications.ts` - Web push

### ✅ Strategy
- `src/services/api.ts` - `getHttpErrorMessage()` per status code
- `src/lib/email.ts` - `sendViaResend()` / `sendViaSendGrid()`

### ✅ Repository-Like (Partial)
- `src/lib/social.ts`, `checkin.ts`, `waitlist.ts` - Domain operations

### ✅ Observer
- TanStack React Query for reactive data fetching

### ✅ Middleware
- `src/lib/rateLimit.ts` - Rate limiting middleware

---

## Design Patterns NOT Implemented

| Pattern | Current State | Should Be |
|---------|---------------|-----------|
| **Repository** | Direct Prisma in routes | Abstract data access behind interfaces |
| **Service Layer** | Business logic in routes | Dedicated services |
| **Dependency Injection** | Direct imports | Injected for testability |
| **CQRS** | Same endpoints read/write | Separate models |
| **DTOs** | Raw payloads | Typed DTOs for layer boundaries |
| **Result/Either** | Exceptions | Type-safe error propagation |

---

## Layer Separation Issues

| Layer | Problem |
|-------|---------|
| UI → API | Direct fetch calls in components |
| API → Business | Business logic in route handlers |
| API → Data | Direct Prisma calls in routes |
| Business → Data | No abstraction |

---

## Recommendations

### Priority 1: Introduce Repository Pattern

```
src/repositories/
├── interfaces.ts      # IEventRepository, IUserRepository, etc.
├── EventRepository.ts
├── UserRepository.ts
└── ...
```

### Priority 2: Introduce Service Layer

```
src/services/
├── EventService.ts
├── UserService.ts
├── NotificationService.ts
└── ...
```

### Priority 3: Add Dependency Injection

```typescript
// src/di/container.ts
export const container = {
  eventService: new EventService(eventRepository, notificationService),
};
```

### Priority 4: Extract Data Fetching to Hooks

```typescript
// Instead of fetch in components:
export function useEvents(citySlug: string, filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', citySlug, filters],
    queryFn: () => eventService.getByCity(citySlug, filters)
  });
}
```

---

## What Works Well ✅

- Context separation (AuthContext, ThemeContext)
- Custom hooks organization
- API utilities (handleApiError, errorResponse)
- Validation layer centralized
- Barrel exports (index.ts files)

---

## Quick Wins

1. **Extract data-fetching to hooks** - expand `src/hooks/`
2. **Move business logic from routes to lib/*.ts** - More repository-like files
3. **Add interfaces for existing services** - Type safety without full refactor
4. **Centralize Prisma access** - Single instance used everywhere
