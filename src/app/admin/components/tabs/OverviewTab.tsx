'use client';

import { AlertTriangle, Users, Ticket, MapPin, Star, TrendingUp } from 'lucide-react';

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

interface OverviewTabProps {
  stats: {
    overview?: {
      totalUsers?: number;
      totalEvents?: number;
      totalPlaces?: number;
      totalReviews?: number;
      pendingEvents?: number;
      pendingReports?: number;
      eventsThisMonth?: number;
      placesThisMonth?: number;
      recentSignups?: number;
    };
    recentActivity?: { events?: ActivityEvent[] };
  } | null;
}

export function OverviewTab({ stats }: OverviewTabProps) {
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
