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
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run db:generate   # Generate Prisma client
```

## Code Conventions

### Testing
- Test framework: Vitest
- Run tests: `npm run test`
- Run lint: `npm run lint`

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

## Categories

### Events
music, food, sports, art, tech, community, nightlife, outdoor, education, other

### Places
restaurant, cafe, bar, club, park, museum, shopping, hotel, coworking, other