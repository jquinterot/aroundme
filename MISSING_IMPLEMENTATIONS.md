# AroundMe - Missing Implementations

## Authentication

### Google OAuth
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` not in `.env`
- [ ] OAuth callback works but needs testing in production

### Password Reset Flow
- [ ] No `password_reset` email template
- [ ] No actual email sent (only `console.log` of reset URL)
- [ ] Reset tokens never expire (no `passwordResetExpiresAt` field)
- [ ] Security issue: token becomes the password until changed

### Email Verification
- [ ] No `verify_email` or `welcome` email template
- [ ] No verification endpoint (`/api/auth/verify-email`)
- [ ] New users not forced to verify email

### OAuth Security
- [ ] State parameter generated but not validated (CSRF potential)
- [ ] No refresh tokens (only 7-day session cookies)

---

## Payments / Stripe

- [ ] No refund handling (webhook for `charge.refunded`)
- [ ] No Stripe dashboard integration
- [ ] No transfer/payout webhooks (`transfer.created`, `payout.paid`)
- [ ] No automatic payout scheduling
- [ ] No dispute/chargeback handling
- [ ] Currency hardcoded to COP (should be configurable)

---

## Email (Resend)

- [ ] No password reset email template
- [ ] No email verification template  
- [ ] No `welcome` template for new signups
- [ ] `EmailLog.openedAt`/`clickedAt` never populated (no tracking)
- [ ] No unsubscribe handling
- [ ] Batch email sending not optimized (sends one by one)

---

## Push Notifications

- [ ] VAPID keys not configured (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` empty)
- [ ] No service worker implementation (can't receive push in browser)
- [ ] No notification permission UI
- [ ] No notification preferences UI (opt in/out by type)
- [ ] No notification center UI (in-app notification list)

---

## Activity Bookings

- [ ] `ActivityBooking` model exists but no Stripe integration
- [ ] Paid activities can't be booked (no checkout flow)

---

## Waitlist

- [ ] No automatic cart/checkout when spot opens
- [ ] Users manually notified but must re-book

---

## UI/UX Improvements

### Dark Mode (incomplete)
- [ ] `PlaceCard.tsx`
- [ ] `PlaceCardBadges.tsx`
- [ ] `Footer.tsx` background
- [ ] `SearchBar.tsx` dropdown
- [ ] Dashboard cards
- [ ] Event/Place detail pages
- [ ] Note info boxes

### Text Overflow
- [ ] Category buttons overflow on small screens
- [ ] Long titles in cards need truncation
- [ ] Place/event detail pages need max-width constraints

### Component Complexity
- [ ] `admin/page.tsx` (1041 lines) - split into sections
- [ ] `activity/[id]/page.tsx` (563 lines) - extract booking logic

---

## Security

- [ ] Rate limiting only on auth endpoints
- [ ] CSP headers use `'unsafe-eval'` and `'unsafe-inline'`
- [ ] Consider adding request size limits

---

## Environment Variables Needed

```bash
# OAuth (for Google/GitHub login)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Push Notifications
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""

# Stripe (for production)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```
