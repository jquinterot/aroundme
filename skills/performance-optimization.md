---
name: performance-optimization
description: Optimize Next.js pages with ISR, image optimization, and caching strategies. Use when improving load times and Core Web Vitals.
---

This skill guides performance optimization in the AroundMe application.

## Caching Strategies

### API Route Caching

```typescript
// GET /api/cities - Cache for 1 hour
export async function GET() {
  const cities = await prisma.city.findMany();
  
  return NextResponse.json(
    { success: true, data: cities },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
```

### Page-Level Caching

```typescript
// City page - ISR with 60 second revalidation
export const revalidate = 60;

export default async function CityPage({ params }) {
  const events = await getEvents(params.city);
  return <EventsList events={events} />;
}
```

### Fetch Caching

```typescript
// Force cache
const data = await fetch(url, { cache: 'force-cache' });

// Revalidate every 60 seconds
const data = await fetch(url, { next: { revalidate: 60 } });

// No cache
const data = await fetch(url, { cache: 'no-store' });
```

## Image Optimization

### Use Next.js Image Component

```typescript
import Image from 'next/image';

// Good
<Image
  src={event.imageUrl}
  alt={event.title}
  width={400}
  height={300}
  className="object-cover"
  loading="lazy"
/>

// Bad
<img src={event.imageUrl} alt={event.title} />
```

### Image Sizing

```typescript
// Thumbnail (card)
<Image width={400} height={225} />

// Detail page hero
<Image width={1200} height={630} />

// Avatar
<Image width={48} height={48} />
```

### Placeholder Images

```typescript
// Use consistent placeholder for missing images
const PLACEHOLDER = '/placeholder-event.jpg';

<Image
  src={event.imageUrl || PLACEHOLDER}
  // ...
/>
```

## Code Splitting

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

// Load map only when needed
const EventMap = dynamic(() => import('@/components/map/EventMap'), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse" />,
  ssr: false, // Don't render on server
});
```

### Lazy Load Heavy Components

```typescript
import { lazy, Suspense } from 'react';

const Chart = lazy(() => import('@/components/Chart'));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <Chart data={data} />
    </Suspense>
  );
}
```

## Database Query Optimization

### Select Only Needed Fields

```typescript
// Good
const events = await prisma.event.findMany({
  select: {
    id: true,
    title: true,
    category: true,
    startDate: true,
    city: { select: { name: true, slug: true } },
  },
  where: { cityId: city.id },
});

// Bad
const events = await prisma.event.findMany({
  include: {
    city: true,
    creator: true,
    rsvps: true,
    ticketTypes: true,
  },
});
```

### Pagination

```typescript
const PAGE_SIZE = 20;

const events = await prisma.event.findMany({
  skip: (page - 1) * PAGE_SIZE,
  take: PAGE_SIZE,
  orderBy: { startDate: 'asc' },
});

const total = await prisma.event.count({ where });

return {
  data: events,
  page,
  pages: Math.ceil(total / PAGE_SIZE),
};
```

### Batch Queries

```typescript
// Good: Single query with relations
const events = await prisma.event.findMany({
  include: { city: true },
});

// Bad: N+1 queries
const events = await prisma.event.findMany();
for (const event of events) {
  event.city = await prisma.city.findUnique({ 
    where: { id: event.cityId } 
  });
}
```

## React Optimization

### Memoize Expensive Calculations

```typescript
import { useMemo } from 'react';

const filteredEvents = useMemo(() => {
  return events.filter(e => e.category === selectedCategory);
}, [events, selectedCategory]);
```

### Callback Memoization

```typescript
import { useCallback } from 'react';

const handleClick = useCallback((id: string) => {
  router.push(`/event/${id}`);
}, [router]);
```

### Avoid Re-renders

```typescript
// Good: Stable reference
const OPTIONS = [{ value: 'all', label: 'All' }];

function Filter({ onChange }) {
  return <Select options={OPTIONS} onChange={onChange} />;
}

// Bad: New array each render
function Filter({ onChange }) {
  return (
    <Select 
      options={[{ value: 'all', label: 'All' }]} 
      onChange={onChange} 
    />
  );
}
```

## Bundle Size

### Tree-Shake Lucide Icons

```typescript
// Good: Import specific icons
import { Calendar, MapPin } from 'lucide-react';

// Bad: Import everything
import * as Icons from 'lucide-react';
```

### Check Bundle Size

```bash
# Analyze bundle
npm run build
# Look for large chunks in output
```

## Loading States

### Skeleton Loading

```typescript
function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
    </div>
  );
}
```

### Suspense Boundaries

```typescript
import { Suspense } from 'react';

<Suspense fallback={<EventsSkeleton />}>
  <EventsList citySlug={citySlug} />
</Suspense>
```

## Core Web Vitals

### LCP (Largest Contentful Paint)
- Preload hero images
- Use `priority` on hero Image
- Avoid large JS blocking render

### FID (First Input Delay)
- Defer non-critical JS
- Use web workers for heavy computation
- Minimize main thread work

### CLS (Cumulative Layout Shift)
- Set explicit width/height on images
- Reserve space for dynamic content
- Avoid inserting content above fold

## Checklist

- [ ] Cache API responses appropriately
- [ ] Use ISR for public pages
- [ ] Optimize images with next/image
- [ ] Lazy load maps and heavy components
- [ ] Select only needed DB fields
- [ ] Paginate large queries
- [ ] Memoize expensive calculations
- [ ] Use skeleton loading states
- [ ] Tree-shake icon imports
- [ ] Set image dimensions to prevent CLS
