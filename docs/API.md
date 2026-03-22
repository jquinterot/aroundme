# AroundMe API Documentation

## Overview
AroundMe is a local events and places discovery platform. This document describes the API endpoints available for developers.

## Base URL
```
Production: https://api.aroundme.app
Development: http://localhost:3000
```

## Authentication
Most endpoints require authentication via session token. Include the session cookie in requests.

## Public Endpoints

### Cities

#### GET /api/cities
Get all active cities.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Bogotá",
      "country": "Colombia",
      "slug": "bogota",
      "lat": 4.7110,
      "lng": -74.0721,
      "timezone": "America/Bogota"
    }
  ]
}
```

### Events

#### GET /api/cities/:slug/events
Get events for a specific city.

**Query Parameters:**
- `category` - Filter by category
- `date` - Filter by date (today, week, month)
- `price` - Filter by price (free, paid)
- `search` - Search term
- `page` - Page number
- `limit` - Items per page

#### GET /api/events/:id
Get event details by ID.

### Places

#### GET /api/cities/:slug/places
Get places for a specific city.

#### GET /api/places/:id
Get place details by ID.

### Search

#### GET /api/search
Search across events and places.

**Query Parameters:**
- `q` - Search query (min 2 chars)
- `type` - Filter type (events, places, all)
- `city` - Filter by city ID

## Authenticated Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### POST /api/auth/login
Login user.

#### POST /api/auth/logout
Logout user.

### Profile

#### GET /api/profile
Get current user profile.

#### PATCH /api/profile
Update profile.

**Request:**
```json
{
  "name": "New Name",
  "bio": "User bio",
  "avatarUrl": "https://...",
  "website": "https://...",
  "instagram": "@username",
  "cityId": "city-id"
}
```

#### POST /api/profile/change-password
Change password.

### Events

#### POST /api/events
Create a new event.

#### POST /api/events/:id/save
Save an event.

#### DELETE /api/events/:id/save
Unsave an event.

#### POST /api/events/:id/rsvp
RSVP to an event.

**Request:**
```json
{
  "status": "going" | "interested" | "maybe"
}
```

#### POST /api/events/:id/feature
Feature an event (paid).

**Request:**
```json
{
  "tier": "basic" | "premium"
}
```

### Places

#### POST /api/places
Submit a new place.

#### POST /api/places/:id/claim
Claim ownership of a place.

#### GET/POST /api/places/:id/reviews
Get or create reviews for a place.

### User Data

#### GET /api/user/events
Get events created by the user.

#### GET /api/user/places
Get places claimed by the user.

#### GET /api/user/rsvps
Get user's RSVPs.

#### GET /api/user/saved-events
Get user's saved events.

#### GET /api/user/history
Get user's view history.

### Notifications

#### GET /api/notifications
Get user notifications.

#### PATCH /api/notifications
Mark notifications as read.

## Social Features

### Follow

#### POST /api/follow
Follow a user.

**Request:**
```json
{
  "followingId": "user-id"
}
```

#### DELETE /api/follow?userId=:id
Unfollow a user.

#### GET /api/follow?userId=:id&type=followers|following
Get followers or following list.

### Activity

#### GET /api/activity
Get activity feed.

**Query Parameters:**
- `following` - Only show activity from followed users
- `city` - Filter by city slug
- `page` - Page number
- `limit` - Items per page

### Users

#### GET /api/users/:id
Get user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "avatarUrl": "https://...",
    "bio": "User bio",
    "isVerified": true,
    "followerCount": 150,
    "followingCount": 50,
    "eventCount": 12,
    "events": [...],
    "isFollowing": false,
    "isOwnProfile": false
  }
}
```

## Event Series

### POST /api/series
Create a recurring event series.

**Request:**
```json
{
  "name": "Weekly Cooking Class",
  "description": "Learn to cook...",
  "frequency": "weekly",
  "interval": 1,
  "dayOfWeek": 3,
  "startDate": "2024-03-01",
  "endDate": "2024-06-01",
  "occurrences": 12,
  "templateEventId": "event-id"
}
```

### GET /api/series?id=:seriesId
Get series details.

### PATCH /api/series?id=:seriesId
Update series.

### DELETE /api/series?id=:seriesId
Delete series.

## Waitlist

### POST /api/waitlist
Join event waitlist.

**Request:**
```json
{
  "eventId": "event-id",
  "notifyAt": 1
}
```

### DELETE /api/waitlist?eventId=:eventId
Leave waitlist.

### GET /api/waitlist?eventId=:eventId
Get event waitlist.

## Check-in

### POST /api/checkin
Manual check-in.

**Request:**
```json
{
  "eventId": "event-id",
  "ticketTypeId": "ticket-type-id",
  "method": "manual" | "qr_code" | "api"
}
```

### GET /api/checkin?eventId=:eventId
Get event check-ins.

### POST /api/checkin/scan
Scan QR code for check-in.

**Request:**
```json
{
  "qrToken": "base64-encoded-token",
  "eventId": "event-id"
}
```

## Recommendations

### GET /api/recommendations
Get personalized recommendations.

**Query Parameters:**
- `city` - City slug
- `limit` - Number of recommendations

### POST /api/recommendations
Record recommendation interaction.

**Request:**
```json
{
  "eventId": "event-id",
  "action": "view" | "click"
}
```

## Admin Endpoints

### GET /api/admin/stats
Get platform statistics.

### GET /api/admin/events
List all events (with filters).

### PATCH /api/admin/events/:id
Update event (approve, reject, etc).

### GET /api/admin/places
List all places.

### PATCH /api/admin/places/:id
Update place (verify, etc).

### GET /api/admin/users
List all users.

### GET /api/admin/reports
Get content reports.

## Webhooks

### POST /api/stripe/webhook
Handle Stripe payment events.

**Events handled:**
- `checkout.session.completed` - Payment successful
- `checkout.session.expired` - Payment expired
- `payment_intent.payment_failed` - Payment failed

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| GET /api/search | 30/min |
| POST /api/events | 10/hour |
| POST /api/auth/login | 5/min |
| POST /api/checkin | 60/min |

## Error Responses

All errors return:
```json
{
  "success": false,
  "error": "Error message"
}
```

Common status codes:
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `429` - Rate limited
- `500` - Server error

## SDK Libraries

Coming soon:
- JavaScript/TypeScript SDK
- React hooks library
- Python SDK
- Go SDK
