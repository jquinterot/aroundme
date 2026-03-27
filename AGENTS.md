# AroundMe - Project Documentation

## Overview

AroundMe is a Next.js application for discovering events, places, and activities in your city. It allows users to browse events, places, create new events, submit places, manage profiles, and receive email confirmations.

## Tech Stack

- **Framework**: Next.js 16.1.7 with App Router
- **React**: 18.3.1 (Note: Downgraded from 19.2.3 for compatibility with TanStack Query)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite via Prisma 7 (with support for libsql/better-sqlite3)
- **State Management**: TanStack React Query v4.36.1
- **Maps**: React Leaflet v5.0.0
- **Icons**: Lucide React
- **Payments**: Stripe
- **Authentication**: Custom auth with bcrypt
- **Push Notifications**: Web Push API
- **Email**: Resend (3,000 emails/month free tier)
- **E2E Testing**: Playwright

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── [city]/            # City-specific pages
│   ├── admin/             # Admin dashboard
│   ├── checkout/          # Stripe checkout
│   ├── create-event/      # Create event form
│   ├── create-activity/   # Create activity form
│   ├── dashboard/         # User dashboard
│   ├── discover/          # Discover events page
│   ├── event/[id]/        # Event detail page
│   ├── event/[id]/edit/   # Edit event
│   ├── activity/[id]/     # Activity detail page
│   ├── place/[id]/        # Place detail page
│   ├── place/[id]/edit/   # Edit place
│   ├── pricing/           # Pricing page
│   ├── profile/           # User profile
│   ├── profile/[id]/      # Public user profile
│   ├── docs/              # Help center
│   └── submit-place/      # Submit place form
├── components/
│   ├── events/            # Event-related components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components (Header, Footer, Hero)
│   ├── map/               # Map components (EventMap, PlaceMap, ActivityMap)
│   ├── places/            # Place-related components
│   ├── activities/        # Activity-related components
│   ├── social/            # Social features (follow, share)
│   ├── checkin/           # Check-in components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts (Auth, Theme)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and constants
│   ├── constants.ts       # Category icons and colors
│   ├── email.ts           # Email service with Resend
│   ├── api-utils.ts       # API error handling
│   ├── auth.ts            # Authentication utilities
│   ├── rateLimit.ts       # Rate limiting
│   └── mock-data/         # Mock data for development
├── services/              # API service layer
├── e2e/                   # Playwright E2E tests
└── types/                 # TypeScript type definitions
```

## Key Features

### Events
- Create, edit, and delete events
- Featured/premium event promotion
- RSVP system (going, interested, maybe)
- Event series/recurring events
- Ticket types with Stripe integration
- Check-in system with QR codes
- Waitlist for sold-out events
- Analytics dashboard for organizers
- **Email confirmations for RSVPs** (via Resend)

### Activities
- Create and manage activities (classes, tours, experiences)
- Activity bookings with email confirmations
- Category filtering (classes, tours, entertainment, wellness)
- Provider profiles
- Schedule management

### Places
- Submit and claim places
- Reviews and ratings
- Price range indicators
- Operating hours
- Contact information (phone, website, Instagram)

### User Features
- User profiles with verification
- Push notifications
- Saved events and places
- Activity feed
- Following system
- Dashboard with stats and earnings

### Search & Discovery
- Global search (events and places)
- Category filtering
- Date filtering (today, week, month)
- Price filtering (free, paid)
- Map view with markers

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run E2E tests
npx playwright test

# Database commands
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
npm run db:setup     # Sync schema (generate + db push)
npm run db:reset     # Force reset DB and re-seed (LOSES ALL DATA)
```

## Database / Prisma Workflow (IMPORTANT)

### Prisma 7 Configuration
This project uses Prisma 7 with SQLite. Key files:
- `prisma/schema.prisma` - Schema definition (NO url in datasource - Prisma 7 requirement)
- `prisma.config.ts` - Database URL configuration
- `.env` - Contains DATABASE_URL

### When Schema Changes Occur
After pulling changes that modify `prisma/schema.prisma`:

```bash
npm run db:setup   # Safe: syncs schema without losing existing data
npm run db:seed    # Re-add sample data
```

### If Database Gets Out of Sync (errors like "table not found", " DATABASE_ERROR")
```bash
npm run db:reset   # Force reset + re-seed (LOSES ALL DATA)
```

### Common Issues
- **"Unable to open static sorted file"** - Clear Next.js cache: `rm -rf .next node_modules/.cache`
- **"Database configuration issue"** - Run `npm run db:setup`
- **Migration conflicts** - Don't use `prisma migrate dev` in development; use `db:setup` instead

### Why This Happens
Prisma 7 changed how database URLs work:
- The `url` property in schema.prisma datasource is no longer supported
- URL must be in `prisma.config.ts`
- The `db push` command is preferred over `migrate dev` for development

## Testing

### Unit Tests (Vitest)
- Test framework: Vitest
- Run tests: `npm run test`
- Run lint: `npm run lint`
- Good CI tests: Pure utility functions, i18n, validation, constants mapping
- Avoid: Tests requiring database, network, or complex mocking
- **Current coverage: 183 tests passing**

### E2E Tests (Playwright)
- Framework: Playwright
- Configuration: `playwright.config.ts`
- Test files: `e2e/*.spec.ts`
- Run tests: `npx playwright test`
- **Current coverage: 45 E2E tests**
- Tests cover:
  - Tab navigation (Events, Places, Activities)
  - Authentication flows (login, signup, forgot password)
  - Content loading verification
  - Page navigation

### Test IDs
All major pages and components have `data-testid` attributes for automation:
- Pages: `data-testid="{page-name}-page-container"`
- Cards: `data-testid="{type}-card-{id}"`
- Forms: `data-testid="{form-field}-input"`
- Buttons: `data-testid="{action}-button"`

## Code Conventions

### Workflow (IMPORTANT)
For every change:
1. Run `npm run lint` and fix any errors/warnings
2. Run `npm run test` and ensure all tests pass
3. Run E2E tests if UI changes: `npx playwright test`
4. Commit the changes

### Styling
- Tailwind CSS 4 with custom variant for dark mode
- Dark mode: Uses `.dark` class on `<html>` element
- Color scheme: Indigo for events, Teal for places, Amber for activities
- CSS variables: `--background`, `--foreground`

### Component Patterns
- Client components use `'use client'` directive
- Server components for data fetching pages
- Form components use controlled state pattern
- Map components use React Leaflet
- All cards have data-testid for E2E testing

## Theme System

The app uses a `ThemeProvider` context with:
- `theme`: 'light' | 'dark'
- `toggleTheme()`: Toggle between themes
- `setTheme(theme)`: Set specific theme

Dark mode is applied via:
1. CSS class `.dark` on `<html>` element
2. Tailwind's `dark:` variant for dark mode styles
3. `@custom-variant dark (&:where(.dark, .dark *))` in globals.css

## API Structure

All API routes are under `/api/`:
- `/api/cities` - City management
- `/api/events` - Event CRUD
- `/api/events/[id]/rsvp` - RSVP with email confirmation
- `/api/places` - Place CRUD
- `/api/activities` - Activity CRUD
- `/api/auth` - Authentication
- `/api/user` - User profile and settings
- `/api/admin` - Admin operations
- `/api/search` - Global search
- `/api/stripe` - Payment processing
- `/api/checkin` - QR code check-in

## Key Components

### Cards
- `EventCard` - Event display with image, category, price, countdown (data-testid="event-card-{id}")
- `PlaceCard` - Place display with image, rating, price range (data-testid="place-card-{id}")
- `ActivityCard` - Activity display with schedule, price (data-testid="activity-card-{id}")

### Forms
- `FormInput`, `FormSelect`, `CategorySelector`, `FormButton`
- Multi-step forms: `StepBasicInfo`, `StepDateTime`, `StepLocation`
- All form inputs have data-testid attributes

### Maps
- `EventMap` - Leaflet map with event markers (h-96 = 384px height)
- `PlaceMap` - Leaflet map with place markers (h-96 = 384px height)
- `ActivityMap` - Leaflet map with activity markers (h-96 = 384px height)

## Email Integration (Resend)

### Setup
1. Sign up at https://resend.com
2. Get API key from https://resend.com/api-keys
3. Add to `.env`: `RESEND_API_KEY="re_xxxx"`
4. Verify domain or use test mode

### Email Templates
Located in `src/lib/email.ts`:
- `rsvp_confirmation` - Sent when user RSVPs to event
- `event_reminder` - Sent day before event
- `weekly_digest` - Weekly event summary
- `ticket_confirmation` - Ticket purchase confirmation
- `waitlist_available` - Spot available notification

### Free Tier Limits
- 3,000 emails/month
- 100 emails/day
- No credit card required

## API Error Handling

### Error Response Format
All API routes return consistent error format:
```typescript
{
  success: false,
  error: "Human-readable error message",
  code: "ERROR_CODE"  // Optional error code
}
```

### Error Utility Functions (`src/lib/api-utils.ts`)
- `handleApiError(error, context)` - For catch blocks, returns proper JSON response
- `errorResponse(message, status, code)` - For validation errors
- `successResponse(data, message)` - For success responses

### Usage in API Routes
```typescript
// In catch blocks
catch (error) {
  return handleApiError(error, 'context-string');
}

// For validation errors
return errorResponse('Specific error message', 400, 'ERROR_CODE');

// For successful responses
return successResponse(data, 'Success message');
```

### Error Codes Used
- `VALIDATION_ERROR`, `CITY_NOT_FOUND`, `INVALID_DATE`, `INVALID_PRICE`
- `TICKET_NOT_FOUND`, `TICKET_UNAVAILABLE`, `INSUFFICIENT_TICKETS`
- `SALE_NOT_STARTED`, `SALE_ENDED`, `MAX_TICKETS_EXCEEDED`
- `EMAIL_EXISTS`, `INVALID_EMAIL`, `WEAK_PASSWORD`
- `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`
- `DATABASE_ERROR`, `PAYMENT_ERROR`, `AUTH_ERROR`

## Security Considerations

### Current Implementations
- ✅ Session-based authentication with secure cookies
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Rate limiting on auth endpoints (5 req/min)
- ✅ Input validation on all API routes
- ✅ SQL injection prevention via Prisma ORM
- ✅ CSRF protection via SameSite cookies

### Recommendations
- Add Content Security Policy (CSP) headers
- Implement CORS configuration
- Add request size limits
- Use HTTPS in production
- Rotate API keys regularly
- Add error boundary for client-side crashes

## Categories

### Events
music, food, sports, art, tech, community, nightlife, outdoor, education, other

### Places
restaurant, cafe, bar, club, park, museum, shopping, hotel, coworking, other

### Activities
class, tour, entertainment, experience, wellness

## Database Models (18 total)

Core models:
- City, User, Event, Place, Activity
- Session, RSVP, Save, Review, Follow
- TicketType, Order, OrderItem
- Notification, CheckIn, Waitlist
- EmailLog, AdminReport, Recommendation
- EventSeries, ActivityBooking, UserActivity

## Known Issues & Improvements

### Text Overflow Issues
- Category buttons in `CategorySelector` may overflow on smaller screens
- Long titles in cards may need better truncation
- Place/event detail pages need max-width constraints on text content

### Dark Mode Improvements
- `PlaceCard.tsx` - Needs dark mode styles
- `PlaceCardBadges.tsx` - Rating and badges need dark mode
- `Footer.tsx` - Missing dark mode background
- `SearchBar.tsx` - Dropdown results need dark mode
- `ToggleOption` in forms - Missing dark mode
- Dashboard cards - Missing dark mode
- Event/Place detail pages - Missing dark mode backgrounds
- Note info boxes - Missing dark mode

### Component Complexity
- `admin/page.tsx` (1041 lines) - Should be split into sections
- `activity/[id]/page.tsx` (563 lines) - Extract booking logic to hook
- Consider using Zustand for complex state management

## Environment Variables

Required in `.env`:
```bash
# Database
DATABASE_URL="file:./dev.db"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Web Push Notifications
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_PROVIDER="resend"
```

## Troubleshooting

### React Suspense Errors
If you see "We are cleaning up async info that was not on the parent Suspense boundary":
- This is a known React 19 + TanStack Query issue
- We downgraded to React 18.3.1 to fix this
- Clear cache: `rm -rf .next node_modules/.cache`

### Database Issues
If "table not found" or database errors:
```bash
rm -rf .next node_modules/.cache
npm run db:setup
npm run db:seed
npm run dev
```

### Build Failures
If build fails with module errors:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```
