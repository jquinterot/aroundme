# AroundMe Code Review Findings

## Critical (Functionality broken)
1. **Activity API mismatch** - `/src/app/activity/page.tsx` expects different response format than API returns
2. **Recommendations API mismatch** - Panel expects different format than API provides
3. **WaitlistCount hook misuse** - Uses `useState` instead of `useEffect`, will cause infinite loop

## High (Significant issues)
4. **Save/Share buttons** in place detail page have no handlers
5. **Register button** in event detail has no handler
6. **Activity tab** in profile page is completely empty
7. **Create Activity page** is just a placeholder

## Medium (Issues affecting UX)
8. **Multiple empty catch blocks** silently fail
9. **Hardcoded city/coordinate values** in create-event form
10. **Missing form validation** across multiple forms

## Low (Code quality)
11. **Unused imports** with underscore prefix
12. **Duplicate User interface** in components.ts
13. **Silent `.catch(console.error)` failures** in several places

---

## Detailed Issues

### 1. Activity API mismatch
- **File**: `src/app/activity/page.tsx`
- **Issue**: Line 39-41 expects `data.activities` but API returns activities directly in data

### 2. Recommendations API mismatch  
- **File**: `src/components/events/RecommendationsPanel.tsx`
- **Issue**: Line 42 expects `data.data` but API returns data directly

### 3. WaitlistCount hook misuse
- **File**: `src/components/events/WaitlistButton.tsx`
- **Issue**: Line 174 uses `useState` instead of `useEffect` for data fetching

### 4. Save/Share buttons no handlers
- **File**: `src/app/place/[id]/page.tsx`
- **Issue**: Lines 314-321 buttons have no onClick handlers

### 5. Register button no handler
- **File**: `src/components/events/EventActions.tsx`
- **Issue**: Line 30-32 button has no onClick

### 6. Activity tab empty
- **File**: `src/app/profile/[id]/page.tsx`
- **Issue**: Lines 356-361 shows placeholder, no actual activity data

### 7. Create Activity placeholder
- **File**: `src/app/create-activity/page.tsx`
- **Issue**: Entire page is "Coming Soon" placeholder

### 8. Empty catch blocks
- **File**: `src/app/event/[id]/check-in/page.tsx` line 34
- **File**: `src/app/forgot-password/page.tsx` line 101

### 9. Hardcoded values
- **File**: `src/app/create-event/page.tsx` lines 21, 27-28
- **Issue**: cityId 'bogota' and coordinates hardcoded

### 10. Missing form validation
- **File**: `src/components/forms/create-event/StepBasicInfo.tsx`
- **Issue**: No validation for city selection

### 11. Unused imports
- **File**: `src/components/events/TicketSelector.tsx` lines 32-33
- **File**: `src/components/events/SeriesComponents.tsx` line 264

### 12. Duplicate User interface
- **File**: `src/types/components.ts` lines 223-230
- **Issue**: Duplicates User from main types file

### 13. Silent catch failures
- Multiple files use `.catch(console.error)` silently
