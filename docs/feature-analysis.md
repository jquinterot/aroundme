# AroundMe - Feature Analysis & Roadmap

## Current State Inventory

### Pages (14)
| Page | Purpose | Status |
|------|---------|--------|
| `/` | Home/city selector | ✅ Basic |
| `/[city]` | Events listing with filters | ✅ Complete |
| `/[city]/places` | Places listing with filters | ✅ Complete |
| `/event/[id]` | Event detail page | ✅ Complete |
| `/place/[id]` | Place detail page | ✅ Complete |
| `/create-event` | Multi-step event creation | ✅ Complete |
| `/submit-place` | Place submission | ✅ Complete |
| `/login` | User login | ✅ Complete |
| `/signup` | User registration | ✅ Complete |
| `/dashboard` | User dashboard overview | ⚠️ Basic |
| `/dashboard/events` | User's created events | ⚠️ Basic |
| `/dashboard/places` | User's places | ⚠️ Basic |
| `/pricing` | Pricing page | ⚠️ Static |

### API Routes (20)
- Auth: login, register, logout, me
- Events: CRUD, analytics, feature, rsvp, save
- Places: CRUD, reviews
- Cities: listing
- Notifications: GET, PATCH
- Upload: image handling

### Database Models
City, User, Session, Event, Place, Review, Save, RSVP, Notification

---

## Implemented Features

### Core
- ✅ User authentication (session-based)
- ✅ Event creation with multi-step form
- ✅ Place submission
- ✅ Event/Place listing with filters (category, date, price, search)
- ✅ Map view with category markers
- ✅ Event detail with venue map
- ✅ Place detail with reviews display

### Engagement
- ✅ Save/favorite events
- ✅ RSVP to events (going, interested, maybe)
- ✅ Share buttons (WhatsApp, calendar)
- ✅ Notifications system (in-app)
- ✅ Event analytics (views, saves, RSVPs)
- ✅ Featured/promoted events

### UI/UX
- ✅ Lucide icons throughout
- ✅ Responsive design
- ✅ Category filters with icons
- ✅ List/Split/Map view modes
- ✅ Image upload with optimization
- ✅ Loading skeletons
- ✅ Form validation

---

## Missing Features & Gaps

### Authentication
| Feature | Priority | Effort |
|---------|----------|--------|
| Password reset | HIGH | Medium |
| Email verification | MEDIUM | Medium |
| User profile editing | HIGH | Low |
| Change password | MEDIUM | Low |
| Delete account | LOW | Low |

### User Dashboard
| Feature | Priority | Effort |
|---------|----------|--------|
| Edit profile | HIGH | Low |
| View saved events list | HIGH | Low |
| View RSVP'd events | HIGH | Low |
| Edit created events | HIGH | Medium |
| Edit created places | HIGH | Medium |
| Place claiming flow | MEDIUM | Medium |
| Notification settings | LOW | Low |

### Reviews & Ratings
| Feature | Priority | Effort |
|---------|----------|--------|
| Submit review form | **HIGH** | Low |
| Rate places (1-5 stars) | **HIGH** | Low |
| Edit own reviews | MEDIUM | Low |
| Delete own reviews | LOW | Low |
| Review helpfulness votes | LOW | Medium |

### Event Features
| Feature | Priority | Effort |
|---------|----------|--------|
| Edit event | HIGH | Medium |
| Cancel event | MEDIUM | Low |
| Duplicate event | MEDIUM | Low |
| Event calendar export | MEDIUM | Low |
| Email reminders | MEDIUM | High |
| Recurring events | LOW | High |

### Social Features (Under Consideration)
| Feature | Priority | Effort |
|---------|----------|--------|
| Follow organizers | LOW | Medium |
| Follow users | LOW | Medium |
| Event comments | LOW | High |
| Place comments | LOW | High |
| Activity feed | LOW | High |

### Admin Features
| Feature | Priority | Effort |
|---------|----------|--------|
| User management | MEDIUM | Medium |
| Event moderation | HIGH | Medium |
| Place verification | HIGH | Medium |
| Analytics dashboard | MEDIUM | Medium |
| Featured content control | MEDIUM | Low |
| City management | LOW | Medium |

### Business/Monetization
| Feature | Priority | Effort |
|---------|----------|--------|
| Stripe payments (ticket sales) | MEDIUM | High |
| Featured event payments | HIGH | Medium |
| Premium place badges | MEDIUM | Low |
| Promoted places | LOW | Medium |
| Sponsored listings | LOW | Medium |
| Email newsletter | LOW | High |

---

## Competitive Analysis

### Meetup.com
**Strengths to borrow:**
- Event recommendations based on interests
- Group/community creation
- Event series/recurring
- Attendee lists (public)

### Eventbrite
**Strengths to borrow:**
- Ticket types/tiers
- QR code check-in
- Event analytics for organizers
- Email marketing integration
- Waitlist functionality

### Foursquare/TripAdvisor
**Strengths to borrow:**
- Detailed place reviews with photos
- Tips/check-ins
- Popular times/live busy indicator
- Ranked lists ("Best of...")

### Google Maps
**Strengths to borrow:**
- Business hours with live status
- Quick actions (call, directions, website)
- Photo gallery
- Q&A section

---

## Analysis: Social Features (Reddit-style)

### Arguments AGAINST Social/Community Features:
1. **Scope creep** - Adds significant complexity
2. **Moderation burden** - Spam, abuse, legal liability
3. **Not core to value prop** - Users want to discover and attend events, not discuss
4. **Competitors don't rely on it** - Meetup failed with heavy social, Eventbrite succeeded without
5. **Distraction from primary flow** - Discovery → Decision → Action

### Arguments FOR Light Social:
1. **Trust signals** - Real user opinions help decision-making
2. **Engagement** - Users who interact stay longer
3. **Content generation** - User reviews replace need for manual content

### Recommendation: **NO heavy social/Reddit-style features**
- Focus on **reviews** (not discussions)
- Reviews are proven to help conversion
- No comment threads, no following, no activity feed
- Just: Rate → Review → Done

---

## Analysis: Revenue Opportunities

### Tier 1: Quick Wins (Implement First)
1. **Featured Events** - Already have the UI, needs payment integration
2. **Premium Place Badges** - "Verified" already exists, add "Promoted" tier
3. **Sponsored Search Results** - Category homepage sponsors

### Tier 2: Medium Effort
4. **Ticket Sales** - Stripe integration for paid events
5. **Service Fees** - Take % on ticket sales
6. **Premium Organizer Subscription** - Better analytics, promotional tools

### Tier 3: Future
7. **In-app advertising** - Banner ads for local businesses
8. **Data/insights sales** - Aggregate location data (privacy compliant)
9. **White-label** - License platform to tourism boards

---

## Recommended Priority Order

### Phase 1: Completeness (Week 1-2)
1. **Submit review form** - Users need to leave reviews
2. **User profile editing** - Basic account management
3. **Saved events list** - Dashboard improvement
4. **Edit event/place** - Users need to fix mistakes

### Phase 2: Engagement (Week 3-4)
5. **Email verification** - Reduces spam accounts
6. **Event edit/cancel** - Full event management
7. **Place edit/claim** - Business owner flow
8. **Password reset** - Essential feature

### Phase 3: Monetization (Week 5-6)
9. **Stripe integration** - Paid events
10. **Featured event payments** - Collect money for promotion
11. **Premium badges** - Paid place promotion

### Phase 4: Polish (Week 7+)
12. **Email reminders** - Event reminders
13. **Admin dashboard** - Content moderation
14. **Analytics for admin** - Platform insights

---

## What to Skip (For Now)

### Skip:
- ❌ User following/followers
- ❌ Activity feeds
- ❌ Comment threads
- ❌ Social sharing of profiles
- ❌ Real-time chat
- ❌ Video content
- ❌ User-generated lists/collections
- ❌ Email newsletters (until user base is larger)

### Focus:
- ✅ Discovery (search, filters, maps)
- ✅ Decision (reviews, ratings, details)
- ✅ Action (RSVP, tickets, directions)
- ✅ Monetization (featured content, tickets)

---

## Conclusion

**AroundMe** should remain a **discovery → action** platform, NOT a social network.

**Top 5 Immediate Priorities:**
1. Review submission form
2. User profile editing
3. Edit/Delete events & places
4. Saved events dashboard
5. Password reset

**Revenue Focus:**
- Featured events (simplest first)
- Ticket sales (biggest potential)
- Premium place badges

**Social: NO** - Reviews are sufficient for trust signals without the overhead of moderation and community management.
