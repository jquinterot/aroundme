'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout';
import { 
  Users, Ticket, MapPin, Star, AlertTriangle, 
  Shield, ChevronRight,
  BarChart3, Settings, Globe
} from 'lucide-react';
import {
  OverviewTab,
  EventsTab,
  PlacesTab,
  CitiesTab,
  ActivitiesTab,
  UsersTab,
  ReportsTab,
  SettingsTab,
} from './components/tabs';

type TabId = 'overview' | 'events' | 'places' | 'cities' | 'activities' | 'users' | 'reports' | 'settings';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof BarChart3;
  badge?: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

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

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Ticket, badge: stats?.overview?.pendingEvents },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'cities', label: 'Cities', icon: Globe },
    { id: 'activities', label: 'Activities', icon: Star },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: AlertTriangle, badge: stats?.overview?.pendingReports },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} />;
      case 'events':
        return <EventsTab />;
      case 'places':
        return <PlacesTab />;
      case 'cities':
        return <CitiesTab />;
      case 'activities':
        return <ActivitiesTab />;
      case 'users':
        return <UsersTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="admin-page-container">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-indigo-600" data-testid="admin-breadcrumb-dashboard">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white" data-testid="admin-breadcrumb-current">Admin</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2" data-testid="admin-title">
            <Shield className="w-8 h-8 text-indigo-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-500">Manage content, users, and platform settings</p>
        </div>

        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4" data-testid="admin-nav">
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
            {renderTab()}
          </div>
        </div>
      </main>
    </div>
  );
}
