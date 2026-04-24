'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Check, User, Star } from 'lucide-react';
import { AvatarPlaceholder } from '@/components/ui/Placeholder';

export interface ActivityCardProps {
  activity: {
    id: string;
    type: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string | null;
      isVerified?: boolean;
    };
    event?: {
      id: string;
      title: string;
      imageUrl?: string | null;
      dateStart: string;
      venueName: string;
      city?: { name: string };
    };
    metadata?: Record<string, unknown>;
  };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'created_event':
        return Calendar;
      case 'rsvp':
        return Check;
      case 'follow':
        return User;
      case 'review':
        return Star;
      default:
        return MapPin;
    }
  };

  const getActivityText = () => {
    switch (activity.type) {
      case 'created_event':
        return 'creó un evento';
      case 'rsvp':
        return 'confirmó asistencia a';
      case 'follow':
        return 'comenzó a seguir a';
      case 'review':
        return 'calificó';
      default:
        return 'interactuó con';
    }
  };

  const renderIcon = () => {
    const ActivityIcon = getActivityIcon();
    return <ActivityIcon className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          {activity.user.avatarUrl ? (
            <Image
              src={activity.user.avatarUrl}
              alt={activity.user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <AvatarPlaceholder name={activity.user.name} size="md" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-gray-900 dark:text-gray-100">
            <Link href={`/profile/${activity.user.id}`} className="font-semibold hover:text-indigo-600 dark:hover:text-indigo-400">
              {activity.user.name}
            </Link>
            {' '}
            <span className="text-gray-500 dark:text-gray-400">{getActivityText()}</span>
          </p>

          {activity.event && (
            <Link
              href={`/event/${activity.event.id}`}
              className="block mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex gap-3">
                {activity.event.imageUrl && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={activity.event.imageUrl}
                      alt={activity.event.title}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{activity.event.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.event.dateStart).toLocaleDateString()} • {activity.event.venueName}
                  </p>
                </div>
              </div>
            </Link>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {new Date(activity.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}
