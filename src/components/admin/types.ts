export interface AdminEvent {
  id: string;
  title: string;
  status: string;
  city?: { name: string; slug: string };
  user?: { id: string; name: string; email: string };
  _count?: { saves: number; rsvps: number };
}

export interface AdminPlace {
  id: string;
  name: string;
  city?: { name: string; slug: string };
  owner?: { id: string; name: string; email: string };
  isVerified: boolean;
  rating: number;
  _count?: { reviews: number };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  _count?: { events: number; reviews: number; saves: number };
}

export interface AdminReport {
  id: string;
  type: string;
  itemId: string;
  reason: string;
  description?: string;
  status: string;
  reporterId?: string;
  createdAt: string;
  itemTitle?: string;
}

export interface AdminStats {
  overview: {
    totalUsers: number;
    totalEvents: number;
    totalPlaces: number;
    pendingEvents: number;
    pendingReports: number;
    totalRSVPs: number;
    totalSaves: number;
  };
  events: {
    byStatus: Array<{ status: string; count: number }>;
    byCategory: Array<{ category: string; count: number }>;
    recent: AdminEvent[];
  };
  places: {
    byCategory: Array<{ category: string; count: number }>;
    recent: AdminPlace[];
  };
  users: {
    byRole: Array<{ role: string; count: number }>;
    recent: AdminUser[];
  };
  reports: {
    byStatus: Array<{ status: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
    recent: AdminReport[];
  };
}
