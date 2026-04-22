---
name: api-development
description: Build robust Next.js API routes with Prisma, validation, and error handling. Use for creating or modifying API endpoints, database queries, authentication flows, and server-side logic.
---

This skill guides creation of production-grade API routes in the AroundMe Next.js application. Follow these patterns for consistent, secure, and maintainable API endpoints.

## API Route Structure

All API routes live in `src/app/api/` using Next.js App Router conventions.

### File Organization
```
src/app/api/
├── auth/           # Authentication endpoints
├── cities/         # City data
├── events/         # Event CRUD + features
│   └── [id]/       # Dynamic event routes
│       ├── feature/
│       ├── rsvp/
│       └── save/
├── places/         # Place CRUD + reviews
│   └── [id]/
│       └── reviews/
├── activities/     # Activity CRUD + booking
│   └── [id]/
│       └── booking/
├── user/           # User profile
├── admin/          # Admin operations
├── search/         # Global search
├── stripe/         # Payment processing
└── checkin/        # QR code check-in
```

## Error Handling Pattern

ALWAYS use the utility functions from `src/lib/api-utils.ts`:

```typescript
import { handleApiError, errorResponse, successResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    // ... business logic
    return successResponse(data, 'Success message');
  } catch (error) {
    return handleApiError(error, 'POST /api/endpoint');
  }
}
```

### Error Response Format
```typescript
{
  success: false,
  error: "Human-readable error message",
  code: "ERROR_CODE"  // Optional
}
```

### Success Response Format
```typescript
{
  success: true,
  data: { ... },
  message: "Optional success message"
}
```

## Validation Pattern

Use validation utilities from `src/lib/validation/`:

```typescript
import { validateRequestBody, createEventValidationRules, formatValidationErrors } from '@/lib/validation';

const validation = await validateRequestBody(
  request,
  createEventValidationRules(),
  'POST /api/events'
);

if (!validation.success) {
  return errorResponse(
    formatValidationErrors(validation.errors),
    400,
    'VALIDATION_ERROR'
  );
}

const data = validation.data;
```

## Database Access Pattern

Use the Prisma client from `src/lib/prisma.ts`:

```typescript
import { prisma } from '@/lib/prisma';

// Find with relations
const event = await prisma.event.findUnique({
  where: { id },
  include: {
    city: { select: { name: true, slug: true } },
    creator: { select: { name: true, avatar: true } },
  },
});

if (!event) {
  return errorResponse('Event not found', 404, 'EVENT_NOT_FOUND');
}

// Create with relations
const newEvent = await prisma.event.create({
  data: {
    title: data.title,
    // ... other fields
    cityId: city.id,
    creatorId: userId,
  },
});

// Update
await prisma.event.update({
  where: { id },
  data: { viewCount: { increment: 1 } },
});
```

## Authentication Pattern

Check session for protected routes:

```typescript
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return errorResponse('Please log in to continue', 401, 'UNAUTHORIZED');
  }

  // Use session.id for user-specific operations
  const userId = session.id;
}
```

## Rate Limiting Pattern

For sensitive endpoints (auth, create):

```typescript
import { checkRateLimit } from '@/lib/rateLimit';

const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
const rateLimitResult = checkRateLimit(clientIp, 5, 60000); // 5 requests per minute

if (!rateLimitResult.allowed) {
  return errorResponse(
    'Too many requests. Please try again later.',
    429,
    'RATE_LIMITED'
  );
}
```

## Standard Error Codes

Use these consistent error codes:
- `VALIDATION_ERROR` - Invalid input data
- `UNAUTHORIZED` - Not logged in
- `FORBIDDEN` - No permission
- `NOT_FOUND` - Resource not found
- `CITY_NOT_FOUND` - Invalid city slug
- `EVENT_NOT_FOUND` - Event doesn't exist
- `DUPLICATE_ENTRY` - Already exists
- `RATE_LIMITED` - Too many requests
- `DATABASE_ERROR` - Server error

## Query Parameters Pattern

```typescript
const { searchParams } = new URL(request.url);
const category = searchParams.get('category');
const page = parseInt(searchParams.get('page') || '1');
const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Cap at 50
```

## Checklist for New API Routes

- [ ] Uses `handleApiError` in catch blocks
- [ ] Validates input with `validateRequestBody`
- [ ] Checks auth with `getSession` if protected
- [ ] Returns consistent response format
- [ ] Uses proper error codes
- [ ] Has rate limiting for create/update endpoints
- [ ] Increments viewCount for detail endpoints
- [ ] Includes proper Prisma relations
