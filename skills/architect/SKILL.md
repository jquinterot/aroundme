---
name: architect
description: Software architect skill for enforcing SOLID principles, clean architecture, design patterns, and detecting code duplication. Use when designing new features, refactoring existing code, reviewing architecture, creating abstractions, or when the user mentions scalability, clean code, SOLID, DRY, design patterns, or code duplication.
---

# Software Architect

Guide for designing scalable, maintainable, and reusable software architecture. Enforces SOLID principles, clean code practices, and design patterns while actively detecting and eliminating code duplication.

## Core Responsibilities

1. **Architecture Design** - Design clean, scalable architectures before implementation
2. **Code Review** - Review code for SOLID violations, anti-patterns, and duplication
3. **Refactoring Guidance** - Suggest refactorings that improve maintainability
4. **Abstraction Creation** - Identify opportunities for reusable abstractions
5. **Dependency Management** - Ensure proper dependency direction and decoupling

## SOLID Principles Enforcement

### Single Responsibility Principle (SRP)

Every module, class, or function should have one reason to change.

**Detection:**
- Functions longer than 50 lines
- Components with multiple unrelated state management concerns
- Files with mixed responsibilities (UI + data fetching + business logic)
- Multiple `useEffect` hooks doing unrelated things

**Fix Pattern:**
```typescript
// BAD: Component doing too much
export function EventPage() {
  const [event, setEvent] = useState();
  const [comments, setComments] = useState();
  const [mapLoaded, setMapLoaded] = useState();
  
  // fetch event
  useEffect(() => { ... }, []);
  // fetch comments
  useEffect(() => { ... }, []);
  // init map
  useEffect(() => { ... }, []);
  // analytics
  useEffect(() => { ... }, []);
  
  return (...);
}

// GOOD: Extract into focused hooks and components
export function EventPage() {
  const { event } = useEvent(eventId);
  const { comments } = useComments(eventId);
  
  return (
    <EventLayout>
      <EventDetail event={event} />
      <EventMap location={event.venue} />
      <CommentSection comments={comments} />
    </EventLayout>
  );
}
```

### Open/Closed Principle (OCP)

Software entities should be open for extension, but closed for modification.

**Detection:**
- Long switch statements or if-else chains for type handling
- Components that need modification to add new variants
- API routes with manual validation for each new field

**Fix Pattern:**
```typescript
// BAD: Adding new badge type requires modifying component
function Badge({ type }) {
  if (type === 'featured') return <span className="bg-yellow-500">Featured</span>;
  if (type === 'free') return <span className="bg-green-500">Free</span>;
  if (type === 'new') return <span className="bg-blue-500">New</span>;
  return null;
}

// GOOD: Strategy pattern with configuration
const BADGE_CONFIG = {
  featured: { className: 'bg-yellow-500', label: 'Featured' },
  free: { className: 'bg-green-500', label: 'Free' },
  new: { className: 'bg-blue-500', label: 'New' },
} as const;

function Badge({ type }: { type: keyof typeof BADGE_CONFIG }) {
  const config = BADGE_CONFIG[type];
  return <span className={config.className}>{config.label}</span>;
}
```

### Liskov Substitution Principle (LSP)

Subtypes must be substitutable for their base types.

**Detection:**
- Props interfaces with optional fields that are actually required
- Components that throw errors when certain props are missing
- Type guards that break polymorphism

**Fix Pattern:**
```typescript
// BAD: Optional prop that's actually required
interface CardProps {
  title: string;
  image?: string; // Actually required for the component to render properly
}

// GOOD: Split into specific types
interface BaseCardProps {
  title: string;
}

interface ImageCardProps extends BaseCardProps {
  image: string;
  imageAlt: string;
}

interface PlaceholderCardProps extends BaseCardProps {
  placeholder: true;
}

type CardProps = ImageCardProps | PlaceholderCardProps;
```

### Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they do not use.

**Detection:**
- Large interfaces with many optional properties
- Props passed down through multiple layers where intermediate components don't use them
- God objects or mega-types

**Fix Pattern:**
```typescript
// BAD: One massive props interface
interface EntityProps {
  id: string;
  name: string;
  description: string;
  image: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  price: number;
  category: string;
  // ... 20 more fields
}

// GOOD: Compose from smaller interfaces
interface EntityIdentity {
  id: string;
  name: string;
}

interface EntityMedia {
  image?: string;
  description?: string;
}

interface EntityLocation {
  coordinates: { lat: number; lng: number };
  address?: string;
}

interface EntityMetrics {
  rating?: number;
  price?: number;
}

type EventCardProps = EntityIdentity & EntityMedia & EntityLocation & {
  date: DateRange;
  category: EventCategory;
};
```

### Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Detection:**
- Direct imports of Prisma client in components
- Hard-coded API URLs in fetch calls
- Tight coupling to specific libraries (direct lucide-react imports everywhere)
- Business logic depending on UI frameworks

**Fix Pattern:**
```typescript
// BAD: Direct dependency on implementation
import { prisma } from '@/lib/prisma';

export async function getEvent(id: string) {
  return prisma.event.findUnique({ where: { id } });
}

// GOOD: Depend on abstraction
interface EventRepository {
  findById(id: string): Promise<Event | null>;
}

// Implementation detail isolated
export class PrismaEventRepository implements EventRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string) {
    return this.prisma.event.findUnique({ where: { id } });
  }
}

// High-level code uses abstraction
export async function getEventDetails(repo: EventRepository, id: string) {
  const event = await repo.findById(id);
  // business logic here, no dependency on Prisma
}
```

## Clean Architecture Layers

For Next.js applications, organize code in layers:

```
src/
├── app/                 # Presentation layer (pages, loading UI, error UI)
├── components/          # UI components (pure presentational)
├── hooks/              # Custom React hooks (presentation logic)
├── services/           # Business logic layer (use cases, domain operations)
├── lib/                # Infrastructure layer (utils, external APIs, configs)
├── types/              # Domain types and interfaces
└── contexts/           # State management (cross-cutting)
```

### Layer Rules

1. **App Layer** - Only imports from components, hooks, services, contexts
2. **Components Layer** - Only imports from types, lib/utils (not lib/api), components/ui
3. **Hooks Layer** - Only imports from services, types, lib/utils
4. **Services Layer** - Only imports from types, lib/utils, lib/api
5. **Lib Layer** - Can import anything, but utils should be pure functions
6. **Types Layer** - No imports from other layers (except other types)

### Dependency Direction

```
App -> Components -> Hooks -> Services -> Lib
  |       |          |          |         |
  +-------+----------+----------+---------+
              |
           Types (every layer depends on types)
```

## Design Patterns for Next.js/React

### 1. Compound Component Pattern

Use when building complex UI with shared state:

```typescript
// Card.tsx
export const Card = Object.assign(
  function Card({ children, className }: CardProps) {
    return <div className={cn("rounded-xl border", className)}>{children}</div>;
  },
  {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
  }
);

// Usage:
<Card>
  <Card.Header>...</Card.Header>
  <Card.Body>...</Card.Body>
  <Card.Footer>...</Card.Footer>
</Card>
```

### 2. Render Props / Slot Pattern

Use for flexible component composition:

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  renderRow?: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
}
```

### 3. Factory Pattern

Use for creating objects based on configuration:

```typescript
// services/analytics/factory.ts
const analyticsProviders = {
  google: GoogleAnalyticsProvider,
  mixpanel: MixpanelProvider,
  debug: DebugAnalyticsProvider,
};

export function createAnalyticsProvider(type: keyof typeof analyticsProviders) {
  return new analyticsProviders[type]();
}
```

### 4. Repository Pattern

Use for data access abstraction:

```typescript
// types/repository.ts
interface CrudRepository<T, CreateDTO, UpdateDTO> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
}
```

### 5. Adapter Pattern

Use for integrating external libraries:

```typescript
// lib/cache/adapter.ts
interface CacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class RedisCacheAdapter implements CacheAdapter { ... }
export class MemoryCacheAdapter implements CacheAdapter { ... }
```

## Code Duplication Detection

### Duplication Types

1. **Exact Duplication** - Copy-pasted code (use tools or regex search)
2. **Near Duplication** - Slightly modified copy-pasted code
3. **Structural Duplication** - Same pattern with different types/names
4. **Semantic Duplication** - Different code doing the same thing

### Detection Strategy

When reviewing code, scan for:

1. **Repeated JSX Patterns:**
   - Multiple cards with same structure (event, place, activity cards)
   - Multiple filter components with same logic
   - Multiple detail pages with same layout

2. **Repeated Business Logic:**
   - Date formatting in multiple places
   - Price calculations duplicated
   - Pagination logic copied
   - Error handling patterns repeated

3. **Repeated API Patterns:**
   - Similar fetch hooks with only URL different
   - Similar mutation hooks
   - Similar loading/error states

### Elimination Patterns

```typescript
// BEFORE: Three similar fetch hooks
function useEvents() { ... }
function usePlaces() { ... }
function useActivities() { ... }

// AFTER: Generic hook with type safety
function useEntities<T>(endpoint: string) {
  return useQuery<T[]>({
    queryKey: [endpoint],
    queryFn: () => fetch(`/api/${endpoint}`).then(r => r.json()),
  });
}

// Usage:
const { data: events } = useEntities<Event>('events');
const { data: places } = useEntities<Place>('places');
```

```typescript
// BEFORE: Duplicated card structures
// EventCard, PlaceCard, ActivityCard all have image, title, metadata, badges

// AFTER: Generic Card with slots
interface EntityCardProps<T extends BaseEntity> {
  entity: T;
  image: React.ReactNode;
  badges: React.ReactNode;
  metadata: React.ReactNode;
  href: string;
}

// Then create thin wrappers:
export function EventCard({ event }: { event: Event }) {
  return (
    <EntityCard
      entity={event}
      image={<EventImage event={event} />}
      badges={<EventBadges event={event} />}
      metadata={<EventMetadata event={event} />}
      href={`/event/${event.id}`}
    />
  );
}
```

## Scalability Checklist

When reviewing or designing code, verify:

- [ ] Can this component handle 10x more data without changes?
- [ ] Can a new developer add a new feature type without modifying existing code?
- [ ] Can we swap the database without touching UI code?
- [ ] Are there any hardcoded values that should be configurable?
- [ ] Is there a single source of truth for each piece of data?
- [ ] Can this feature be turned off without breaking the app?
- [ ] Is error handling consistent across the feature?
- [ ] Are side effects isolated and testable?
- [ ] Would adding a new field require changes in more than 3 files?
- [ ] Is there any prop drilling deeper than 2 levels?

## Anti-Patterns to Eliminate

### 1. God Components
Components over 200 lines or with more than 5 hooks. Split into smaller focused components.

### 2. Prop Drilling
Passing props through 3+ layers. Use composition, context, or state management.

### 3. Magic Strings/Numbers
Hardcoded values scattered in code. Extract to constants or configuration.

### 4. Tight Coupling
Components knowing about each other's internals. Use events, callbacks, or state management.

### 5. Premature Abstraction
Abstractions before duplication appears. Wait for the rule of three: extract on third occurrence.

### 6. Deep Nesting
More than 3 levels of nested ternaries or callback chains. Flatten with early returns or helper functions.

## Code Review Process

When asked to review code:

1. **Scan for duplication** - Look for copy-pasted patterns
2. **Check layer violations** - Ensure imports follow dependency direction
3. **Verify SOLID** - Check each principle against the code
4. **Measure complexity** - Flag files >200 lines or functions >50 lines
5. **Check type safety** - Ensure no `any` types, proper generics usage
6. **Validate abstractions** - Are they necessary? Do they reduce or add complexity?
7. **Suggest concrete refactors** - Provide before/after code examples

## Output Format

When providing architecture recommendations, always use this structure:

```markdown
## Issue: [Brief description]

**Principle Violated:** [SOLID principle or pattern]
**Location:** [File path and line numbers]
**Severity:** [High/Medium/Low]

**Current Code:**
```typescript
// problematic code
```

**Recommended Fix:**
```typescript
// improved code
```

**Benefits:**
- [List benefits]

**Migration Steps:**
1. [Step 1]
2. [Step 2]
```
