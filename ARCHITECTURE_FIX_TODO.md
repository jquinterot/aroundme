# AroundMe Architecture Fix - Master TODO List

## Progress Tracking
- [x] Phase 1: Critical Issues (Files Too Large) - COMPLETED 1.1, 1.2, 1.3, 1.4
- [x] Phase 2: High Priority (Wrong Locations, Structure) - COMPLETED 2.1, 2.3
- [x] Phase 3: Medium Priority (Naming, Organization) - COMPLETED 3.2, 3.3
- [ ] Phase 4: Low Priority (Cleanup, Standardization)

---

## PHASE 1: CRITICAL ISSUES - Files Too Large

### 1.1 Split `src/app/admin/page.tsx` (1,041 lines) 🚨 CRITICAL
- [ ] **1.1.1** Create `src/app/admin/components/` directory
- [ ] **1.1.2** Create `src/app/admin/components/OverviewTab.tsx` (extract lines 100-250)
- [ ] **1.1.3** Create `src/app/admin/components/EventsTab.tsx` (extract lines 250-400)
- [ ] **1.1.4** Create `src/app/admin/components/PlacesTab.tsx` (extract lines 400-550)
- [ ] **1.1.5** Create `src/app/admin/components/UsersTab.tsx` (extract lines 550-700)
- [ ] **1.1.6** Create `src/app/admin/components/ReportsTab.tsx` (extract lines 700-850)
- [ ] **1.1.7** Create `src/app/admin/components/CitiesTab.tsx` (extract lines 850-950)
- [ ] **1.1.8** Create `src/app/admin/components/SettingsTab.tsx` (extract lines 950-1041)
- [ ] **1.1.9** Create `src/app/admin/components/tabs/index.ts` barrel export
- [ ] **1.1.10** Refactor `src/app/admin/page.tsx` to use tab components (target: <150 lines)
- [ ] **1.1.11** Run lint and tests
- [ ] **1.1.12** Verify admin page still works

**Acceptance Criteria:**
- Admin page reduced to <150 lines
- Each tab is <200 lines
- All functionality preserved
- Tests pass

---

### 1.2 Split `src/lib/validation.ts` (639 lines) 🚨 CRITICAL
- [ ] **1.2.1** Create `src/lib/validation/` directory
- [ ] **1.2.2** Create `src/lib/validation/types.ts` (extract types: ValidationRule, ValidationResult, etc.)
- [ ] **1.2.3** Create `src/lib/validation/core.ts` (validateData, validateField, sanitizeValue functions)
- [ ] **1.2.4** Create `src/lib/validation/event.ts` (event-specific validation)
- [ ] **1.2.5** Create `src/lib/validation/user.ts` (user/auth validation)
- [ ] **1.2.6** Create `src/lib/validation/place.ts` (place validation)
- [ ] **1.2.7** Create `src/lib/validation/index.ts` barrel export
- [ ] **1.2.8** Update all imports from `@/lib/validation` to specific modules
- [ ] **1.2.9** Run lint and tests
- [ ] **1.2.10** Verify validation still works

**Acceptance Criteria:**
- Each validation file <150 lines
- Clear domain separation
- All imports updated
- No breaking changes

---

### 1.3 Refactor `src/app/activity/[id]/page.tsx` (564 lines) 🚨 CRITICAL
- [ ] **1.3.1** Create `src/hooks/useActivityBooking.ts` (extract booking logic: lines 60-200)
- [ ] **1.3.2** Create `src/lib/activities/categories.ts` (extract categoryColors, skillLevelLabels)
- [ ] **1.3.3** Create `src/components/activities/BookingForm.tsx` (extract booking UI)
- [ ] **1.3.4** Create `src/components/activities/ActivityHeader.tsx` (extract header UI)
- [ ] **1.3.5** Create `src/components/activities/ActivityDetails.tsx` (extract details section)
- [ ] **1.3.6** Refactor page.tsx to use new components (target: <150 lines)
- [ ] **1.3.7** Run lint and tests
- [ ] **1.3.8** Verify activity page still works

**Acceptance Criteria:**
- Page reduced to <150 lines
- Booking logic in hook
- UI components <200 lines each
- All functionality preserved

---

### 1.4 Split `src/components/ui/FormComponents.tsx` (368 lines) 🚨 CRITICAL
- [ ] **1.4.1** Create `src/components/ui/forms/` directory
- [ ] **1.4.2** Create `src/components/ui/forms/FormInput.tsx` (extract FormInput component)
- [ ] **1.4.3** Create `src/components/ui/forms/FormSelect.tsx` (extract FormSelect component)
- [ ] **1.4.4** Create `src/components/ui/forms/FormTextarea.tsx` (extract FormTextarea component)
- [ ] **1.4.5** Create `src/components/ui/forms/CategorySelector.tsx` (extract CategorySelector component)
- [ ] **1.4.6** Create `src/components/ui/forms/FormButton.tsx` (extract FormButton component)
- [ ] **1.4.7** Create `src/components/ui/forms/ToggleOption.tsx` (extract ToggleOption component)
- [ ] **1.4.8** Update `src/components/ui/forms/index.ts` barrel export
- [ ] **1.4.9** Update `src/components/ui/index.ts` to export from forms/
- [ ] **1.4.10** Update all imports throughout codebase
- [ ] **1.4.11** Run lint and tests
- [ ] **1.4.12** Verify forms still work

**Acceptance Criteria:**
- Each form component <100 lines
- Clean barrel exports
- All imports updated
- No breaking changes

---

## PHASE 2: HIGH PRIORITY - Wrong Locations & Structure

### 2.1 Move Utility Files Out of Components 📍 HIGH
- [ ] **2.1.1** Create `src/lib/events/` directory
- [ ] **2.1.2** Move `src/components/events/eventUtils.ts` → `src/lib/events/utils.ts`
- [ ] **2.1.3** Update imports in all files using eventUtils
- [ ] **2.1.4** Move `src/components/map/useMapInitialization.ts` → `src/hooks/useMapInitialization.ts`
- [ ] **2.1.5** Update imports in map components
- [ ] **2.1.6** Run lint and tests
- [ ] **2.1.7** Verify everything works

---

### 2.2 Fix Index File Extensions 📍 HIGH
- [ ] **2.2.1** Rename `src/components/social/index.tsx` → `src/components/social/index.ts`
- [ ] **2.2.2** Rename `src/components/checkin/index.tsx` → `src/components/checkin/index.ts`
- [ ] **2.2.3** Verify no JSX in these files
- [ ] **2.2.4** Run lint and tests

---

### 2.3 Clean Up Empty Directories 📍 HIGH
- [ ] **2.3.1** Remove `src/store/` directory (empty)
- [ ] **2.3.2** Remove `src/utils/` directory (empty)
- [ ] **2.3.3** Update any documentation referencing these directories
- [ ] **2.3.4** Run lint to verify no broken imports

---

### 2.4 Organize Types Directory 📍 HIGH
- [ ] **2.4.1** Create `src/types/events.ts` (move event types from index.ts)
- [ ] **2.4.2** Create `src/types/places.ts` (move place types from index.ts)
- [ ] **2.4.3** Create `src/types/users.ts` (move user types from index.ts)
- [ ] **2.4.4** Create `src/types/api.ts` (move API types from index.ts)
- [ ] **2.4.5** Create `src/types/index.ts` barrel export (keep it <100 lines)
- [ ] **2.4.6** Update all imports to use new type locations
- [ ] **2.4.7** Run lint and tests
- [ ] **2.4.8** Verify types still work

**Target:** `src/types/index.ts` should be <100 lines

---

### 2.5 Split Large API Routes 📍 HIGH
- [ ] **2.5.1** Split `src/app/api/places/[id]/reviews/route.ts` (246 lines)
  - [ ] Create `src/app/api/places/[id]/reviews/handlers.ts`
  - [ ] Extract GET, POST, PUT, DELETE handlers
  - [ ] Refactor route.ts to use handlers (target: <80 lines)
- [ ] **2.5.2** Split `src/app/api/events/[id]/route.ts` (200 lines)
  - [ ] Create `src/app/api/events/[id]/handlers.ts`
  - [ ] Extract GET, PATCH, DELETE handlers
  - [ ] Refactor route.ts (target: <80 lines)
- [ ] **2.5.3** Split `src/app/api/stripe/checkout/route.ts` (193 lines)
  - [ ] Create `src/lib/stripe/checkout.ts` service
  - [ ] Move business logic to service layer
  - [ ] Refactor route.ts (target: <80 lines)
- [ ] **2.5.4** Run lint and tests for all routes
- [ ] **2.5.5** Verify all API routes work

---

## PHASE 3: MEDIUM PRIORITY - Naming & Organization

### 3.1 Standardize Hook File Extensions 📋 MEDIUM
- [ ] **3.1.1** Rename `src/hooks/usePremium.tsx` → `src/hooks/usePremium.ts`
- [ ] **3.1.2** Verify hook doesn't return JSX
- [ ] **3.1.3** Run lint and tests

---

### 3.2 Clean Up Backup Files 📋 MEDIUM
- [ ] **3.2.1** Move `src/lib/constants.emoji-backup.ts` → `backups/constants.emoji-backup.ts`
- [ ] **3.2.2** OR remove if truly not needed
- [ ] **3.2.3** Run lint to verify no imports broken

---

### 3.3 Create Missing Component Exports 📋 MEDIUM
- [ ] **3.3.1** Create `src/components/admin/index.ts` barrel export
- [ ] **3.3.2** Export all admin components/types
- [ ] **3.3.3** Update `src/components/index.ts` to include admin
- [ ] **3.3.4** Run lint and tests

---

### 3.4 Organize Activities Components 📋 MEDIUM
- [ ] **3.4.1** Review `src/components/activities/` (currently only ActivityList.tsx)
- [ ] **3.4.2** If needed, create: ActivityCard.tsx, ActivityFilters.tsx
- [ ] **3.4.3** Create `src/components/activities/index.ts` barrel export
- [ ] **3.4.4** Update main components index
- [ ] **3.4.5** Run lint and tests

---

### 3.5 Utilize Common Components Folder 📋 MEDIUM
- [ ] **3.5.1** Move `src/components/ErrorBoundary.tsx` → `src/components/common/ErrorBoundary.tsx`
- [ ] **3.5.2** Create `src/components/common/Loading.tsx` (if not exists in ui/)
- [ ] **3.5.3** Create `src/components/common/index.ts` barrel export
- [ ] **3.5.4** Update all imports
- [ ] **3.5.5** Run lint and tests

---

## PHASE 4: LOW PRIORITY - Cleanup & Standardization

### 4.1 Review Generated Code Location 🔧 LOW
- [ ] **4.1.1** Consider moving `src/generated/` → `generated/` at root
- [ ] **4.1.2** Update tsconfig.json paths if needed
- [ ] **4.1.3** Update all imports
- [ ] **4.1.4** Run build to verify

---

### 4.2 Standardize Test File Locations 🔧 LOW
- [ ] **4.2.1** Review current `src/test/` location
- [ ] **4.2.2** Consider colocating tests: `ComponentName.test.tsx` next to component
- [ ] **4.2.3** OR move to `__tests__/` directories
- [ ] **4.2.4** Update vitest.config.ts if needed
- [ ] **4.2.5** Run tests to verify

---

### 4.3 Consolidate Category Definitions 🔧 LOW
- [ ] **4.3.1** Review inline category definitions in pages
- [ ] **4.3.2** Move to `src/lib/constants.ts` or appropriate domain file
- [ ] **4.3.3** Update all usages to import from constants
- [ ] **4.3.4** Remove duplicates
- [ ] **4.3.5** Run lint and tests

---

### 4.4 Documentation Updates 🔧 LOW
- [ ] **4.4.1** Update `AGENTS.md` with new directory structure
- [ ] **4.4.2** Update architecture diagrams if any
- [ ] **4.4.3** Update any README files

---

## VERIFICATION CHECKLIST

After completing all phases, verify:

- [ ] **V1.** Run `npm run lint` - no errors
- [ ] **V2.** Run `npm run test` - all tests pass
- [ ] **V3.** Run `npx playwright test` - E2E tests pass
- [ ] **V4.** Run `npm run build` - builds successfully
- [ ] **V5.** Manual smoke test of critical flows:
  - [ ] Admin dashboard works
  - [ ] Activity booking works
  - [ ] Forms work correctly
  - [ ] API routes respond correctly
- [ ] **V6.** File size verification:
  - [ ] No file >400 lines (except generated)
  - [ ] Admin page <150 lines
  - [ ] Activity page <150 lines
  - [ ] Validation files <150 lines each
- [ ] **V7.** Import verification:
  - [ ] All barrel exports work
  - [ ] No broken imports
  - [ ] TypeScript compiles without errors

---

## ESTIMATED TIMELINE

- **Phase 1 (Critical):** 4-6 hours
- **Phase 2 (High):** 3-4 hours
- **Phase 3 (Medium):** 2-3 hours
- **Phase 4 (Low):** 1-2 hours
- **Verification:** 1-2 hours

**Total: 11-17 hours**

---

## ORDER OF EXECUTION

Execute in this order to minimize conflicts:

1. **Start with Phase 1.4** (FormComponents) - affects many files
2. **Phase 1.2** (validation.ts) - affects many imports
3. **Phase 2.4** (types) - affects imports
4. **Phase 1.1** (admin) - isolated
5. **Phase 1.3** (activity) - isolated
6. **Phase 2** (High priority items)
7. **Phase 3** (Medium priority items)
8. **Phase 4** (Low priority items)
9. **Verification**

---

## NOTES

- Always run lint and tests after each major change
- Commit frequently with clear messages
- If a task is too complex, break it down further
- Keep track of any unexpected issues in this file
- Update progress by checking off items
