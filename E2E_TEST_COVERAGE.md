# E2E Test Coverage Analysis

## Current Status

### Test Results Summary
| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
| **UI Tests** | 75 | 74 | 1 |
| **API Tests** | 108 | 57 | 51 |
| **Total** | 183 | 131 | 52 |

### UI Tests (75 tests)
**✅ PASSING: 74**

### API Tests Failing (51 failures)
Mostly due to **pre-existing authentication issues** - not related to test IDs:
- Auth tests (login/register) - 15 failures
- Admin tests - 6 failures  
- Events (RSVP, CRUD) - 9 failures
- Users, Orders, Places - multiple failures
- Other (follow, notifications, waitlist, etc.)

---

## Current Test ID Usage in UI Tests

### ✅ Tests Using Data Test IDs:
```typescript
// Navigation & Discovery
'[data-testid^="event-card"]'           // Event cards
'[data-testid^="place-card"]'           // Place cards  
'[data-testid^="activity-card"]'        // Activity cards
'[data-testid="hero-section"]'          // Hero section
'[data-testid="hero-title"]'            // Hero title
'[data-testid="hero-tabs"]'             // Hero tabs
'[data-testid="tab-events"]'           // Tab buttons
'[data-testid="search-input"]'          // Search

// Auth Pages
'[data-testid="login-form"]'            // Login form
'[data-testid="signup-form"]'           // Signup form  
'[data-testid="login-email-input"]'     // Login email
'[data-testid="login-password-input"]'   // Login password

// Header
'[data-testid="header"]'                // Header
'[data-testid="header-logo"]'           // Logo link
'[data-testid="user-menu-button"]'      // User menu
'[data-testid="login-link"]'             // Login link
'[data-testid="signup-link"]'            // Signup link

// Admin
'[data-testid="admin-page-container"]'  // Admin page
'[data-testid="admin-title"]'            // Admin title
'[data-testid="admin-nav"]'              // Admin nav
```

---

## What's COVERED (UI Tests)

### ✅ Authentication (Auth Pages)
- Login page loads
- Signup page loads  
- Forgot password page loads
- Navigation between auth pages
- Form display with test IDs

### ✅ Navigation & Discovery
- Home page loads
- City page navigation from hero
- Tab navigation (Events/Places/Activities)
- Tab content switching
- Rapid tab switching (stress test)

### ✅ Events
- Event cards display
- Event filtering by category
- Event detail page loads
- Event information display
- Map display on detail
- Google Maps directions link

### ✅ Places
- Place cards display
- Place filtering by category
- Place detail page loads
- Place information display
- Contact links functionality

### ✅ Activities
- Activity cards display
- Activity filtering by category
- Activity detail page loads
- Activity booking section

### ✅ Profile & Dashboard
- Profile page loads
- Dashboard loads when authenticated

### ✅ Checkout
- Cancel page loads

### ✅ Documentation
- Docs page loads

---

## What's MISSING (UI Tests)

### ❌ Forms & Interactive Flows

| Missing Coverage | Priority | Test ID Needed |
|------------------|----------|----------------|
| **Create Event Flow** | HIGH | form inputs, submit button |
| **Submit Place Flow** | HIGH | form inputs, submit button |
| **RSVP to Event** | HIGH | RSVP buttons (going/interested/maybe) |
| **Save Event** | HIGH | save button |
| **Login Form Submit** | HIGH | submit button, form validation |
| **Signup Form Submit** | HIGH | submit button, form validation |
| **Search Submit** | HIGH | search submit |
| **Profile Update** | MEDIUM | form inputs, update button |

### ❌ User Interactions

| Missing Coverage | Priority | Test ID Needed |
|------------------|----------|----------------|
| **Event Registration** | HIGH | register button |
| **Event Waitlist** | MEDIUM | waitlist button |
| **Place Reviews** | MEDIUM | review form, submit |
| **Activity Booking** | HIGH | booking form |
| **User Menu Dropdown** | MEDIUM | dropdown items |
| **Logout Flow** | MEDIUM | logout button |

### ❌ Error States

| Missing Coverage | Priority | Test ID Needed |
|------------------|----------|----------------|
| **Error Boundary** | HIGH | error-container, retry button |
| **Loading States** | MEDIUM | loading, page-loading |
| **Empty States** | MEDIUM | empty-* containers |
| **Form Validation Errors** | HIGH | error messages |

### ❌ Admin Dashboard

| Missing Coverage | Priority | Test ID Needed |
|------------------|----------|----------------|
| **Tab Switching** | HIGH | admin tab buttons |
| **Event Approval** | HIGH | approve/reject buttons |
| **User Management** | MEDIUM | user actions |
| **City Management** | MEDIUM | add city modal |

---

## Test IDs ADDED But NOT YET USED

These test IDs were added but aren't being utilized by existing tests:

| Component | Test IDs Available | Not Used Because |
|-----------|-------------------|------------------|
| `Loading.tsx` | loading-spinner, loading-message | No UI test for loading states |
| `SearchBar.tsx` | search-clear-button | No test for search clear |
| `EventActions.tsx` | event-register-button, event-save-button | No test for registration flow |
| `RSVPButtons.tsx` | rsvp-*-button | No RSVP flow test |
| `LoginPrompt.tsx` | login-prompt-link | No unauthenticated user test |
| `Error.tsx` | error-retry-button | No error boundary test |
| `SuccessState.tsx` | success-*-* | No success flow tests |
| `Footer.tsx` | footer-links | No footer link tests |

---

## Recommended Priority Order

### Phase 1: HIGH PRIORITY (Core User Flows)

1. **Create Event Flow** (`/create-event`)
   - Add test IDs to all form fields
   - Test form submission
   - Test step navigation

2. **Submit Place Flow** (`/submit-place`)
   - Add test IDs to form fields
   - Test form submission

3. **Login/Signup Flow**
   - Test form submission with valid/invalid data
   - Test error messages display

4. **RSVP Flow**
   - Use existing `rsvp-*-button` IDs
   - Test going/interested/maybe selection

5. **Event Registration**
   - Use `event-register-button`
   - Test checkout flow

### Phase 2: MEDIUM PRIORITY

6. **Search Functionality**
   - Use `search-input`, `search-clear-button`
   - Test search results

7. **Save Events**
   - Use `event-save-button`
   - Test saved events page

8. **Profile Updates**
   - Add test IDs to profile form
   - Test update flow

### Phase 3: LOW PRIORITY

9. **Error/Loading States**
10. **Empty States**
11. **Admin Functionality**

---

## Action Items

1. **Add missing test IDs** to forms (create-event, submit-place)
2. **Create new E2E tests** for high priority flows
3. **Use existing test IDs** that aren't being tested
4. **Fix pre-existing API auth issues** (51 failures are auth-related)

---

## Test ID Pattern Reference

```typescript
// Card patterns
'event-card-{id}'
'place-card-{id}'
'activity-card-{id}'

// Button patterns  
'{component}-button'
'{action}-{target}-button'

// Form patterns
'{field}-input'
'form-{action}-button'

// Section patterns
'{section}-container'
'{section}-{element}'
```

---

Generated: 2024
Last Updated: Test ID audit complete
