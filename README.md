# AroundMe

Discover events, places, and activities happening in your city.

## Tech Stack

- **Framework**: Next.js 16.1.7 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma 7
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack React Query v4
- **Maps**: React Leaflet
- **Payments**: Stripe (Connect)
- **Email**: Resend
- **Testing**: Vitest + Playwright

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
npm run db:setup

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run unit tests (Vitest)
npx playwright test  # Run E2E tests
npm run db:studio    # Open Prisma Studio
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── contexts/      # React contexts (Auth, Theme)
├── hooks/         # Custom React hooks
├── lib/           # Utilities and services
├── services/      # API service layer
└── types/         # TypeScript types
```

## Features

- **Events**: Create, browse, RSVP, ticket sales, QR check-in
- **Places**: Submit, claim, reviews, ratings
- **Activities**: Classes, tours, experiences with booking
- **Social**: Follow users, activity feed, recommendations
- **Payments**: Stripe Connect for organizers
- **Maps**: Interactive Leaflet maps with markers

## Documentation

- [AGENTS.md](AGENTS.md) - Full project documentation
- [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) - Architecture analysis
- [PROGRESS.md](PROGRESS.md) - Feature implementation status

## License

Private - All rights reserved
