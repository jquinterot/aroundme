# AroundMe - Architecture Review

## Overview

**Good foundation** with modern Next.js patterns, but several structural issues need attention.

---

## Strengths

- **Next.js 16 App Router** - Proper route groups `(auth)`, dynamic segments `[id]`
- **Domain-based components** - events/, places/, activities/ folders
- **E2E testing** - Well-organized Playwright tests with POM pattern
- **Error handling** - Consistent `handleApiError` across API routes
- **Barrel exports** - Clean imports via `index.ts` files
- **Middleware** - Properly configured at root level
- **Type safety** - Strong TypeScript with Prisma-generated types

---

## Critical Issues

### 1. Files Too Large

| File | Lines | Problem | Fix |
|------|-------|---------|-----|
| `src/app/admin/page.tsx` | 1,041 | 8 tabs in one file | Split into `admin/(tabs)/` or separate components |
| `src/lib/validation.ts` | 639 | All validation together | Split: `validation/event.ts`, `validation/user.ts` |
| `src/app/activity/[id]/page.tsx` | 564 | Page + booking logic | Extract to `hooks/useActivityBooking.ts` |
| `src/types/index.ts` | 436 | Too many types | Split by domain |
| `src/components/ui/FormComponents.tsx` | 368 | Multiple components | Split into `ui/forms/*.tsx` |

### 2. Wrong Locations

| File | Currently | Should Be |
|------|-----------|-----------|
| `eventUtils.ts` | `components/events/` | `lib/events/` |
| `useMapInitialization.ts` | `components/map/` | `hooks/` |
| `social/index.tsx` | `components/social/` | `index.ts` (no JSX) |
| `checkin/index.tsx` | `components/checkin/` | `index.ts` (no JSX) |
| `constants.emoji-backup.ts` | `lib/` | Delete or move to `backups/` |

### 3. Empty/Unused Directories

- `src/store/` - 0 bytes, unused
- `src/utils/` - 0 bytes, unused
- `src/components/common/` - empty

Delete or populate these.

---

## Naming Inconsistencies

### File Extensions
```
useApi.ts       ✓
usePremium.tsx  ✗ (should be .ts, doesn't return JSX)
```

### Index Files
```
social/index.tsx     ✗ (no JSX, should be .ts)
checkin/index.tsx    ✗ (no JSX, should be .ts)
layout/index.ts      ✓
```

---

## API Routes Issues

### Missing Files
- `/api/activities/route.ts` - missing (but `/api/activities/[id]/route.ts` exists)

### Duplicate Logic
- `/api/user/` and `/api/users/` - merge or clarify distinction

### Large Route Files
- `/api/places/[id]/reviews/route.ts` (246 lines) - split handlers
- `/api/events/[id]/route.ts` (200 lines) - separate GET/PATCH/DELETE
- `/api/stripe/checkout/route.ts` (193 lines) - move logic to services

---

## Mixed Concerns Examples

### `admin/page.tsx` (1,041 lines)
Contains:
- 8 tab components
- Data fetching
- Tab state management

**Fix:**
```
src/app/admin/
├── page.tsx (minimal, tab switcher)
├── layout.tsx
└── components/
    ├── OverviewTab.tsx
    ├── EventsTab.tsx
    ├── UsersTab.tsx
    └── ReportsTab.tsx
```

### `activity/[id]/page.tsx` (564 lines)
Contains:
- Data fetching
- Booking form state
- Booking mutations
- UI rendering

**Fix:**
```
src/app/activity/[id]/
├── page.tsx (UI only)
├── hooks/
│   └── useActivityBooking.ts
└── lib/
    └── activityCategories.ts
```

---

## Recommendations Priority

### High (Do First)
1. **Split admin/page.tsx** - 1,041 lines is unmaintainable
2. **Remove empty folders** - `store/`, `utils/`
3. **Move utilities** out of components/
4. **Split validation.ts** by domain

### Medium
5. Rename `.tsx` index files to `.ts` where no JSX
6. Split `FormComponents.tsx` into separate files
7. Organize types by domain
8. Delete `constants.emoji-backup.ts`

### Low
9. Standardize hook file extensions
10. Move generated code out of `src/`
11. Consider colocating tests with source

---

## Quick Wins

```bash
# 1. Delete empty directories
rm -rf src/store src/utils

# 2. Fix index file extensions
mv src/components/social/index.tsx src/components/social/index.ts
mv src/components/checkin/index.tsx src/components/checkin/index.ts

# 3. Move utilities
mkdir -p src/lib/events
mv src/components/events/eventUtils.ts src/lib/events/

# 4. Move hook
mv src/components/map/useMapInitialization.ts src/hooks/

# 5. Delete backup
rm src/lib/constants.emoji-backup.ts
```

---

## Architecture Score

| Category | Score | Notes |
|----------|-------|-------|
| Folder Structure | 8/10 | Good but empty dirs |
| Naming | 7/10 | Minor inconsistencies |
| Component Org | 7/10 | Some files too large |
| API Routes | 8/10 | Well organized |
| Separation of Concerns | 6/10 | admin/activity pages mixed |
| Testing | 9/10 | Excellent E2E setup |
| **Overall** | **7.5/10** | Solid with room to improve |
