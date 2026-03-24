'use client';

import { EventCategory, PlaceCategory } from '@/types';

interface PlaceholderImageProps {
  type: 'event' | 'place' | 'activity';
  category?: EventCategory | PlaceCategory | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

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

const ACTIVITY_GRADIENTS: Record<string, { from: string; to: string; icon: string }> = {
  class: { from: 'from-violet-500', to: 'to-purple-500', icon: '🎯' },
  tour: { from: 'from-teal-500', to: 'to-cyan-500', icon: '🗺️' },
  experience: { from: 'from-pink-500', to: 'to-rose-500', icon: '✨' },
  entertainment: { from: 'from-amber-500', to: 'to-orange-500', icon: '🎭' },
  wellness: { from: 'from-green-400', to: 'to-emerald-500', icon: '🧘' },
  other: { from: 'from-gray-500', to: 'to-slate-500', icon: '🌟' },
};

const SIZE_CLASSES = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-24 h-24 text-2xl',
  lg: 'w-32 h-32 text-3xl',
  xl: 'w-48 h-48 text-4xl',
};

export function PlaceholderImage({ type, category = 'other', size = 'md', className = '' }: PlaceholderImageProps) {
  let gradients = EVENT_GRADIENTS;
  
  if (type === 'place') {
    gradients = PLACE_GRADIENTS;
  } else if (type === 'activity') {
    gradients = ACTIVITY_GRADIENTS;
  }
  
  const config = gradients[category] || gradients.other;
  
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${config.from} ${config.to} rounded-xl ${SIZE_CLASSES[size]} ${className}`}
    >
      <span className="text-4xl">{config.icon}</span>
    </div>
  );
}

interface AvatarPlaceholderProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AVATAR_SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
};

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

export function AvatarPlaceholder({ name = '', size = 'md', className = '' }: AvatarPlaceholderProps) {
  const initials = getInitials(name);
  const color = getColorFromName(name);
  
  return (
    <div
      className={`${color} ${AVATAR_SIZE_CLASSES[size]} rounded-full flex items-center justify-center text-white font-medium ${className}`}
    >
      {initials}
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CompletenessIndicatorProps {
  score: number;
  items: Array<{ label: string; complete: boolean }>;
  className?: string;
}

export function CompletenessIndicator({ score, items, className = '' }: CompletenessIndicatorProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getScoreColor()}`}>
          {score}%
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Profile Completeness</p>
          <p className="text-sm text-gray-500">Complete all items for better visibility</p>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.complete ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {item.complete ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              )}
            </div>
            <span className={`text-sm ${item.complete ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
