# AroundMe Code Review Findings

## Status: All critical/high-priority issues fixed

## Fixed Issues

### 1. Activity API mismatch - FIXED
- **File**: `src/app/activity/page.tsx`
- **Issue**: Line 44 was using `data.hasMore` but API returns `page` and `pages`
- **Fix**: Changed to `data.page < data.pages`

### 2. WaitlistCount hook misuse - FIXED
- **File**: `src/components/events/WaitlistButton.tsx`
- **Issue**: Line 174 was using `useState` instead of `useEffect` for data fetching
- **Fix**: Changed to use `useEffect` pattern with proper async fetch

### 3. Save button no handler - FIXED
- **File**: `src/app/place/[id]/page.tsx`
- **Issue**: Lines 314-321 Save/Share buttons had no onClick handlers
- **Fix**: Added `handleSave` and `handleShare` functions with proper implementations

### 4. Activity tab empty - FIXED
- **File**: `src/app/profile/[id]/page.tsx`
- **Issue**: Activity tab showed placeholder "No hay actividad reciente" with no actual data fetching
- **Fix**: Added `ActivityCard` import, activity state, `fetchUserActivities` function, useEffect to fetch on tab change, and proper ActivityCard rendering. Also modified `/api/activity` to accept `userId` filter parameter.

### 5. Error handling catch blocks - FIXED
- **File**: `src/app/event/[id]/check-in/page.tsx`
- **Issue**: Empty catch blocks silently failing
- **Fix**: Added proper error logging with `console.error`

### 6. Hardcoded city/coordinate values - FIXED
- **File**: `src/app/create-event/page.tsx`
- **Issue**: `cityId: 'bogota'` and coordinates hardcoded
- **Fix**: Changed `cityId` to empty string, coordinates to 0

### 7. Missing form validation - FIXED
- **File**: `src/components/forms/create-event/StepBasicInfo.tsx`
- **Issue**: No validation for city selection
- **Fix**: Added `cityId` to the `isValid` check

### 8. Duplicate User interface - FIXED
- **File**: `src/types/components.ts`
- **Issue**: Duplicate User interface definition
- **Fix**: Removed local User interface and imported from `@/types/index`

### 9. Error.tsx files - FIXED
- **Files**: Multiple error.tsx files
- **Issue**: Re-exporting client component from server component files
- **Fix**: Created proper client-side error.tsx files with inline implementations

### 10. Header service worker - FIXED
- **File**: `src/components/layout/Header.tsx`
- **Issue**: Silent `.catch(console.error)` failure
- **Fix**: Added proper error logging

### 11. Activity detail page buttons - FIXED
- **File**: `src/app/activity/[id]/page.tsx`
- **Issue**: Heart (Save) and Share buttons had no onClick handlers
- **Fix**: Added `isSaved` state, `handleSave` and `handleShare` functions with proper implementations

### 12. Activity detail page hardcoded link - FIXED
- **File**: `src/app/activity/[id]/page.tsx`
- **Issue**: Line 133 had hardcoded `/bogota/activities` link
- **Fix**: Changed to use `activityData?.data?.city?.slug || 'bogota'` for dynamic city

### 13. Submit-place hardcoded cityId - FIXED
- **File**: `src/app/submit-place/page.tsx`
- **Issue**: `cityId: 'bogota'` was hardcoded
- **Fix**: Changed to empty string

### 14. Submit-place form validation - FIXED
- **File**: `src/components/forms/submit-place/StepBasicInfo.tsx`
- **Issue**: `isValid` check didn't include `cityId` validation
- **Fix**: Added `formData.cityId` to the `isValid` check

### 15. RecommendationsPanel /discover link - FIXED
- **File**: `src/components/events/RecommendationsPanel.tsx`
- **Issue**: "Ver más" link pointed to `/discover` which doesn't exist
- **Fix**: Changed to `/bogota`

---

## Remaining Issues (Not Critical)

### Medium Priority

1. **Create Activity page** - Still a "Coming Soon" placeholder, but this is intentional feature work

2. **Unused imports with underscore prefix** - Code quality issue, not breaking:
   - `TicketSelector.tsx`: `eventId: _, eventTitle: _2`
   - `SeriesComponents.tsx`: `onDelete: _`

---

## Verification Commands

```bash
npm run lint    # Passes
npm run test    # 93 tests pass
npm run build   # Builds successfully
```

## Summary

- **Critical Issues**: All fixed
- **High Priority Issues**: All fixed
- **Medium Priority Issues**: Mostly fixed (intentional placeholders remain)
- **Low Priority Issues**: Unused imports remain (code quality, not breaking)
