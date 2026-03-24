'use client';

import { TrendingUp, Users, Eye, Heart, CheckCircle, Clock, Percent, BarChart3 } from 'lucide-react';

interface AnalyticsPanelProps {
  analytics: {
    viewCount: number;
    saveCount: number;
    rsvpCount: {
      going: number;
      interested: number;
      maybe: number;
      total: number;
    };
    performance?: {
      attendanceRate: number;
      viewsToRsvpRate: number;
      conversionRate: number;
      avgViewsPerRsvp: number;
    };
    overview?: {
      checkInCount: number;
      waitlistCount: number;
    };
    status?: {
      isUpcoming: boolean;
      isPast: boolean;
      daysUntilEvent: number;
    };
    comparison?: {
      similarEventsInCity: number;
      percentile: number;
    };
    recentAttendees?: Array<{
      id: string;
      name: string;
      avatarUrl: string | null;
    }>;
    checkInCount?: number;
    waitlistCount?: number;
  };
  showAnalytics: boolean;
  onToggle: () => void;
}

export function AnalyticsPanel({ analytics, showAnalytics, onToggle }: AnalyticsPanelProps) {
  return (
    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
      >
        <BarChart3 className="w-5 h-5" />
        Event Analytics
        <svg className={`w-4 h-4 ml-auto transition-transform ${showAnalytics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showAnalytics && (
        <div className="mt-4 space-y-4">
          {analytics.status?.isUpcoming && analytics.status?.daysUntilEvent !== undefined && (
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Event starts in {analytics.status.daysUntilEvent} day{analytics.status.daysUntilEvent !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-500">Track attendance as the date approaches</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 mb-1">
                <Eye className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.viewCount}</p>
              <p className="text-xs text-gray-500">Views</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-pink-600 dark:text-pink-400 mb-1">
                <Heart className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.saveCount}</p>
              <p className="text-xs text-gray-500">Saves</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 mb-1">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.rsvpCount.going}</p>
              <p className="text-xs text-gray-500">Going</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 mb-1">
                <Percent className="w-4 h-4" />
              </div>
<p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.performance?.attendanceRate || 0}%
                </p>
              <p className="text-xs text-gray-500">Attendance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{analytics.rsvpCount.total}</p>
              <p className="text-xs text-gray-500">Total RSVPs</p>
            </div>
            {(analytics.overview?.checkInCount !== undefined || analytics.checkInCount !== undefined) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 mb-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{analytics.overview?.checkInCount ?? analytics.checkInCount}</p>
                <p className="text-xs text-gray-500">Check-ins</p>
              </div>
            )}
            {analytics.waitlistCount !== undefined && analytics.waitlistCount > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{analytics.waitlistCount}</p>
                <p className="text-xs text-gray-500">Waitlist</p>
              </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {analytics.performance?.conversionRate || 0}%
              </p>
              <p className="text-xs text-gray-500">View→RSVP</p>
            </div>
          </div>

          {analytics.comparison?.similarEventsInCity !== undefined && (
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">City Comparison</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Similar {analytics.rsvpCount.total > 0 ? 'events have avg' : 'events in your city'}
                </span>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {analytics.comparison.similarEventsInCity} event{analytics.comparison.similarEventsInCity !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {analytics.recentAttendees && analytics.recentAttendees.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Recent Attendees</p>
              <div className="flex flex-wrap gap-2">
                {analytics.recentAttendees.slice(0, 5).map((attendee) => (
                  <div 
                    key={attendee.id} 
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-medium text-indigo-700">
                      {attendee.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{attendee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
