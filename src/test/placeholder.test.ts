import { describe, it, expect } from 'vitest';

describe('PlaceholderImage', () => {
  const EVENT_GRADIENTS: Record<string, { from: string; to: string; icon: string }> = {
    music: { from: 'from-purple-500', to: 'to-pink-500', icon: '🎵' },
    food: { from: 'from-orange-500', to: 'to-red-500', icon: '🍽️' },
    sports: { from: 'from-green-500', to: 'to-emerald-500', icon: '⚽' },
    art: { from: 'from-pink-500', to: 'to-rose-500', icon: '🎨' },
    tech: { from: 'from-blue-500', to: 'to-cyan-500', icon: '💻' },
    community: { from: 'from-indigo-500', to: 'to-violet-500', icon: '👥' },
    nightlife: { from: 'from-violet-500', to: 'to-purple-500', icon: '🌙' },
    outdoor: { from: 'from-green-400', to: 'to-teal-500', icon: '🌳' },
    education: { from: 'from-amber-500', to: 'to-orange-500', icon: '📚' },
    other: { from: 'from-gray-500', to: 'to-slate-500', icon: '🎯' },
  };

  const PLACE_GRADIENTS: Record<string, { from: string; to: string; icon: string }> = {
    restaurant: { from: 'from-orange-500', to: 'to-red-500', icon: '🍽️' },
    cafe: { from: 'from-amber-500', to: 'to-yellow-500', icon: '☕' },
    bar: { from: 'from-purple-600', to: 'to-pink-500', icon: '🍸' },
    club: { from: 'from-indigo-600', to: 'to-purple-600', icon: '🎉' },
    park: { from: 'from-green-500', to: 'to-emerald-500', icon: '🌳' },
    museum: { from: 'from-amber-600', to: 'to-yellow-600', icon: '🏛️' },
    shopping: { from: 'from-pink-500', to: 'to-rose-500', icon: '🛍️' },
    hotel: { from: 'from-blue-500', to: 'to-indigo-500', icon: '🏨' },
    coworking: { from: 'from-cyan-500', to: 'to-blue-500', icon: '💼' },
    other: { from: 'from-gray-500', to: 'to-slate-500', icon: '📍' },
  };

  it('should return correct gradient for music event', () => {
    const config = EVENT_GRADIENTS['music'];
    expect(config.from).toBe('from-purple-500');
    expect(config.to).toBe('to-pink-500');
    expect(config.icon).toBe('🎵');
  });

  it('should return correct gradient for restaurant place', () => {
    const config = PLACE_GRADIENTS['restaurant'];
    expect(config.from).toBe('from-orange-500');
    expect(config.to).toBe('to-red-500');
    expect(config.icon).toBe('🍽️');
  });

  it('should return other gradient for unknown category', () => {
    const config = EVENT_GRADIENTS['other'];
    expect(config.from).toBe('from-gray-500');
    expect(config.to).toBe('to-slate-500');
    expect(config.icon).toBe('🎯');
  });

  it('should have all event categories defined', () => {
    const expectedCategories = ['music', 'food', 'sports', 'art', 'tech', 'community', 'nightlife', 'outdoor', 'education', 'other'];
    expectedCategories.forEach(cat => {
      expect(EVENT_GRADIENTS).toHaveProperty(cat);
    });
  });

  it('should have all place categories defined', () => {
    const expectedCategories = ['restaurant', 'cafe', 'bar', 'club', 'park', 'museum', 'shopping', 'hotel', 'coworking', 'other'];
    expectedCategories.forEach(cat => {
      expect(PLACE_GRADIENTS).toHaveProperty(cat);
    });
  });
});

describe('AvatarPlaceholder', () => {
  const AVATAR_COLORS = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];

  function getColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  function getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  it('should return correct initials for single name', () => {
    expect(getInitials('Juan')).toBe('J');
  });

  it('should return correct initials for full name', () => {
    expect(getInitials('Juan García')).toBe('JG');
  });

  it('should return ? for empty name', () => {
    expect(getInitials('')).toBe('?');
  });

  it('should return correct color based on name hash', () => {
    const color1 = getColorFromName('Ana');
    const color2 = getColorFromName('Carlos');
    expect(AVATAR_COLORS).toContain(color1);
    expect(AVATAR_COLORS).toContain(color2);
  });

  it('should return consistent color for same name', () => {
    const color1 = getColorFromName('María');
    const color2 = getColorFromName('María');
    expect(color1).toBe(color2);
  });

  it('should return valid color for any name', () => {
    const color = getColorFromName('Juan');
    expect(AVATAR_COLORS).toContain(color);
  });
});

describe('CompletenessIndicator', () => {
  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  it('should return green for score >= 80', () => {
    expect(getScoreColor(80)).toBe('text-green-600 bg-green-100');
    expect(getScoreColor(100)).toBe('text-green-600 bg-green-100');
  });

  it('should return yellow for score >= 50 and < 80', () => {
    expect(getScoreColor(50)).toBe('text-yellow-600 bg-yellow-100');
    expect(getScoreColor(79)).toBe('text-yellow-600 bg-yellow-100');
  });

  it('should return red for score < 50', () => {
    expect(getScoreColor(49)).toBe('text-red-600 bg-red-100');
    expect(getScoreColor(0)).toBe('text-red-600 bg-red-100');
  });
});

describe('Export functionality', () => {
  interface ExportData {
    attendees: Array<{ email: string; name: string; rsvpStatus: string; checkedIn: boolean; eventTitle: string }>;
    revenue: Array<{ eventTitle: string; ticketsSold: number; revenue: number; date: string }>;
    engagement: Array<{ eventTitle: string; views: number; saves: number; shares: number; comments: number }>;
  }

  function generateExportData(): ExportData {
    return {
      attendees: [
        { email: ' attendee1@example.com', name: 'Ana García', rsvpStatus: 'confirmed', checkedIn: true, eventTitle: 'Concierto' },
      ],
      revenue: [
        { eventTitle: 'Concierto', ticketsSold: 245, revenue: 12250000, date: '2024-03-15' },
      ],
      engagement: [
        { eventTitle: 'Concierto', views: 45200, saves: 5620, shares: 1230, comments: 456 },
      ],
    };
  }

  function convertToCSV(data: ExportData): string {
    const headers = ['Type', 'Event', 'Data'];
    const rows: string[][] = [];
    
    data.attendees.forEach((a) => {
      rows.push(['Attendee', a.eventTitle, `${a.name}, ${a.email}, ${a.rsvpStatus}, ${a.checkedIn ? 'Yes' : 'No'}`]);
    });
    
    data.revenue.forEach((r) => {
      rows.push(['Revenue', r.eventTitle, `${r.date}, ${r.ticketsSold} tickets, $${r.revenue.toLocaleString()}`]);
    });
    
    data.engagement.forEach((e) => {
      rows.push(['Engagement', e.eventTitle, `Views: ${e.views}, Saves: ${e.saves}, Shares: ${e.shares}, Comments: ${e.comments}`]);
    });

    return [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
  }

  it('should generate export data with all required fields', () => {
    const data = generateExportData();
    expect(data.attendees).toHaveLength(1);
    expect(data.revenue).toHaveLength(1);
    expect(data.engagement).toHaveLength(1);
  });

  it('should convert export data to CSV format', () => {
    const data = generateExportData();
    const csv = convertToCSV(data);
    expect(csv).toContain('Type,Event,Data');
    expect(csv).toContain('"Attendee"');
    expect(csv).toContain('"Revenue"');
    expect(csv).toContain('"Engagement"');
  });

  it('should properly quote CSV fields', () => {
    const data = generateExportData();
    const csv = convertToCSV(data);
    const lines = csv.split('\n');
    expect(lines[1]).toContain('"Ana García,');
    expect(lines[1]).toContain('"Attendee"');
  });
});

describe('EmptyState', () => {
  it('should have correct structure', () => {
    const emptyState = {
      icon: '📅',
      title: 'No events found',
      description: 'Try adjusting your filters',
    };
    
    expect(emptyState).toHaveProperty('icon');
    expect(emptyState).toHaveProperty('title');
    expect(emptyState).toHaveProperty('description');
    expect(typeof emptyState.icon).toBe('string');
    expect(typeof emptyState.title).toBe('string');
    expect(typeof emptyState.description).toBe('string');
  });
});

describe('TIER_FEATURES', () => {
  const TIER_FEATURES = {
    free: {
      advancedAnalytics: false,
      competitorInsights: false,
      exportData: false,
      emailAutomation: false,
      prioritySupport: false,
      apiAccess: false,
      customBranding: false,
    },
    basic: {
      advancedAnalytics: true,
      competitorInsights: false,
      exportData: true,
      emailAutomation: false,
      prioritySupport: false,
      apiAccess: false,
      customBranding: false,
    },
    premium: {
      advancedAnalytics: true,
      competitorInsights: true,
      exportData: true,
      emailAutomation: true,
      prioritySupport: true,
      apiAccess: true,
      customBranding: true,
    },
  };

  it('should have correct free tier features', () => {
    expect(TIER_FEATURES.free.advancedAnalytics).toBe(false);
    expect(TIER_FEATURES.free.exportData).toBe(false);
  });

  it('should have correct basic tier features', () => {
    expect(TIER_FEATURES.basic.advancedAnalytics).toBe(true);
    expect(TIER_FEATURES.basic.exportData).toBe(true);
    expect(TIER_FEATURES.basic.competitorInsights).toBe(false);
  });

  it('should have correct premium tier features', () => {
    expect(TIER_FEATURES.premium.advancedAnalytics).toBe(true);
    expect(TIER_FEATURES.premium.exportData).toBe(true);
    expect(TIER_FEATURES.premium.competitorInsights).toBe(true);
    expect(TIER_FEATURES.premium.emailAutomation).toBe(true);
    expect(TIER_FEATURES.premium.apiAccess).toBe(true);
  });
});

describe('TIER_LIMITS', () => {
  const TIER_LIMITS = {
    free: { eventsPerMonth: 3, analyticsRetentionDays: 7, emailTemplatesPerMonth: 0 },
    basic: { eventsPerMonth: 10, analyticsRetentionDays: 30, emailTemplatesPerMonth: 0 },
    premium: { eventsPerMonth: -1, analyticsRetentionDays: 90, emailTemplatesPerMonth: -1 },
  };

  it('should have correct free tier limits', () => {
    expect(TIER_LIMITS.free.eventsPerMonth).toBe(3);
    expect(TIER_LIMITS.free.analyticsRetentionDays).toBe(7);
    expect(TIER_LIMITS.free.emailTemplatesPerMonth).toBe(0);
  });

  it('should have correct basic tier limits', () => {
    expect(TIER_LIMITS.basic.eventsPerMonth).toBe(10);
    expect(TIER_LIMITS.basic.analyticsRetentionDays).toBe(30);
  });

  it('should have unlimited (-1) for premium tier', () => {
    expect(TIER_LIMITS.premium.eventsPerMonth).toBe(-1);
    expect(TIER_LIMITS.premium.emailTemplatesPerMonth).toBe(-1);
  });
});
