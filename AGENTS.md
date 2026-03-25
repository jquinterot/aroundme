# AroundMe - Project Documentation

## Overview

AroundMe is a Next.js application for discovering events and places in your city. It allows users to browse events, places, create new events, submit places, and manage their profiles.

## Tech Stack

- **Framework**: Next.js 16.1.7 with App Router
- **React**: 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite via Prisma (with support for libsql/better-sqlite3)
- **State Management**: TanStack React Query
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **Payments**: Stripe
- **Authentication**: Custom auth with bcrypt
- **Push Notifications**: Web Push API

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── [city]/            # City-specific pages
│   ├── admin/             # Admin dashboard
│   ├── checkout/          # Stripe checkout
│   ├── create-event/      # Create event form
│   ├── dashboard/         # User dashboard
│   ├── event/[id]/        # Event detail page
│   ├── event/[id]/edit/   # Edit event
│   ├── place/[id]/        # Place detail page
│   ├── place/[id]/edit/   # Edit place
│   ├── pricing/           # Pricing page
│   ├── profile/           # User profile
│   └── submit-place/      # Submit place form
├── components/
│   ├── events/            # Event-related components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components (Header, Footer, Hero)
│   ├── map/               # Map components
│   ├── places/            # Place-related components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts (Auth, Theme)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and constants
│   ├── constants.ts       # Category icons and colors
│   └── mock-data/         # Mock data for development
├── services/              # API service layer
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

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Database commands
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
npm run db:setup     # Sync schema (generate + db push)
npm run db:reset      # Force reset DB and re-seed (LOSES ALL DATA)
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

## Code Conventions

### Workflow (IMPORTANT)
For every change:
1. Run `npm run lint` and fix any errors/warnings
2. Run `npm run test` and ensure all tests pass
3. Commit the changes

### Testing
- Test framework: Vitest
- Run tests: `npm run test`
- Run lint: `npm run lint`
- Good CI tests: Pure utility functions, i18n, validation, constants mapping
- Avoid: Tests requiring database, network, or complex mocking

### Styling
- Tailwind CSS 4 with custom variant for dark mode
- Dark mode: Uses `.dark` class on `<html>` element
- Color scheme: Indigo for events, Teal for places
- CSS variables: `--background`, `--foreground`

### Component Patterns
- Client components use `'use client'` directive
- Server components for data fetching pages
- Form components use controlled state pattern
- Map components use React Leaflet

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
- `/api/places` - Place CRUD
- `/api/auth` - Authentication
- `/api/user` - User profile and settings
- `/api/search` - Global search

## Key Components

### Cards
- `EventCard` - Event display with image, category, price, countdown
- `PlaceCard` - Place display with image, rating, price range

### Forms
- `FormInput`, `FormSelect`, `CategorySelector`, `FormButton`
- Multi-step forms: `StepBasicInfo`, `StepDateTime`, `StepLocation`

### Maps
- `EventMap` - Leaflet map with event markers
- `PlaceMap` - Leaflet map with place markers

## Improvements Needed

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

## Categories

### Events
music, food, sports, art, tech, community, nightlife, outdoor, education, other

### Places
restaurant, cafe, bar, club, park, museum, shopping, hotel, coworking, other