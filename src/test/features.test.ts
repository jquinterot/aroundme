import { describe, it, expect } from 'vitest';

describe('Countdown calculation', () => {
  const calculateTimeLeft = (dateStart: string): { days: number; hours: number; minutes: number; seconds: number; total: number } => {
    const difference = new Date(dateStart).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  };

  it('should return zero for past dates', () => {
    const pastDate = new Date(Date.now() - 1000).toISOString();
    const result = calculateTimeLeft(pastDate);
    expect(result.total).toBe(0);
    expect(result.days).toBe(0);
  });

  it('should calculate future dates correctly', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const result = calculateTimeLeft(futureDate);
    expect(result.days).toBe(1);
    expect(result.total).toBeGreaterThan(0);
  });

  it('should handle hours correctly', () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const result = calculateTimeLeft(futureDate);
    expect(result.hours).toBeGreaterThanOrEqual(1);
  });
});

describe('Search query validation', () => {
  const validateSearch = (query: string) => {
    if (!query || query.length < 2) {
      return { valid: false, error: 'Query must be at least 2 characters' };
    }
    return { valid: true };
  };

  it('should accept queries with 2+ characters', () => {
    const result = validateSearch('te');
    expect(result.valid).toBe(true);
  });

  it('should reject empty queries', () => {
    const result = validateSearch('');
    expect(result.valid).toBe(false);
  });

  it('should reject single character queries', () => {
    const result = validateSearch('a');
    expect(result.valid).toBe(false);
  });
});

describe('Theme preferences', () => {
  const getPreferredTheme = (stored: string | null, systemDark: boolean) => {
    if (stored === 'dark') return 'dark';
    if (stored === 'light') return 'light';
    return systemDark ? 'dark' : 'light';
  };

  it('should return stored dark theme', () => {
    expect(getPreferredTheme('dark', false)).toBe('dark');
  });

  it('should return stored light theme', () => {
    expect(getPreferredTheme('light', true)).toBe('light');
  });

  it('should use system preference when no stored preference', () => {
    expect(getPreferredTheme(null, true)).toBe('dark');
    expect(getPreferredTheme(null, false)).toBe('light');
  });
});

describe('Review validation', () => {
  const validateReview = (rating: number, comment: string) => {
    if (!rating || rating < 1 || rating > 5) {
      return { valid: false, error: 'Rating must be between 1 and 5' };
    }
    return { valid: true };
  };

  it('should accept valid rating of 1', () => {
    const result = validateReview(1, 'Good place');
    expect(result.valid).toBe(true);
  });

  it('should accept valid rating of 5', () => {
    const result = validateReview(5, 'Excellent!');
    expect(result.valid).toBe(true);
  });

  it('should reject rating below 1', () => {
    const result = validateReview(0, 'Bad');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Rating must be between 1 and 5');
  });

  it('should reject rating above 5', () => {
    const result = validateReview(6, 'Too good');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Rating must be between 1 and 5');
  });

  it('should accept empty comment', () => {
    const result = validateReview(4, '');
    expect(result.valid).toBe(true);
  });

  it('should accept long comments', () => {
    const longComment = 'A'.repeat(1000);
    const result = validateReview(5, longComment);
    expect(result.valid).toBe(true);
  });
});

describe('Password validation', () => {
  const validatePasswordChange = (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    storedPasswordHash: string
  ) => {
    if (!currentPassword) {
      return { valid: false, error: 'Current password is required' };
    }
    if (!newPassword) {
      return { valid: false, error: 'New password is required' };
    }
    if (newPassword.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters' };
    }
    if (newPassword !== confirmPassword) {
      return { valid: false, error: 'Passwords do not match' };
    }
    if (currentPassword === newPassword) {
      return { valid: false, error: 'New password must be different' };
    }
    return { valid: true };
  };

  it('should accept valid password change', () => {
    const result = validatePasswordChange('oldPass123', 'newPass456', 'newPass456', 'hash');
    expect(result.valid).toBe(true);
  });

  it('should reject empty current password', () => {
    const result = validatePasswordChange('', 'newPass456', 'newPass456', 'hash');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Current password is required');
  });

  it('should reject empty new password', () => {
    const result = validatePasswordChange('oldPass123', '', '', 'hash');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('New password is required');
  });

  it('should reject password shorter than 6 characters', () => {
    const result = validatePasswordChange('oldPass123', '12345', '12345', 'hash');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Password must be at least 6 characters');
  });

  it('should reject non-matching passwords', () => {
    const result = validatePasswordChange('oldPass123', 'newPass456', 'differentPass', 'hash');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Passwords do not match');
  });

  it('should reject same old and new password', () => {
    const result = validatePasswordChange('samePass123', 'samePass123', 'samePass123', 'hash');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('New password must be different');
  });
});

describe('Event status transitions', () => {
  const VALID_STATUSES = ['pending', 'approved', 'cancelled', 'rejected'];
  
  const validateStatusChange = (newStatus: string) => {
    if (!VALID_STATUSES.includes(newStatus)) {
      return { valid: false, error: 'Invalid status' };
    }
    return { valid: true };
  };

  it('should accept pending status', () => {
    const result = validateStatusChange('pending');
    expect(result.valid).toBe(true);
  });

  it('should accept approved status', () => {
    const result = validateStatusChange('approved');
    expect(result.valid).toBe(true);
  });

  it('should accept cancelled status', () => {
    const result = validateStatusChange('cancelled');
    expect(result.valid).toBe(true);
  });

  it('should accept rejected status', () => {
    const result = validateStatusChange('rejected');
    expect(result.valid).toBe(true);
  });

  it('should reject invalid status', () => {
    const result = validateStatusChange('invalid');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid status');
  });

  it('should reject empty status', () => {
    const result = validateStatusChange('');
    expect(result.valid).toBe(false);
  });
});

describe('Place claiming logic', () => {
  interface Place {
    id: string;
    ownerId: string | null;
    isClaimed: boolean;
  }

  const canClaimPlace = (place: Place) => {
    if (place.isClaimed && place.ownerId) {
      return { canClaim: false, error: 'This place is already claimed' };
    }
    return { canClaim: true };
  };

  const canUnclaimPlace = (place: Place, userId: string) => {
    if (!place.ownerId) {
      return { canUnclaim: false, error: 'Place has no owner' };
    }
    if (place.ownerId !== userId) {
      return { canUnclaim: false, error: 'Forbidden' };
    }
    return { canUnclaim: true };
  };

  it('should allow claiming unclaimed place', () => {
    const place = { id: '1', ownerId: null, isClaimed: false };
    const result = canClaimPlace(place);
    expect(result.canClaim).toBe(true);
  });

  it('should prevent claiming already claimed place', () => {
    const place = { id: '1', ownerId: 'user-123', isClaimed: true };
    const result = canClaimPlace(place);
    expect(result.canClaim).toBe(false);
    expect(result.error).toBe('This place is already claimed');
  });

  it('should allow owner to unclaim their place', () => {
    const place = { id: '1', ownerId: 'user-123', isClaimed: true };
    const result = canUnclaimPlace(place, 'user-123');
    expect(result.canUnclaim).toBe(true);
  });

  it('should prevent non-owner from unclaiming', () => {
    const place = { id: '1', ownerId: 'user-123', isClaimed: true };
    const result = canUnclaimPlace(place, 'different-user');
    expect(result.canUnclaim).toBe(false);
    expect(result.error).toBe('Forbidden');
  });

  it('should prevent unclaiming unclaimed place', () => {
    const place = { id: '1', ownerId: null, isClaimed: false };
    const result = canUnclaimPlace(place, 'any-user');
    expect(result.canUnclaim).toBe(false);
    expect(result.error).toBe('Place has no owner');
  });
});

describe('Review aggregation', () => {
  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  it('should calculate average of multiple reviews', () => {
    const reviews = [
      { rating: 5 },
      { rating: 4 },
      { rating: 3 },
    ];
    expect(calculateAverageRating(reviews)).toBe(4);
  });

  it('should return 0 for empty reviews', () => {
    expect(calculateAverageRating([])).toBe(0);
  });

  it('should handle single review', () => {
    const reviews = [{ rating: 5 }];
    expect(calculateAverageRating(reviews)).toBe(5);
  });

  it('should round to one decimal place', () => {
    const reviews = [
      { rating: 5 },
      { rating: 4 },
      { rating: 4 },
    ];
    expect(calculateAverageRating(reviews)).toBe(4.3);
  });
});

describe('Email validation', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string) => {
    if (!email) {
      return { valid: false, error: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }
    return { valid: true };
  };

  it('should accept valid email', () => {
    const result = validateEmail('user@example.com');
    expect(result.valid).toBe(true);
  });

  it('should accept email with subdomain', () => {
    const result = validateEmail('user@mail.example.com');
    expect(result.valid).toBe(true);
  });

  it('should reject email without @', () => {
    const result = validateEmail('userexample.com');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid email format');
  });

  it('should reject email without domain', () => {
    const result = validateEmail('user@');
    expect(result.valid).toBe(false);
  });

  it('should reject empty email', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email is required');
  });

  it('should reject email with spaces', () => {
    const result = validateEmail('user @example.com');
    expect(result.valid).toBe(false);
  });
});

describe('Event duplication', () => {
  interface Event {
    id: string;
    title: string;
    description: string;
    category: string;
    cityId: string;
    venueName: string;
    dateStart: Date;
    isFree: boolean;
    userId: string;
  }

  const duplicateEvent = (event: Event, newUserId: string) => {
    return {
      title: `Copy of ${event.title}`,
      description: event.description,
      category: event.category,
      status: 'pending',
      cityId: event.cityId,
      venueName: event.venueName,
      dateStart: event.dateStart,
      isFree: event.isFree,
      userId: newUserId,
    };
  };

  it('should create copy with modified title', () => {
    const original = {
      id: '1',
      title: 'Original Event',
      description: 'Description',
      category: 'music',
      cityId: 'bogota',
      venueName: 'Venue',
      dateStart: new Date(),
      isFree: true,
      userId: 'user-1',
    };
    const copy = duplicateEvent(original, 'user-2');
    expect(copy.title).toBe('Copy of Original Event');
  });

  it('should set status to pending on copy', () => {
    const original = {
      id: '1',
      title: 'Event',
      description: 'Desc',
      category: 'music',
      cityId: 'bogota',
      venueName: 'Venue',
      dateStart: new Date(),
      isFree: false,
      userId: 'user-1',
    };
    const copy = duplicateEvent(original, 'user-2');
    expect(copy.status).toBe('pending');
  });

  it('should preserve other fields on copy', () => {
    const original = {
      id: '1',
      title: 'Event',
      description: 'Description',
      category: 'food',
      cityId: 'medellin',
      venueName: 'Restaurant',
      dateStart: new Date('2026-04-01'),
      isFree: false,
      userId: 'user-1',
    };
    const copy = duplicateEvent(original, 'user-2');
    expect(copy.description).toBe(original.description);
    expect(copy.category).toBe(original.category);
    expect(copy.cityId).toBe(original.cityId);
    expect(copy.venueName).toBe(original.venueName);
  });

  it('should assign new userId on copy', () => {
    const original = {
      id: '1',
      title: 'Event',
      description: 'Desc',
      category: 'music',
      cityId: 'bogota',
      venueName: 'Venue',
      dateStart: new Date(),
      isFree: true,
      userId: 'user-1',
    };
    const copy = duplicateEvent(original, 'user-2');
    expect(copy.userId).toBe('user-2');
    expect(copy.userId).not.toBe(original.userId);
  });
});

describe('RSVP status handling', () => {
  const VALID_RSVP_STATUSES = ['going', 'interested', 'maybe'];

  const updateRsvp = (
    existingRsvps: { userId: string; status: string }[],
    userId: string,
    newStatus: string
  ) => {
    if (!VALID_RSVP_STATUSES.includes(newStatus)) {
      return { error: 'Invalid RSVP status' };
    }
    
    const existingIndex = existingRsvps.findIndex(r => r.userId === userId);
    
    if (existingIndex >= 0) {
      existingRsvps[existingIndex].status = newStatus;
      return { rsvps: existingRsvps };
    }
    
    return {
      rsvps: [...existingRsvps, { userId, status: newStatus }]
    };
  };

  it('should add new RSVP', () => {
    const rsvps: { userId: string; status: string }[] = [];
    const result = updateRsvp(rsvps, 'user-1', 'going');
    expect(result.rsvps).toHaveLength(1);
    expect(result.rsvps?.[0].status).toBe('going');
  });

  it('should update existing RSVP', () => {
    const rsvps = [{ userId: 'user-1', status: 'interested' }];
    const result = updateRsvp(rsvps, 'user-1', 'going');
    expect(result.rsvps).toHaveLength(1);
    expect(result.rsvps?.[0].status).toBe('going');
  });

  it('should reject invalid RSVP status', () => {
    const rsvps: { userId: string; status: string }[] = [];
    const result = updateRsvp(rsvps, 'user-1', 'invalid');
    expect(result.error).toBe('Invalid RSVP status');
  });

  it('should count RSVPs by status', () => {
    const rsvps = [
      { userId: '1', status: 'going' },
      { userId: '2', status: 'going' },
      { userId: '3', status: 'interested' },
      { userId: '4', status: 'maybe' },
    ];
    
    const counts = {
      going: rsvps.filter(r => r.status === 'going').length,
      interested: rsvps.filter(r => r.status === 'interested').length,
      maybe: rsvps.filter(r => r.status === 'maybe').length,
      total: rsvps.length,
    };
    
    expect(counts.going).toBe(2);
    expect(counts.interested).toBe(1);
    expect(counts.maybe).toBe(1);
    expect(counts.total).toBe(4);
  });
});

describe('Event analytics tracking', () => {
  const createAnalytics = (event: {
    viewCount: number;
    saveCount: number;
    rsvps: { status: string }[];
  }) => {
    return {
      viewCount: event.viewCount,
      saveCount: event.saveCount,
      rsvpCount: {
        going: event.rsvps.filter(r => r.status === 'going').length,
        interested: event.rsvps.filter(r => r.status === 'interested').length,
        maybe: event.rsvps.filter(r => r.status === 'maybe').length,
        total: event.rsvps.length,
      },
    };
  };

  it('should track view count', () => {
    const event = {
      viewCount: 100,
      saveCount: 25,
      rsvps: [],
    };
    const analytics = createAnalytics(event);
    expect(analytics.viewCount).toBe(100);
  });

  it('should track save count', () => {
    const event = {
      viewCount: 100,
      saveCount: 25,
      rsvps: [],
    };
    const analytics = createAnalytics(event);
    expect(analytics.saveCount).toBe(25);
  });

  it('should calculate RSVP counts correctly', () => {
    const event = {
      viewCount: 0,
      saveCount: 0,
      rsvps: [
        { status: 'going' },
        { status: 'going' },
        { status: 'interested' },
      ],
    };
    const analytics = createAnalytics(event);
    expect(analytics.rsvpCount.going).toBe(2);
    expect(analytics.rsvpCount.interested).toBe(1);
    expect(analytics.rsvpCount.total).toBe(3);
  });

  it('should handle empty RSVPs', () => {
    const event = {
      viewCount: 10,
      saveCount: 5,
      rsvps: [],
    };
    const analytics = createAnalytics(event);
    expect(analytics.rsvpCount.total).toBe(0);
    expect(analytics.rsvpCount.going).toBe(0);
  });
});
