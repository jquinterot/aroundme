---
name: senior-frontend
description: Senior frontend development skill for the AroundMe Next.js application. Use when building React components with TypeScript and Tailwind CSS, implementing responsive designs, optimizing frontend performance, managing React state, or reviewing UI/UX code. Triggers on component creation, styling tasks, dark mode implementation, form building, or frontend refactoring.
---

# Senior Frontend - AroundMe

Expert frontend development skill tailored for the AroundMe Next.js 16 + React 18 + Tailwind CSS 4 + TypeScript stack.

## Tech Stack Context

- **Framework:** Next.js 16.1.7 with App Router
- **React:** 18.3.1 (NOT React 19 - compatibility requirement)
- **Styling:** Tailwind CSS 4 with custom dark mode variant
- **State:** TanStack Query v4.36.1
- **Maps:** React Leaflet v5.0.0
- **Icons:** Lucide React
- **Testing:** Vitest (unit) + Playwright (E2E)

## Component Development Workflow

### 1. Analyze Requirements
- What data does this component need?
- Is it server or client rendered?
- Does it need interactivity (state, effects, events)?
- What are the loading/error states?
- Does it need dark mode support?

### 2. Choose Component Type

**Server Component (default):**
```typescript
// No 'use client' directive
// Can fetch data directly
// Can access Node.js APIs
// Smaller client bundle

import { prisma } from '@/lib/prisma';

export async function EventList() {
  const events = await prisma.event.findMany({ take: 10 });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  );
}
```

**Client Component:**
```typescript
'use client';

// Only when using:
// - useState, useEffect, useReducer
// - Event handlers (onClick, onSubmit)
// - Browser APIs (window, document, localStorage)
// - React Context consumers
// - Custom hooks that use client features

import { useState } from 'react';

export function SearchInput() {
  const [query, setQuery] = useState('');
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg"
      placeholder="Search..."
    />
  );
}
```

### 3. Component Structure

```typescript
'use client'; // Only if needed

// 1. React/Next imports
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 2. External libraries
import { MapPin, Calendar, Clock } from 'lucide-react';

// 3. Internal absolute imports (@/)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

// 4. Types
import type { Event } from '@/types';

// 5. Interface
interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onSave?: (id: string) => void;
  testId?: string;
}

// 6. Component
export function EventCard({ event, showActions = false, onSave, testId }: EventCardProps) {
  // State
  const [isHovered, setIsHovered] = useState(false);
  
  // Derived state
  const isUpcoming = useMemo(() => new Date(event.date) > new Date(), [event.date]);
  
  // Handlers
  const handleSave = useCallback(() => {
    onSave?.(event.id);
  }, [event.id, onSave]);
  
  // Render
  return (
    <article data-testid={testId} className="...">
      {/* ... */}
    </article>
  );
}
```

## Tailwind CSS 4 Patterns

### Dark Mode

The app uses `.dark` class on `<html>` with custom variant:

```css
/* globals.css */
@custom-variant dark (&:where(.dark, .dark *));
```

**Always pair light and dark classes:**

```typescript
// Backgrounds
bg-white dark:bg-gray-800
bg-gray-50 dark:bg-gray-900
bg-gray-100 dark:bg-gray-800

// Text
text-gray-900 dark:text-gray-100
text-gray-600 dark:text-gray-400
text-gray-500 dark:text-gray-400

// Borders
border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600

// Inputs
bg-white dark:bg-gray-800
border-gray-300 dark:border-gray-600
text-gray-900 dark:text-gray-100
placeholder:text-gray-400 dark:placeholder:text-gray-500

// Hover states
hover:bg-gray-50 dark:hover:bg-gray-700
hover:text-indigo-600 dark:hover:text-indigo-400
```

### Color Schemes

```typescript
// Events - Indigo
primary: 'bg-indigo-600 text-white hover:bg-indigo-700'
light: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
border: 'border-indigo-500'
ring: 'focus:ring-indigo-500'

// Places - Teal
primary: 'bg-teal-600 text-white hover:bg-teal-700'
light: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
border: 'border-teal-500'
ring: 'focus:ring-teal-500'

// Activities - Amber
primary: 'bg-amber-600 text-white hover:bg-amber-700'
light: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
border: 'border-amber-500'
ring: 'focus:ring-amber-500'
```

### Spacing System

```typescript
// Section spacing
className="space-y-6"     // Between major sections
className="space-y-4"     // Between related items
className="space-y-2"     // Between tightly related items

// Grid gaps
className="gap-4"         // Standard grid
className="gap-6"         // Relaxed grid

// Padding
className="p-4"           // Card padding
className="p-6"           // Section padding
className="px-4 py-2.5"   // Button padding
className="px-4 py-3"     // Input padding
className="px-6 py-4"     // Large button/cta

// Margins
className="mb-2"          // Tight spacing
className="mb-4"          // Standard spacing
className="mb-6"          // Section spacing
```

### Responsive Breakpoints

```typescript
// Mobile-first approach
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
className="text-sm md:text-base lg:text-lg"
className="p-4 md:p-6 lg:p-8"
className="flex-col md:flex-row"
```

## Image Handling

```typescript
import Image from 'next/image';

// Standard image with loading state
<div className="relative h-48">
  {!imageLoaded && (
    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
  )}
  <Image
    src={imageUrl}
    alt={title}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className={`object-cover transition-opacity duration-300 ${
      imageLoaded ? 'opacity-100' : 'opacity-0'
    }`}
    onLoad={() => setImageLoaded(true)}
    onError={() => setImageError(true)}
  />
</div>

// Avatar
<div className="relative w-10 h-10 rounded-full overflow-hidden">
  <Image src={avatar} alt={name} fill className="object-cover" />
</div>
```

## Form Patterns

```typescript
// Controlled input with error handling
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function FormInput({ label, error, helperText, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {helperText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      <input
        className={cn(
          "w-full px-4 py-2.5 rounded-lg border transition-colors",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "border-gray-300 dark:border-gray-600",
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        data-testid={`${props.name}-input`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
```

## Data Fetching Patterns

### Server Components

```typescript
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { organizer: true, venue: true },
  });
  
  if (!event) notFound();
  
  return <EventDetail event={event} />;
}
```

### Client with TanStack Query

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) throw new Error('Failed to fetch event');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

function useRSVP() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('RSVP failed');
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['rsvps'] });
    },
  });
}
```

## Performance Optimization

### 1. Memoization

```typescript
// Memoize expensive computations
const sortedEvents = useMemo(() => {
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}, [events]);

// Memoize callbacks passed to children
const handleDelete = useCallback((id: string) => {
  deleteEvent(id);
}, [deleteEvent]);

// Memoize components that don't need re-renders
const MemoizedEventCard = memo(EventCard);
```

### 2. Code Splitting

```typescript
// Dynamic imports for heavy components
const EventMap = dynamic(() => import('@/components/map/EventMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />,
});
```

### 3. Image Optimization

```typescript
// Always use Next.js Image
// Always provide sizes prop
// Use priority for above-the-fold images
// Use placeholder="blur" when possible
```

### 4. List Virtualization

For lists >50 items:
```typescript
import { Virtualizer } from '@tanstack/react-virtual';

function VirtualEventList({ events }: { events: Event[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
  });
  
  return (...);
}
```

## Accessibility Requirements

```typescript
// Interactive elements must be keyboard accessible
<button 
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  role="button"
>

// Images must have alt text
<Image src={src} alt={descriptiveAlt} />

// Form inputs must have labels
<label htmlFor="email">Email</label>
<input id="email" aria-describedby="email-error" />
<span id="email-error" role="alert">{error}</span>

// Use semantic HTML
<article> for cards
<nav> for navigation
<main> for main content
<aside> for sidebars
<time> for dates
```

## Testing Requirements

### Unit Tests (Vitest)

```typescript
import { render, screen } from '@testing-library/react';
import { EventCard } from './EventCard';

describe('EventCard', () => {
  const mockEvent = { ... };
  
  it('renders event title', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
  });
  
  it('has correct test id', () => {
    render(<EventCard event={mockEvent} testId="test-event" />);
    expect(screen.getByTestId('test-event')).toBeInTheDocument();
  });
});
```

### E2E Test IDs

Always add data-testid:

```typescript
// Pages
<div data-testid="event-detail-page-container">

// Cards
data-testid={`event-card-${event.id}`}
data-testid={`place-card-${place.id}`}

// Forms
<input data-testid="email-input" />
<button data-testid="submit-button" />

// Interactive
<button data-testid="filter-category-music" />
<a data-testid="nav-events-link" />
```

## Common Anti-Patterns to Avoid

1. **Prop drilling deeper than 2 levels** - Use composition or context
2. **useEffect for derived state** - Use useMemo instead
3. **Multiple useState when useReducer is cleaner**
4. **Passing objects/functions inline** - Causes unnecessary re-renders
5. **Using index as key** - Use stable IDs
6. **Fetching in useEffect without cleanup** - Use TanStack Query
7. **Not handling loading/error states**
8. **Using div for everything** - Use semantic HTML
9. **Magic strings for className combinations** - Create reusable cn() utilities
10. **Forgetting dark mode** on new components

## Quick Reference

```bash
# Component generator
python skills/senior-frontend/scripts/component_generator.py src/components/ui MyComponent

# Bundle analysis
python skills/senior-frontend/scripts/bundle_analyzer.py .

# Development
npm run dev
npm run build
npm run test
npm run lint
```
