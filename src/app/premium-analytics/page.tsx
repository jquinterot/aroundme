'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { TIER_FEATURES, TIER_LIMITS } from '@/types';
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  Download, 
  Crown,
  Calendar,
  Eye,
  Heart,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Database,
  Mail,
  Shield,
  Loader2
} from 'lucide-react';

interface ExportData {
  attendees: Array<{ email: string; name: string; rsvpStatus: string; checkedIn: boolean; eventTitle: string }>;
  revenue: Array<{ eventTitle: string; ticketsSold: number; revenue: number; date: string }>;
  engagement: Array<{ eventTitle: string; views: number; saves: number; shares: number; comments: number }>;
}

export default function PremiumAnalyticsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [exporting, setExporting] = useState<'csv' | 'json' | null>(null);

  const generateExportData = (): ExportData => {
    return {
      attendees: [
        { email: ' attendee1@example.com', name: 'Ana García', rsvpStatus: 'confirmed', checkedIn: true, eventTitle: 'Concierto de Rock' },
        { email: ' attendee2@example.com', name: 'Carlos López', rsvpStatus: 'confirmed', checkedIn: true, eventTitle: 'Concierto de Rock' },
        { email: ' attendee3@example.com', name: 'María Rodríguez', rsvpStatus: 'interested', checkedIn: false, eventTitle: 'Concierto de Rock' },
        { email: ' attendee4@example.com', name: 'Juan Martínez', rsvpStatus: 'confirmed', checkedIn: false, eventTitle: 'Feria Gastronómica' },
        { email: ' attendee5@example.com', name: 'Laura Sánchez', rsvpStatus: 'confirmed', checkedIn: true, eventTitle: 'Feria Gastronómica' },
      ],
      revenue: [
        { eventTitle: 'Concierto de Rock', ticketsSold: 245, revenue: 12250000, date: '2024-03-15' },
        { eventTitle: 'Feria Gastronómica', ticketsSold: 180, revenue: 9000000, date: '2024-03-20' },
        { eventTitle: 'Workshop de Tecnología', ticketsSold: 45, revenue: 4500000, date: '2024-03-22' },
      ],
      engagement: [
        { eventTitle: 'Concierto de Rock', views: 45200, saves: 5620, shares: 1230, comments: 456 },
        { eventTitle: 'Feria Gastronómica', views: 32100, saves: 3980, shares: 890, comments: 234 },
        { eventTitle: 'Workshop de Tecnología', views: 18900, saves: 2100, shares: 420, comments: 123 },
      ],
    };
  };

  const exportToCSV = () => {
    setExporting('csv');
    setTimeout(() => {
      const data = generateExportData();
      
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

      const csvContent = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setExporting(null);
    }, 500);
  };

  const exportToJSON = () => {
    setExporting('json');
    setTimeout(() => {
      const data = generateExportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setExporting(null);
    }, 500);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const userTier = (user as { tier?: 'free' | 'basic' | 'premium' }).tier || 'free';
  const features = TIER_FEATURES[userTier];
  const limits = TIER_LIMITS[userTier];

  if (!features.advancedAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Unlock powerful business insights, competitor analysis, and export capabilities with Premium analytics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <BarChart3 className="w-6 h-6 text-indigo-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Analytics</h3>
                <p className="text-sm text-gray-500">Deep insights into your performance</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <Target className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Competitor Insights</h3>
                <p className="text-sm text-gray-500">See how you compare</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <Download className="w-6 h-6 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Data Export</h3>
                <p className="text-sm text-gray-500">Export CSV reports</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Premium
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Analytics</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Advanced insights for {userTier} members • {limits.analyticsRetentionDays} days data retention
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold">$12.4M</p>
                <p className="text-sm text-indigo-100">Total Revenue</p>
                <p className="text-xs text-green-300 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +23%
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">847</p>
                <p className="text-sm text-indigo-100">Tickets Sold</p>
                <p className="text-xs text-green-300 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +18%
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">$14.6K</p>
                <p className="text-sm text-indigo-100">Avg. Order</p>
                <p className="text-xs text-red-300 flex items-center gap-1 mt-1">
                  <ArrowDownRight className="w-3 h-3" /> -5%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Audience Growth</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold">24.8K</p>
                <p className="text-sm text-emerald-100">Total Followers</p>
                <p className="text-xs text-green-300 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +32%
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">68%</p>
                <p className="text-sm text-emerald-100">Retention Rate</p>
                <p className="text-xs text-green-300 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +8%
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">4.2</p>
                <p className="text-sm text-emerald-100">Engagement Score</p>
                <p className="text-xs text-green-300 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +12%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Page Performance</h3>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Views</span>
                <span className="font-semibold text-gray-900 dark:text-white">128.4K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Unique Visitors</span>
                <span className="font-semibold text-gray-900 dark:text-white">45.2K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg. Time on Page</span>
                <span className="font-semibold text-gray-900 dark:text-white">2m 34s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bounce Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">34%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Engagement Metrics</h3>
                <p className="text-sm text-gray-500">Conversion funnel</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Views → Saves</span>
                <span className="font-semibold text-gray-900 dark:text-white">12.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Saves → RSVPs</span>
                <span className="font-semibold text-gray-900 dark:text-white">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">RSVP → Check-in</span>
                <span className="font-semibold text-gray-900 dark:text-white">82%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Overall Conversion</span>
                <span className="font-semibold text-green-600">6.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Event Insights</h3>
                <p className="text-sm text-gray-500">Top performing categories</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Music Events</span>
                <span className="font-semibold text-gray-900 dark:text-white">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Food & Drink</span>
                <span className="font-semibold text-gray-900 dark:text-white">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tech & Business</span>
                <span className="font-semibold text-gray-900 dark:text-white">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sports</span>
                <span className="font-semibold text-gray-900 dark:text-white">12%</span>
              </div>
            </div>
          </div>
        </div>

        {features.competitorInsights && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Competitor Analysis</h3>
                <p className="text-sm text-gray-500">How you compare to similar organizers</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-3xl font-bold text-indigo-600">Top 15%</p>
                <p className="text-sm text-gray-500">Your Ranking</p>
                <p className="text-xs text-green-600 mt-1">+5 positions vs last month</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">2.4x</p>
                <p className="text-sm text-gray-500">Better Conversion</p>
                <p className="text-xs text-gray-400 mt-1">vs category average</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$42</p>
                <p className="text-sm text-gray-500">Avg Ticket Price</p>
                <p className="text-xs text-green-600 mt-1">+18% vs competitors</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">4.8★</p>
                <p className="text-sm text-gray-500">Your Rating</p>
                <p className="text-xs text-green-600 mt-1">vs 4.2★ avg in category</p>
              </div>
            </div>
          </div>
        )}

        {features.exportData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Export Data</h3>
                  <p className="text-sm text-gray-500">Download your analytics data</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {exporting === 'csv' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export CSV
                </button>
                <button
                  onClick={exportToJSON}
                  disabled={exporting !== null}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {exporting === 'json' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  Export JSON
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white mb-2">Attendee List</p>
                <p className="text-sm text-gray-500 mb-3">Email, name, RSVP status, check-in</p>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">Download →</button>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white mb-2">Revenue Report</p>
                <p className="text-sm text-gray-500 mb-3">Orders, tickets, revenue by event</p>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">Download →</button>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white mb-2">Engagement Report</p>
                <p className="text-sm text-gray-500 mb-3">Views, saves, shares, comments</p>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">Download →</button>
              </div>
            </div>
          </div>
        )}

        {features.emailAutomation && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Email Automation</h3>
                <p className="text-sm text-gray-500">{limits.emailTemplatesPerMonth === -1 ? 'Unlimited' : limits.emailTemplatesPerMonth} templates remaining</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-indigo-300 dark:border-indigo-700 cursor-pointer hover:border-indigo-500 transition-colors">
                <div className="text-center">
                  <p className="text-2xl mb-2">📧</p>
                  <p className="font-medium text-gray-900 dark:text-white">Event Reminder</p>
                  <p className="text-xs text-gray-500">Send 24h before event</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-indigo-300 dark:border-indigo-700 cursor-pointer hover:border-indigo-500 transition-colors">
                <div className="text-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="font-medium text-gray-900 dark:text-white">Thank You</p>
                  <p className="text-xs text-gray-500">Post-event follow up</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-indigo-300 dark:border-indigo-700 cursor-pointer hover:border-indigo-500 transition-colors">
                <div className="text-center">
                  <p className="text-2xl mb-2">⏰</p>
                  <p className="font-medium text-gray-900 dark:text-white">Urgency Alert</p>
                  <p className="text-xs text-gray-500">Low availability reminder</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-amber-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Your Premium Features</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {features.advancedAnalytics && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" /> Advanced Analytics
              </div>
            )}
            {features.exportData && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" /> Data Export
              </div>
            )}
            {features.competitorInsights && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" /> Competitor Insights
              </div>
            )}
            {features.emailAutomation && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" /> Email Automation
              </div>
            )}
            {features.prioritySupport && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" /> Priority Support
              </div>
            )}
            {features.apiAccess && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" /> API Access
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
