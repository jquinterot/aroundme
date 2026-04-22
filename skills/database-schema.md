---
name: database-schema
description: Design and modify Prisma schema with PostgreSQL best practices. Use when adding models, relations, migrations, or optimizing queries.
---

This skill guides Prisma schema modifications for the AroundMe PostgreSQL database. Follow these patterns for consistent, efficient database design.

## Schema Location

- `prisma/schema.prisma` - Schema definition
- `prisma.config.ts` - Database URL configuration
- `prisma/seed.ts` - Sample data seeding

## Current Models (22)

```
City, User, Event, Place, Activity
Session, RSVP, Save, Review, Follow
TicketType, Order, OrderItem
Notification, CheckIn, Waitlist
EmailLog, AdminReport, Recommendation
EventSeries, ActivityBooking, UserActivity
```

## Model Pattern

```prisma
model ModelName {
  id        String   @id @default(cuid())
  field1    String
  field2    Int      @default(0)
  field3    Boolean  @default(false)
  
  // Relations
  parent    Parent   @relation(fields: [parentId], references: [id])
  parentId  String
  
  children  Child[]
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Indexes
  @@index([parentId])
  @@index([field1, field2])
}
```

## Relation Patterns

### One-to-Many
```prisma
model City {
  id     String  @id @default(cuid())
  name   String
  events Event[] // One city has many events
}

model Event {
  id     String @id @default(cuid())
  city   City   @relation(fields: [cityId], references: [id])
  cityId String
}
```

### Many-to-Many (Implicit)
```prisma
model User {
  id            String   @id @default(cuid())
  savedEvents   Event[]  @relation("SavedEvents")
}

model Event {
  id        String   @id @default(cuid())
  savedBy   User[]   @relation("SavedEvents")
}
```

### Many-to-Many (Explicit with extra fields)
```prisma
model RSVP {
  id        String   @id @default(cuid())
  status    String   // going, interested, maybe
  
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  
  event     Event    @relation(fields: [eventId], references: [id])
  eventId   String
  
  createdAt DateTime @default(now())
  
  @@unique([userId, eventId])
}
```

## Common Field Types

```prisma
// IDs
id String @id @default(cuid())

// Text
title       String
description String  @db.Text
slug        String  @unique

// Numbers
price       Float   @default(0)
viewCount   Int     @default(0)
rating      Float?

// Booleans
isActive    Boolean @default(false)
isVerified  Boolean @default(false)

// Dates
eventDate   DateTime
createdAt   DateTime @default(now())
expiresAt   DateTime?

// JSON (stored as text, parsed in code)
metadata    String?  @db.Text  // JSON.stringify/parse in code

// Coordinates
lat         Float
lng         Float
```

## Indexing Strategy

```prisma
// Single field index
@@index([cityId])

// Composite index for common queries
@@index([cityId, category])

// Unique constraint
@@unique([userId, eventId])

// Unique slug
slug String @unique
```

## Migration Workflow

After schema changes:

```bash
# Safe: syncs without losing data
npm run db:setup

# Re-seed sample data
npm run db:seed

# Dangerous: resets everything
npm run db:reset
```

## Seed Data Pattern

In `prisma/seed.ts`:

```typescript
const event = await prisma.event.create({
  data: {
    title: 'Sample Event',
    description: 'Description here',
    category: 'music',
    cityId: city.id,
    creatorId: user.id,
    // ... other fields
  },
});
```

## Query Optimization

### Include only needed fields
```typescript
// Good: Select specific fields
const events = await prisma.event.findMany({
  select: {
    id: true,
    title: true,
    category: true,
    city: { select: { name: true } },
  },
});

// Bad: Include everything
const events = await prisma.event.findMany({
  include: { city: true, creator: true, rsvps: true },
});
```

### Paginate large queries
```typescript
const events = await prisma.event.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
});
```

### Use transactions for related operations
```typescript
await prisma.$transaction([
  prisma.event.update({ where: { id }, data: { ... } }),
  prisma.notification.create({ data: { ... } }),
]);
```

## Checklist for Schema Changes

- [ ] Add proper indexes for new query patterns
- [ ] Set appropriate default values
- [ ] Use `@db.Text` for long strings
- [ ] Add `createdAt` and `updatedAt` timestamps
- [ ] Define proper relations with cascade rules
- [ ] Update seed data if needed
- [ ] Run `npm run db:setup` after changes
- [ ] Verify with `npm run db:studio`
