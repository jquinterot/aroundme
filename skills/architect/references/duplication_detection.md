# Code Duplication Detection Guide

## Types of Duplication

### 1. Exact Duplication
Copy-pasted code with no changes.

**Detection:**
- Use `grep` or search for identical function bodies
- Look for identical JSX structures with different variable names
- Same regex patterns, same SQL queries, same validation logic

**Example in this codebase:**
```typescript
// EventCard.tsx and PlaceCard.tsx both have:
<div className="relative h-40">
  {!imageLoaded && <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />}
  <Image src={...} onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
</div>
```

**Solution:** Extract `ImageWithLoader` component.

### 2. Near Duplication
Same code with minor variations (different variable names, slight logic changes).

**Detection:**
- Functions with same structure but different types
- Components with same layout but different data
- API routes with same error handling but different endpoints

**Example in this codebase:**
```typescript
// Three similar detail pages (event, place, activity)
// All have: hero image, title, description, map, reviews section, related items
// But implemented separately in event/[id]/page.tsx, place/[id]/page.tsx, activity/[id]/page.tsx
```

**Solution:** Create `EntityDetailPage` layout component with slots.

### 3. Structural Duplication
Same pattern with different data types.

**Detection:**
- CRUD operations for different entities
- Filter/sort logic for different lists
- Form validation for different schemas

**Example:**
```typescript
// hooks/useEvents.ts, hooks/usePlaces.ts, hooks/useActivities.ts
// All follow same pattern: useQuery with fetch, useMutation with invalidate
```

**Solution:** Generic `useEntityList<T>` hook or code generation.

### 4. Semantic Duplication
Different code achieving the same result.

**Detection:**
- Multiple date formatting utilities
- Multiple ways to calculate pagination
- Multiple error boundary patterns

**Example:**
```typescript
// lib/events/utils.ts has formatEventDate()
// lib/places/utils.ts has formatPlaceDate()  
// Both use Intl.DateTimeFormat with same options
```

**Solution:** Consolidate into shared `lib/date-utils.ts`.

## Detection Commands

```bash
# Find similar function patterns
find src -name "*.ts" -o -name "*.tsx" | xargs grep -n "useState(false)" | head -20

# Find repeated className patterns
grep -rn "bg-gray-200 dark:bg-gray-700 animate-pulse" src/

# Find similar hook patterns
grep -rn "useQuery({" src/ | head -20

# Find repeated error handling
grep -rn "handleApiError" src/ | head -20

# Find files with similar imports (structural similarity)
grep -l "lucide-react" src/components/*/*.tsx | sort
```

## Common Duplication Hotspots in Next.js Apps

### 1. Card Components
**Problem:** EventCard, PlaceCard, ActivityCard share 80% structure.
**Solution:**
```typescript
// components/ui/EntityCard.tsx
interface EntityCardProps {
  image: React.ReactNode;
  badges: React.ReactNode;
  title: string;
  metadata: React.ReactNode;
  footer: React.ReactNode;
  href: string;
}
```

### 2. Detail Pages
**Problem:** [id]/page.tsx files for different entities are structurally identical.
**Solution:**
```typescript
// app/entity/[id]/EntityDetailPage.tsx
interface EntityDetailPageProps {
  entity: Entity;
  renderHero: () => React.ReactNode;
  renderDetails: () => React.ReactNode;
  renderRelated: () => React.ReactNode;
}
```

### 3. API Routes
**Problem:** GET, POST, PUT, DELETE patterns repeated across routes.
**Solution:**
```typescript
// lib/api/createCrudRoute.ts
export function createCrudRoute<T>(options: CrudOptions<T>) {
  return {
    GET: async (req: NextRequest) => { ... },
    POST: async (req: NextRequest) => { ... },
  };
}
```

### 4. Form Validation
**Problem:** Zod schemas with similar patterns.
**Solution:**
```typescript
// lib/validation/schemas.ts
const baseEntitySchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  coordinates: coordinatesSchema,
});

const eventSchema = baseEntitySchema.extend({
  date: dateRangeSchema,
  category: eventCategorySchema,
});
```

### 5. Fetch Hooks
**Problem:** useQuery + useMutation patterns duplicated.
**Solution:**
```typescript
// hooks/useEntityMutation.ts
export function useEntityMutation<T>(
  endpoint: string,
  invalidateKeys: string[][]
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: T) => api.post(endpoint, data),
    onSuccess: () => {
      invalidateKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
    },
  });
}
```

## DRY vs WET

**DRY (Don't Repeat Yourself):** Good for business logic, types, utilities.
**WET (Write Everything Twice):** Acceptable for UI when components have different design requirements.

### When to Extract
- Rule of Three: Extract on third occurrence
- Business logic: Extract immediately
- Types/Interfaces: Extract immediately  
- API calls: Extract immediately
- UI components: Extract after 2-3 similar implementations

### When to Keep Duplicated
- Components with different UX requirements
- One-off experimental features
- Pages with significantly different layouts
- Code that changes for different reasons

## Refactoring Priority

1. **High Priority:** Business logic duplication (calculations, validation, data transformation)
2. **Medium Priority:** API layer duplication (fetch patterns, error handling)
3. **Low Priority:** UI duplication (unless it's exact copy-paste)

## Automated Detection

Consider adding to CI:

```bash
# jscpd - JavaScript copy/paste detector
npx jscpd src/ --threshold 30 --reporters console,html

# Or use eslint-plugin-no-duplicates
# In eslint.config.mjs:
// 'import/no-duplicates': 'error'
```
