'use client';

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
  };
  showAnalytics: boolean;
  onToggle: () => void;
}

export function AnalyticsPanel({ analytics, showAnalytics, onToggle }: AnalyticsPanelProps) {
  return (
    <div className="mt-6 bg-indigo-50 rounded-lg p-4">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-indigo-600 font-medium"
      >
        <span>📊</span>
        Event Analytics
        <svg className={`w-4 h-4 ml-auto transition-transform ${showAnalytics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showAnalytics && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-indigo-600">{analytics.viewCount}</p>
            <p className="text-xs text-gray-500">Views</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-pink-600">{analytics.saveCount}</p>
            <p className="text-xs text-gray-500">Saves</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{analytics.rsvpCount.going}</p>
            <p className="text-xs text-gray-500">Going</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-600">{analytics.rsvpCount.total}</p>
            <p className="text-xs text-gray-500">Total RSVPs</p>
          </div>
        </div>
      )}
    </div>
  );
}
