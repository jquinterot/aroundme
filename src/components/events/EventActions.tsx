'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { trackEventSave, trackEventRsvp, trackEventShare } from '@/lib/analytics';

interface EventActionsProps {
  isSaved: boolean;
  isAuthenticated: boolean;
  onSave: () => void;
  event: {
    id: string;
    title: string;
    description?: string;
    date: {
      start: string;
      end?: string;
    };
    venue?: {
      name?: string;
      address?: string;
    };
  };
  eventUrl: string;
}

export function EventActions({ isSaved, isAuthenticated, onSave, event, eventUrl }: EventActionsProps) {
  const router = useRouter();

  const handleSave = useCallback(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    trackEventSave(event.id);
    onSave();
  }, [isAuthenticated, router, event.id, onSave]);

  const handleShare = useCallback((target: string) => {
    trackEventShare(event.id, target);
  }, [event.id]);

  return (
    <div className="mt-8 flex gap-4" data-testid="event-actions">
      <button 
        onClick={() => router.push(`/checkout?event_id=${event.id}`)}
        className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        data-testid="event-register-button"
      >
        Register / Get Tickets
      </button>
      <button 
        onClick={handleSave}
        className={`px-4 py-3 border rounded-xl transition-colors ${
          isSaved
            ? 'border-pink-300 bg-pink-50 text-pink-600'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
        data-testid="event-save-button"
      >
        <svg className={`w-5 h-5 ${isSaved ? 'fill-pink-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <ShareButtons event={event} url={eventUrl} showWhatsApp showCalendar onShare={handleShare} />
    </div>
  );
}

interface RSVPButtonsProps {
  userRsvp: { status: string } | null;
  onRsvp: (status: string) => void;
  eventId: string;
}

export function RSVPButtons({ userRsvp, onRsvp, eventId }: RSVPButtonsProps) {
  const handleRsvp = useCallback((status: string) => {
    trackEventRsvp(eventId, status as 'going' | 'interested' | 'maybe');
    onRsvp(status);
  }, [eventId, onRsvp]);

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4" data-testid="rsvp-buttons">
      <p className="text-sm font-medium text-gray-700 mb-3">Are you going?</p>
      <div className="flex gap-2">
        {['going', 'interested', 'maybe'].map((status) => (
          <button
            key={status}
            onClick={() => handleRsvp(status)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              userRsvp?.status === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            data-testid={`rsvp-${status}-button`}
          >
            {status === 'going' && '✓ '}
            {status === 'interested' && '⭐ '}
            {status === 'maybe' && '? '}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

interface LoginPromptProps {
  href?: string;
}

export function LoginPrompt({ href = '/login' }: LoginPromptProps) {
  return (
    <div className="mt-6 bg-blue-50 rounded-lg p-4 text-center" data-testid="login-prompt">
      <p className="text-sm text-blue-700">
        <a href={href} className="font-medium underline" data-testid="login-prompt-link">Login</a> to save events and RSVP
      </p>
    </div>
  );
}
