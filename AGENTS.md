# AroundMe - Project Documentation

## Overview

AroundMe is a Next.js application for discovering events, places, and activities in your city. It allows users to browse events, places, create new events, submit places, manage profiles, and receive email confirmations.

## Tech Stack

- **Framework**: Next.js 16.1.7 with App Router
- **React**: 18.3.1 (Note: Downgraded from 19.2.3 for compatibility with TanStack Query)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL via Prisma 7 (with @prisma/adapter-pg)
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
├── types/                 # TypeScript type definitions
└── skills/                # Development skill guides
```

## Skills Directory

Development skill guides for consistent code patterns. Reference these when implementing features.

```
skills/
├── api-development.md          # API routes, error handling, Prisma
├── database-schema.md          # Prisma schema, relations, migrations
├── component-builder.md        # React components, Tailwind, dark mode
├── test-writer.md              # Vitest & Playwright tests, POM
├── auth-flow.md                # Login, signup, OAuth, sessions
├── stripe-integration.md       # Payments, webhooks, Connect
├── email-notifications.md      # Resend emails, push notifications
├── map-integration.md          # Leaflet maps, address autocomplete
├── form-builder.md             # Multi-step forms, validation
├── performance-optimization.md # Caching, ISR, images
├── senior-frontend/            # Expert React/Next.js/Tailwind development
│   ├── SKILL.md
│   ├── references/
│   │   ├── react_patterns.md
│   │   ├── frontend_best_practices.md
│   │   └── nextjs_optimization_guide.md
│   └── scripts/
│       ├── component_generator.py
│       ├── bundle_analyzer.py
│       └── frontend_scaffolder.py
├── tester/                     # Testing expert (Vitest, Playwright, CI/CD)
│   ├── SKILL.md
│   └── references/
│       ├── ci_cd_testing.md
│       ├── fixing_tests.md
│       └── test_architecture.md
└── architect/                  # SOLID principles, clean architecture, patterns
    ├── SKILL.md
    └── references/
        ├── solid_principles.md
        ├── design_patterns.md
        └── duplication_detection.md
```

### When to Use Skills

| Task | Skill to Reference |
|------|-------------------|
| Creating API endpoint | `api-development.md` |
| Adding database model | `database-schema.md` |
| Building UI component | `component-builder.md` or `senior-frontend/` |
| Writing tests | `test-writer.md` |
| Auth features | `auth-flow.md` |
| Payment features | `stripe-integration.md` |
| Email features | `email-notifications.md` |
| Map features | `map-integration.md` |
| Form features | `form-builder.md` |
| Performance issues | `performance-optimization.md` |
| Architecture review / refactoring | `architect/` |
| Code duplication detection | `architect/` |
| New feature design | `architect/` then `senior-frontend/` |
| Frontend optimization | `senior-frontend/` |
| Writing/fixing tests | `tester/` |
| CI/CD pipeline setup | `tester/` |
| Debugging test failures | `tester/` |
| Test coverage analysis | `tester/` |
| Regression testing | `tester/` |

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
This project uses Prisma 7 with PostgreSQL. Key files:
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

## AI Agents / Sub-Agents

The project has three specialized agent skills that can be invoked via the `skill` tool followed by the `task` tool. These provide expert-level assistance for frontend development, software architecture, and testing.

### How to Use Agents

In OpenCode, load a skill first, then delegate work to a general subagent with the skill context:

```
1. Load skill: skill("senior-frontend") or skill("architect")
2. Delegate: task(subagent_type="general", prompt="...instructions referencing loaded skill...")
```

The subagent will follow the skill's patterns and return completed work.

### 1. Senior Frontend Agent

**Skill:** `skills/senior-frontend/SKILL.md`
**Purpose:** Expert React/Next.js/Tailwind component development
**Use when:**
- Building new UI components
- Implementing responsive designs
- Adding dark mode support
- Optimizing frontend performance
- Creating forms with validation
- Writing component tests

**Example invocation flow:**
```
User: "Create a new EventFilterBar component with date range and category filters"

Agent action:
1. skill("senior-frontend")  -- Load the skill
2. task(
     subagent_type="general",
     description="Create EventFilterBar component",
     prompt="""
       Using the senior-frontend skill patterns, create a new EventFilterBar 
       component in src/components/events/EventFilterBar.tsx.
       
       Requirements:
       - Date range picker (today, this week, this month, custom)
       - Category multi-select using the category constants
       - Price filter (free, paid, price range)
       - Dark mode support
       - data-testid attributes for E2E testing
       - Follow the component pattern from SKILL.md
       - Export from src/components/events/index.ts
       
       After creating the component:
       1. Run npm run lint
       2. Run npm run test
       3. Report any errors and fix them
       4. Return the final component code and test results
       The component should be fully self-contained and match the existing codebase style (see EventCard.tsx as reference).
     """
   )
```

### 2. Architect Agent

**Skill:** `skills/architect/SKILL.md`
**References:**
- `skills/architect/references/solid_principles.md`
- `skills/architect/references/design_patterns.md`
- `skills/architect/references/duplication_detection.md`

**Purpose:** SOLID principles enforcement, clean architecture, design patterns, code duplication detection
**Use when:**
- Designing new features or modules
- Refactoring complex components
- Reviewing code for architecture issues
- Creating abstractions and shared utilities
- Detecting and eliminating code duplication
- Ensuring scalability of new code

**Example invocation flow:**
```
User: "Review the admin dashboard for SOLID violations and suggest refactorings"

Agent action:
1. skill("architect")  -- Load the skill
2. task(
     subagent_type="general",
     description="Review admin dashboard architecture",
     prompt="""
       Using the architect skill, review src/app/admin/page.tsx and related files.
       
       Tasks:
       1. Check for SOLID principle violations
       2. Identify code duplication within admin pages
       3. Suggest design patterns that would improve maintainability
       4. Check for layer violations (components importing prisma, etc.)
       5. Measure complexity (lines per function, nesting depth)
       
       Output format:
       - List each issue with severity (High/Medium/Low)
       - Cite the specific principle or pattern violated
       - Provide before/after code examples for top 3 issues
       - Create a refactoring plan with file names and estimated effort
       
       Focus on concrete, actionable changes that improve the codebase without breaking existing functionality.
     """
   )
```

### 3. Tester Agent

**Skill:** `skills/tester/SKILL.md`
**References:**
- `skills/tester/references/ci_cd_testing.md`
- `skills/tester/references/fixing_tests.md`
- `skills/tester/references/test_architecture.md`

**Purpose:** Expert testing for Vitest, Playwright, and CI/CD pipelines
**Use when:**
- Writing or fixing unit tests (Vitest)
- Writing or fixing E2E tests (Playwright)
- Debugging test failures in CI or locally
- Setting up GitHub Actions workflows
- Analyzing test coverage and quality
- Regression testing after changes
- Refactoring tests for maintainability

**Current test suite:**
- **183 unit tests** (Vitest + jsdom)
- **45 E2E UI tests** (Playwright + Chromium)
- **15+ E2E API tests** (Playwright Request)
- **4 CI workflows** (unit-tests, e2e-ui, e2e-api, lint-build)

**Example invocation flow:**
```
User: "The RSVP flow E2E test is failing in CI but passes locally"

Agent action:
1. skill("tester")  -- Load the skill
2. task(
     subagent_type="general",
     description="Debug failing RSVP E2E test",
     prompt="""
       Using the tester skill, debug the failing E2E test in e2e/ui/tests/events/rsvp-flow.spec.ts.

       The test fails in CI (GitHub Actions) but passes locally with --headed.
       CI error: "Timeout 5000ms exceeded waiting for locator('[data-testid=\"rsvp-confirmation\"]')"

       Tasks:
       1. Read the failing test file and identify potential issues
       2. Check playwright.config.ts for CI-specific settings (retries, timeouts)
       3. Look for timing issues, race conditions, or missing waits
       4. Check if data-testid selectors match the actual component code
       5. Suggest fixes with code examples
       6. Run npx playwright test e2e/ui/tests/events/rsvp-flow.spec.ts --repeat-each=3 locally to verify stability

       Follow the fixing_tests.md reference guide for debugging patterns.
       Report the root cause and the fix applied.
     """
   )
```

**Example: Adding tests for a new feature:**
```
User: "I just added a new event waitlist feature, add tests for it"

Agent action:
1. skill("tester")
2. task(
     subagent_type="general",
     description="Add tests for waitlist feature",
     prompt="""
       Using the tester skill, add comprehensive tests for the new waitlist feature.

       The feature includes:
       - waitlist/join API endpoint (POST /api/events/:id/waitlist)
       - waitlist/leave API endpoint (DELETE /api/events/:id/waitlist)
       - WaitlistButton component in src/components/events/
       - waitlist count display on event detail page

       Tasks:
       1. Add unit tests in src/test/waitlist.test.ts for:
          - waitlist sorting/queue logic
          - capacity calculations
          - notification trigger conditions
       2. Add API tests in e2e/api/tests/events/waitlist.spec.ts for:
          - Joining waitlist (success, event full, already joined)
          - Leaving waitlist (success, not on waitlist)
          - Unauthorized access blocked
       3. Add E2E tests in e2e/ui/tests/events/waitlist.spec.ts for:
          - Join waitlist button flow
          - Leave waitlist flow
          - Waitlist count updates on UI
       4. Run all tests: npm run test:run && npm run test:e2e:all
       5. Report results and fix any failures

       Follow the test architecture and POM patterns from the skill.
     """
   )
```

### Agent Collaboration Pattern

For complex features, use agents in sequence:

1. **Architect first** - Design the component/API structure, interfaces, and data flow
2. **Senior Frontend second** - Implement the UI following the architect's design
3. **Architect review** - Review the implementation for any architectural drift

**Example:**
```
User: "Build a new waitlist feature for events"

Flow:
1. skill("architect")
   -> Design database schema, API routes, hooks, and component structure

2. skill("senior-frontend")
   -> Implement WaitlistButton, WaitlistModal, WaitlistBadge components

3. skill("architect")
   -> Review implementation for duplication, SOLID compliance, layer violations

4. skill("tester")
   -> Add unit tests, API tests, and E2E tests for the waitlist feature
   -> Debug and fix any failing tests
   -> Verify all 183+ unit tests and 45+ E2E tests still pass

5. Run full verification: lint + test + build + e2e
```

## Mandatory Test-After-Work Workflow

Every code change MUST follow this verification flow before being considered complete. This applies to both manual work and agent-delegated work.

### The Flow

```
+-----------+     +--------+     +---------+     +----------+     +--------+
|   Code    | --> |  Lint  | --> |  Test   | --> |  Build   | --> | Verify |
|  Change   |     | Check  |     |  Run    |     |  Check   |     |  Done  |
+-----------+     +--------+     +---------+     +----------+     +--------+
      ^                                                            |
      +-------------------- Fix Issues ----------------------------+
```

### Step-by-Step

#### 1. Code Change
- Make the minimal change needed
- Follow existing code style and patterns
- Add/update tests for the changed code

#### 2. Lint Check
```bash
npm run lint
```
- Fix ALL errors and warnings
- No exceptions

#### 3. Unit Tests
```bash
npm run test
```
- All 183 tests must pass
- If tests fail, fix the code (not the tests, unless tests are wrong)
- Add new tests for new functionality

#### 4. E2E Tests (if UI changed)
```bash
npx playwright test
```
- Run if any UI component, page, or interaction was modified
- All 45 tests must pass
- Update selectors if data-testid changed

#### 5. Build Check
```bash
npm run build
```
- Must complete without errors
- Check for TypeScript errors
- Verify no missing dependencies

#### 6. Verification
- Review the change one more time
- Ensure no console.logs or debug code left
- Confirm dark mode works (if UI change)
- Confirm responsive design works (if UI change)

### Enforcing in Agent Delegation

When delegating work to subagents, ALWAYS include this in the prompt:

```
AFTER completing the implementation, you MUST:
1. Run `npm run lint` and fix all errors
2. Run `npm run test` and ensure all tests pass
3. If you changed any UI components or pages, run `npx playwright test`
4. Run `npm run build` to verify production build succeeds
5. Report the results of all commands in your response
6. If any step fails, fix the issue and re-run until everything passes

Do NOT return until all checks pass.
```

### Verification Script

For automation, use this script (save as `scripts/verify.sh`):

```bash
#!/bin/bash
set -e

echo "=== Step 1: Lint ==="
npm run lint

echo "=== Step 2: Unit Tests ==="
npm run test

echo "=== Step 3: Build ==="
npm run build

echo "=== Step 4: E2E Tests ==="
npx playwright test

echo "=== ALL CHECKS PASSED ==="
```

Usage:
```bash
chmod +x scripts/verify.sh
./scripts/verify.sh
```

### When Tests Are Allowed to Fail (Rare)

Only skip tests when:
- The test itself is testing the wrong thing (document in commit message)
- The failure is a known flaky test (document in AGENTS.md known issues)
- The change is purely documentation

Never skip tests for:
- "I'll fix tests later"
- "It works on my machine"
- "The test is too hard to update"

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
DATABASE_URL="postgresql://username:password@localhost:5432/aroundme?schema=public"

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
