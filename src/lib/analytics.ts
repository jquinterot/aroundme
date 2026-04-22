/**
 * Analytics tracking utility for AroundMe
 * 
 * Use this to track user interactions like clicks, saves, RSVPs, shares.
 */

type ItemType = 'event' | 'place' | 'activity';
type ClickSource = 'listing' | 'detail' | 'search' | 'recommendation' | 'share' | 'dashboard';
type InterestAction = 'save' | 'unsave' | 'rsvp_interested' | 'rsvp_going' | 'rsvp_maybe' | 'share' | 'view';

interface TrackClickOptions {
  type: ItemType;
  itemId: string;
  source: ClickSource;
  metadata?: Record<string, unknown>;
}

interface TrackInterestOptions {
  type: ItemType;
  itemId: string;
  action: InterestAction;
  metadata?: Record<string, unknown>;
}

/**
 * Track a click event (e.g., clicking on a card, viewing details)
 */
export async function trackClick({ type, itemId, source, metadata }: TrackClickOptions): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, itemId, source, metadata }),
    });
  } catch (error) {
    // Silently fail - analytics should not block user actions
    console.debug('Analytics tracking failed:', error);
  }
}

/**
 * Track an interest event (e.g., saving, RSVPing, sharing)
 */
export async function trackInterest({ type, itemId, action, metadata }: TrackInterestOptions): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, itemId, action, metadata }),
    });
  } catch (error) {
    // Silently fail - analytics should not block user actions
    console.debug('Analytics tracking failed:', error);
  }
}

/**
 * Track event card click
 */
export function trackEventClick(eventId: string, source: ClickSource, metadata?: Record<string, unknown>): void {
  trackClick({ type: 'event', itemId: eventId, source, metadata });
}

/**
 * Track place card click
 */
export function trackPlaceClick(placeId: string, source: ClickSource, metadata?: Record<string, unknown>): void {
  trackClick({ type: 'place', itemId: placeId, source, metadata });
}

/**
 * Track activity card click
 */
export function trackActivityClick(activityId: string, source: ClickSource, metadata?: Record<string, unknown>): void {
  trackClick({ type: 'activity', itemId: activityId, source, metadata });
}

/**
 * Track event save
 */
export function trackEventSave(eventId: string): void {
  trackInterest({ type: 'event', itemId: eventId, action: 'save' });
}

/**
 * Track event RSVP
 */
export function trackEventRsvp(eventId: string, status: 'going' | 'interested' | 'maybe'): void {
  const action = `rsvp_${status}` as InterestAction;
  trackInterest({ type: 'event', itemId: eventId, action, metadata: { rsvpStatus: status } });
}

/**
 * Track event share
 */
export function trackEventShare(eventId: string, target: string): void {
  trackInterest({ type: 'event', itemId: eventId, action: 'share', metadata: { shareTarget: target } });
}

/**
 * Track place save
 */
export function trackPlaceSave(placeId: string): void {
  trackInterest({ type: 'place', itemId: placeId, action: 'save' });
}

/**
 * Track activity booking
 */
export function trackActivityBooking(activityId: string, tickets: number): void {
  trackInterest({ 
    type: 'activity', 
    itemId: activityId, 
    action: 'save', 
    metadata: { tickets } 
  });
}
