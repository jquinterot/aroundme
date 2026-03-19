'use client';

import { useRouter } from 'next/navigation';
import { ShareButtons } from '@/components/ui/ShareButtons';

interface EventActionsProps {
  isSaved: boolean;
  isAuthenticated: boolean;
  onSave: () => void;
  event: {
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

  return (
    <div className="mt-8 flex gap-4">
      <button className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
        Register / Get Tickets
      </button>
      <button 
        onClick={() => {
          if (!isAuthenticated) {
            router.push('/login');
            return;
          }
          onSave();
        }}
        className={`px-4 py-3 border rounded-xl transition-colors ${
          isSaved
            ? 'border-pink-300 bg-pink-50 text-pink-600'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <svg className={`w-5 h-5 ${isSaved ? 'fill-pink-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <ShareButtons event={event} url={eventUrl} showWhatsApp showCalendar />
    </div>
  );
}

interface RSVPButtonsProps {
  userRsvp: { status: string } | null;
  onRsvp: (status: string) => void;
}

export function RSVPButtons({ userRsvp, onRsvp }: RSVPButtonsProps) {
  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4">
      <p className="text-sm font-medium text-gray-700 mb-3">Are you going?</p>
      <div className="flex gap-2">
        {['going', 'interested', 'maybe'].map((status) => (
          <button
            key={status}
            onClick={() => onRsvp(status)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              userRsvp?.status === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
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
    <div className="mt-6 bg-blue-50 rounded-lg p-4 text-center">
      <p className="text-sm text-blue-700">
        <a href={href} className="font-medium underline">Login</a> to save events and RSVP
      </p>
    </div>
  );
}
