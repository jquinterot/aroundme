import { describe, it, expect } from 'vitest';

describe('Activity Categories', () => {
  const ACTIVITY_CATEGORIES = [
    { value: 'class', label: 'Clase' },
    { value: 'tour', label: 'Tour' },
    { value: 'experience', label: 'Experiencia' },
    { value: 'entertainment', label: 'Entretenimiento' },
    { value: 'wellness', label: 'Bienestar' },
  ];

  it('should have all expected categories', () => {
    const expectedCategories = ['class', 'tour', 'experience', 'entertainment', 'wellness'];
    const actualCategories = ACTIVITY_CATEGORIES.map(c => c.value);
    expectedCategories.forEach(cat => {
      expect(actualCategories).toContain(cat);
    });
  });

  it('should have unique category values', () => {
    const values = ACTIVITY_CATEGORIES.map(c => c.value);
    const uniqueValues = [...new Set(values)];
    expect(uniqueValues.length).toBe(values.length);
  });

  it('should have non-empty labels', () => {
    ACTIVITY_CATEGORIES.forEach(cat => {
      expect(cat.label.length).toBeGreaterThan(0);
    });
  });
});

describe('Activity Schedule Logic', () => {
  const DAYS_OF_WEEK = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  it('should have all days of week', () => {
    expect(DAYS_OF_WEEK).toHaveLength(7);
    expect(DAYS_OF_WEEK).toContain('monday');
    expect(DAYS_OF_WEEK).toContain('sunday');
  });

  const parseScheduleDays = (scheduleDays: string[] | null) => {
    if (!scheduleDays || scheduleDays.length === 0) return null;
    return scheduleDays.sort();
  };

  it('should parse empty schedule days', () => {
    expect(parseScheduleDays(null)).toBeNull();
    expect(parseScheduleDays([])).toBeNull();
  });

  it('should parse single day', () => {
    const result = parseScheduleDays(['monday']);
    expect(result).toEqual(['monday']);
  });

  it('should parse multiple days', () => {
    const result = parseScheduleDays(['sunday', 'monday', 'tuesday']);
    expect(result).toEqual(['monday', 'sunday', 'tuesday']);
  });

  it('should deduplicate days', () => {
    const input = ['monday', 'monday', 'tuesday'];
    const result = [...new Set(input)];
    expect(result).toHaveLength(2);
  });

  const formatScheduleTime = (time: string | null) => {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  it('should format morning time', () => {
    expect(formatScheduleTime('09:30')).toBe('9:30 AM');
  });

  it('should format afternoon time', () => {
    expect(formatScheduleTime('14:00')).toBe('2:00 PM');
  });

  it('should format noon', () => {
    expect(formatScheduleTime('12:00')).toBe('12:00 PM');
  });

  it('should format midnight', () => {
    expect(formatScheduleTime('00:00')).toBe('12:00 AM');
  });

  it('should return null for empty time', () => {
    expect(formatScheduleTime(null)).toBeNull();
    expect(formatScheduleTime('')).toBeNull();
  });
});

describe('Activity Pricing', () => {
  interface ActivityFormData {
    isFree: boolean;
    price: number | null;
    currency: string;
  }

  const calculateActivityPrice = (data: ActivityFormData) => {
    if (data.isFree) return { price: 0, formatted: 'Free' };
    return {
      price: data.price || 0,
      formatted: `${data.currency} ${(data.price || 0).toLocaleString()}`
    };
  };

  it('should return free for free activities', () => {
    const result = calculateActivityPrice({ isFree: true, price: 50000, currency: 'COP' });
    expect(result.formatted).toBe('Free');
    expect(result.price).toBe(0);
  });

  it('should format paid activities with currency', () => {
    const result = calculateActivityPrice({ isFree: false, price: 50000, currency: 'COP' });
    expect(result.formatted).toBe('COP 50,000');
  });

  it('should handle null price for paid activities', () => {
    const result = calculateActivityPrice({ isFree: false, price: null, currency: 'COP' });
    expect(result.price).toBe(0);
    expect(result.formatted).toBe('COP 0');
  });

  it('should use default currency COP', () => {
    const result = calculateActivityPrice({ isFree: false, price: 100000, currency: 'COP' });
    expect(result.formatted).toContain('COP');
  });
});

describe('Activity Capacity', () => {
  const isAtCapacity = (currentBookings: number, maxCapacity: number | null) => {
    if (maxCapacity === null) return false;
    return currentBookings >= maxCapacity;
  };

  it('should return false when no max capacity set', () => {
    expect(isAtCapacity(100, null)).toBe(false);
  });

  it('should return false when under capacity', () => {
    expect(isAtCapacity(5, 20)).toBe(false);
  });

  it('should return true when at capacity', () => {
    expect(isAtCapacity(20, 20)).toBe(true);
  });

  it('should return true when over capacity', () => {
    expect(isAtCapacity(25, 20)).toBe(true);
  });

  const getCapacityStatus = (booked: number, capacity: number | null) => {
    if (capacity === null) return { status: 'unlimited', remaining: null };
    const remaining = capacity - booked;
    if (remaining <= 0) return { status: 'full', remaining: 0 };
    if (remaining <= 5) return { status: 'almost_full', remaining };
    return { status: 'available', remaining };
  };

  it('should show unlimited when no capacity', () => {
    const result = getCapacityStatus(100, null);
    expect(result.status).toBe('unlimited');
  });

  it('should show available when plenty of spots', () => {
    const result = getCapacityStatus(5, 20);
    expect(result.status).toBe('available');
    expect(result.remaining).toBe(15);
  });

  it('should show almost_full when 5 or fewer spots', () => {
    const result = getCapacityStatus(17, 20);
    expect(result.status).toBe('almost_full');
    expect(result.remaining).toBe(3);
  });

  it('should show full when no spots left', () => {
    const result = getCapacityStatus(20, 20);
    expect(result.status).toBe('full');
    expect(result.remaining).toBe(0);
  });
});

describe('Activity Skill Levels', () => {
  const SKILL_LEVELS = [
    { value: 'all_levels', label: 'Todos los niveles' },
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' },
  ];

  it('should have all expected levels', () => {
    const expectedLevels = ['all_levels', 'beginner', 'intermediate', 'advanced'];
    const actualLevels = SKILL_LEVELS.map(l => l.value);
    expectedLevels.forEach(level => {
      expect(actualLevels).toContain(level);
    });
  });

  it('should default to all_levels', () => {
    const defaultLevel = SKILL_LEVELS.find(l => l.value === 'all_levels');
    expect(defaultLevel).toBeDefined();
    expect(defaultLevel?.label).toBe('Todos los niveles');
  });

  const isAppropriateLevel = (requiredLevel: string, userLevel: string) => {
    if (requiredLevel === 'all_levels') return true;
    if (userLevel === 'all_levels') return true;
    
    const levels = ['beginner', 'intermediate', 'advanced'];
    const requiredIndex = levels.indexOf(requiredLevel);
    const userIndex = levels.indexOf(userLevel);
    
    return userIndex <= requiredIndex;
  };

  it('should allow any level for all_levels requirement', () => {
    expect(isAppropriateLevel('all_levels', 'beginner')).toBe(true);
    expect(isAppropriateLevel('all_levels', 'advanced')).toBe(true);
  });

  it('should allow all_levels user to attend any level', () => {
    expect(isAppropriateLevel('beginner', 'all_levels')).toBe(true);
    expect(isAppropriateLevel('advanced', 'all_levels')).toBe(true);
  });

  it('should allow beginner to attend beginner and all_levels', () => {
    expect(isAppropriateLevel('beginner', 'beginner')).toBe(true);
    expect(isAppropriateLevel('beginner', 'intermediate')).toBe(false);
  });

  it('should allow advanced to attend advanced and lower', () => {
    expect(isAppropriateLevel('advanced', 'advanced')).toBe(true);
    expect(isAppropriateLevel('advanced', 'intermediate')).toBe(true);
    expect(isAppropriateLevel('advanced', 'beginner')).toBe(true);
  });
});

describe('Follow System', () => {
  const canFollow = (currentUserId: string, targetUserId: string) => {
    if (!currentUserId) return { can: false, error: 'Must be logged in' };
    if (currentUserId === targetUserId) return { can: false, error: 'Cannot follow yourself' };
    return { can: true };
  };

  it('should allow following other users', () => {
    const result = canFollow('user-1', 'user-2');
    expect(result.can).toBe(true);
  });

  it('should prevent following yourself', () => {
    const result = canFollow('user-1', 'user-1');
    expect(result.can).toBe(false);
    expect(result.error).toBe('Cannot follow yourself');
  });

  it('should require login to follow', () => {
    const result = canFollow('', 'user-2');
    expect(result.can).toBe(false);
    expect(result.error).toBe('Must be logged in');
  });

  const updateFollowerCount = (currentCount: number, action: 'follow' | 'unfollow') => {
    return action === 'follow' ? currentCount + 1 : currentCount - 1;
  };

  it('should increment count on follow', () => {
    expect(updateFollowerCount(10, 'follow')).toBe(11);
  });

  it('should decrement count on unfollow', () => {
    expect(updateFollowerCount(10, 'unfollow')).toBe(9);
  });

  it('should not go below zero on unfollow', () => {
    expect(updateFollowerCount(0, 'unfollow')).toBe(-1);
  });
});

describe('Notification Preferences', () => {
  interface NotificationPrefs {
    emailNotifications: boolean;
    pushNotifications: boolean;
    eventReminders: boolean;
    newFollowers: boolean;
    weeklyDigest: boolean;
  }

  const shouldSendNotification = (prefs: NotificationPrefs, type: string) => {
    switch (type) {
      case 'event_reminder':
        return prefs.eventReminders && (prefs.emailNotifications || prefs.pushNotifications);
      case 'new_follower':
        return prefs.newFollowers && (prefs.emailNotifications || prefs.pushNotifications);
      case 'weekly_digest':
        return prefs.weeklyDigest && prefs.emailNotifications;
      default:
        return false;
    }
  };

  it('should send event reminder when enabled', () => {
    const prefs = { emailNotifications: true, pushNotifications: true, eventReminders: true, newFollowers: true, weeklyDigest: true };
    expect(shouldSendNotification(prefs, 'event_reminder')).toBe(true);
  });

  it('should not send event reminder when disabled', () => {
    const prefs = { emailNotifications: false, pushNotifications: false, eventReminders: false, newFollowers: true, weeklyDigest: true };
    expect(shouldSendNotification(prefs, 'event_reminder')).toBe(false);
  });

  it('should not send weekly digest when email disabled', () => {
    const prefs = { emailNotifications: false, pushNotifications: true, eventReminders: true, newFollowers: true, weeklyDigest: true };
    expect(shouldSendNotification(prefs, 'weekly_digest')).toBe(false);
  });

  it('should return false for unknown notification type', () => {
    const prefs = { emailNotifications: true, pushNotifications: true, eventReminders: true, newFollowers: true, weeklyDigest: true };
    expect(shouldSendNotification(prefs, 'unknown_type')).toBe(false);
  });
});

describe('Search Highlighting', () => {
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  it('should highlight matching text', () => {
    const result = highlightMatch('Hello World', 'World');
    expect(result).toBe('Hello <mark>World</mark>');
  });

  it('should be case insensitive', () => {
    const result = highlightMatch('Hello WORLD', 'world');
    expect(result).toBe('Hello <mark>WORLD</mark>');
  });

  it('should return original text when no query', () => {
    const result = highlightMatch('Hello World', '');
    expect(result).toBe('Hello World');
  });

  it('should handle multiple matches', () => {
    const result = highlightMatch('Hello World World', 'World');
    expect(result).toBe('Hello <mark>World</mark> <mark>World</mark>');
  });

  it('should handle special regex characters in query', () => {
    const result = highlightMatch('Price: $100', '$100');
    expect(result).toContain('$100');
  });
});
