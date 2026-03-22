'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout';
import { 
  Users, Ticket, MapPin, Star, AlertTriangle, 
  CheckCircle, XCircle, Clock, TrendingUp, 
  Eye, Shield, ChevronRight,
  BarChart3, Settings, Globe
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  status: string;
  city?: { name: string; slug: string };
  user?: { id: string; name: string; email: string };
  _count?: { saves: number; rsvps: number };
}

interface Place {
  id: string;
  name: string;
  city?: { name: string; slug: string };
  owner?: { id: string; name: string; email: string };
  isVerified: boolean;
  rating: number;
  _count?: { reviews: number };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  _count?: { events: number; reviews: number; saves: number };
}

interface Report {
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      return res.json();
    },
    enabled: !!user?.role && user.role === 'admin',
  });

  const stats = statsData?.data;

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Ticket, badge: stats?.overview?.pendingEvents },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'cities', label: 'Cities', icon: Globe },
    { id: 'activities', label: 'Activities', icon: Star },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: AlertTriangle, badge: stats?.overview?.pendingReports },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">Admin</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Manage content, users, and platform settings</p>
        </div>

        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{tab.label}</span>
                    {tab.badge ? (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} />
            )}
            {activeTab === 'events' && <EventsTab />}
            {activeTab === 'places' && <PlacesTab />}
            {activeTab === 'cities' && <CitiesTab />}
            {activeTab === 'activities' && <ActivitiesTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'reports' && <ReportsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}

interface Alert {
  type: string;
  message: string;
}

interface ActivityEvent {
  id: string;
  title: string;
  status: string;
  city?: { name: string };
}

function OverviewTab({ stats }: { stats: { overview?: { totalUsers?: number; totalEvents?: number; totalPlaces?: number; totalReviews?: number; pendingEvents?: number; pendingReports?: number; eventsThisMonth?: number; placesThisMonth?: number; recentSignups?: number }; recentActivity?: { events?: ActivityEvent[] } } | null }) {
  const overviewItems = [
    { label: 'Total Users', value: stats?.overview?.totalUsers || 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Events', value: stats?.overview?.totalEvents || 0, icon: Ticket, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Total Places', value: stats?.overview?.totalPlaces || 0, icon: MapPin, color: 'bg-teal-100 text-teal-600' },
    { label: 'Total Reviews', value: stats?.overview?.totalReviews || 0, icon: Star, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const alerts: Alert[] = [];
  if (stats?.overview?.pendingEvents && stats.overview.pendingEvents > 0) {
    alerts.push({ type: 'warning', message: `${stats.overview.pendingEvents} events pending approval` });
  }
  if (stats?.overview?.pendingReports && stats.overview.pendingReports > 0) {
    alerts.push({ type: 'danger', message: `${stats.overview.pendingReports} reports need attention` });
  }

  return (
    <div className="space-y-6">
      {alerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">Attention Needed</h3>
          </div>
          <ul className="space-y-1">
            {alerts.map((alert, i) => (
              <li key={i} className="text-sm text-amber-700 dark:text-amber-300">{alert.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
              <p className="text-gray-500">{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Latest Events</h4>
              {stats?.recentActivity?.events?.slice(0, 3).map((event: ActivityEvent) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.city?.name} • {event.status}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'approved' ? 'bg-green-100 text-green-700' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Events</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.overview?.eventsThisMonth || 0}</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Places</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.overview?.placesThisMonth || 0}</p>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Users</p>
                  <p className="text-sm text-gray-500">Today</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.overview?.recentSignups || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsTab() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);

  const { data: eventsData, isLoading: loading } = useQuery({
    queryKey: ['admin-events', statusFilter, page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/events?status=${statusFilter}&page=${page}`);
      return res.json();
    },
  });

  const events = eventsData?.data || [];
  const pagination = eventsData?.pagination;

  const handleAction = async (id: string, action: string, extra?: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statuses = ['pending', 'approved', 'rejected', 'cancelled', 'all'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Events</h2>
        <div className="flex gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No events found</div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Creator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stats</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {events.map((event: Event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.city?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white">{event.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{event.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'approved' ? 'bg-green-100 text-green-700' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        event.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">Saves: {event._count?.saves || 0}</p>
                      <p className="text-sm text-gray-500">RSVPs: {event._count?.rsvps || 0}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/event/${event.id}`}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {event.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(event.id, 'approve')}
                              className="p-2 text-green-600 hover:text-green-700"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason (optional):');
                                handleAction(event.id, 'reject', { reason });
                              }}
                              className="p-2 text-red-600 hover:text-red-700"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= pagination.pages}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PlacesTab() {
  const queryClient = useQueryClient();

  const { data: placesData, isLoading: loading } = useQuery({
    queryKey: ['admin-places'],
    queryFn: async () => {
      const res = await fetch('/api/admin/places');
      return res.json();
    },
  });

  const places = placesData?.data || [];

  const handleAction = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/admin/places/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-places'] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Places</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : places.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No places found</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Place</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rating</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {places.map((place: Place) => (
                  <tr key={place.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{place.name}</p>
                    <p className="text-sm text-gray-500">{place.city?.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-white">{place.owner?.name || 'Unclaimed'}</p>
                  </td>
                  <td className="px-6 py-4">
                    {place.isVerified ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" /> Verified
                      </span>
                    ) : (
                      <span className="text-gray-400">Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{place.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-gray-400">({place._count?.reviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/place/${place.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {!place.isVerified && (
                        <button
                          onClick={() => handleAction(place.id, 'verify')}
                          className="p-2 text-green-600 hover:text-green-700"
                          title="Verify"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const queryClient = useQueryClient();

  const { data: usersData, isLoading: loading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users');
      return res.json();
    },
  });

  const users = usersData?.data || [];

  const handleAction = async (id: string, action: string, value?: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...value }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No users found</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Activity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user: User) => (
                  <tr key={user.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500">Events: {user._count?.events || 0}</p>
                    <p className="text-sm text-gray-500">Reviews: {user._count?.reviews || 0}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleAction(user.id, 'changeRole', { role: 'moderator' })}
                          className="p-2 text-blue-600 hover:text-blue-700"
                          title="Make Moderator"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      )}
                      {user.role === 'moderator' && (
                        <button
                          onClick={() => handleAction(user.id, 'changeRole', { role: 'user' })}
                          className="p-2 text-gray-600 hover:text-gray-700"
                          title="Remove Moderator"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReportsTab() {
  const queryClient = useQueryClient();

  const { data: reportsData, isLoading: loading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const res = await fetch('/api/admin/reports');
      return res.json();
    },
  });

  const reports = reportsData?.data || [];

  const handleAction = async (id: string, action: string) => {
    const adminNote = action !== 'dismiss' ? prompt('Add a note (optional):') : null;
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reports</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No reports found</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report: Report) => (
            <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    report.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {report.status}
                  </span>
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    {report.type}
                  </span>
                  <h3 className="mt-2 font-medium text-gray-900 dark:text-white">{report.reason}</h3>
                  {report.itemTitle && (
                    <p className="text-sm text-gray-500">Item: {report.itemTitle}</p>
                  )}
                  {report.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(report.id, 'resolve')}
                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleAction(report.id, 'dismiss')}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Platform Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              App URL
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              placeholder="https://yourapp.com"
              defaultValue={process.env.NEXT_PUBLIC_APP_URL}
              disabled
            />
            <p className="mt-1 text-sm text-gray-500">Set via environment variable NEXT_PUBLIC_APP_URL</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stripe Mode
            </label>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-sm rounded-full ${
                process.env.NODE_ENV === 'production' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {process.env.NODE_ENV === 'production' ? 'Live' : 'Test'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Push Notifications
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                VAPID Keys Configured
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">These actions are irreversible. Proceed with caution.</p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          disabled
        >
          Clear All Caches (Coming Soon)
        </button>
      </div>
    </div>
  );
}

interface City {
  id: string;
  name: string;
  country: string;
  slug: string;
  lat: number;
  lng: number;
  isActive: boolean;
  _count?: { events: number; places: number };
}

function CitiesTab() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', country: '', slug: '', lat: '', lng: '' });

  const { data: citiesData, isLoading } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: async () => {
      const res = await fetch('/api/cities');
      return res.json();
    },
  });

  const cities = citiesData?.data || [];

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCity,
          lat: parseFloat(newCity.lat),
          lng: parseFloat(newCity.lng),
        }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
        setShowAddModal(false);
        setNewCity({ name: '', country: '', slug: '', lat: '', lng: '' });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cities</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add City
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New City</h3>
            <form onSubmit={handleAddCity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City Name</label>
                <input
                  type="text"
                  required
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Salento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={newCity.country}
                  onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Colombia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={newCity.slug}
                  onChange={(e) => setNewCity({ ...newCity, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="salento"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newCity.lat}
                    onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="4.6372"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newCity.lng}
                    onChange={(e) => setNewCity({ ...newCity, lng: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="-75.5676"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add City
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : cities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No cities found</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Coordinates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {cities.map((city: City) => (
                <tr key={city.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{city.name}</p>
                    <p className="text-sm text-gray-500">{city.country}</p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{city.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500">{city.lat.toFixed(4)}, {city.lng.toFixed(4)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500">Events: {city._count?.events || 0}</p>
                    <p className="text-sm text-gray-500">Places: {city._count?.places || 0}</p>
                  </td>
                  <td className="px-6 py-4">
                    {city.isActive ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ActivitiesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activities</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Activities feature allows providers to offer recurring classes, tours, and experiences.
        </p>
        <p className="text-sm text-gray-400">
          Coming soon - Create activities at /create-activity
        </p>
      </div>
    </div>
  );
}
