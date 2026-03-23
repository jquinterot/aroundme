'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { User, Check, Loader2, MapPin, Calendar, Star } from 'lucide-react';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    isVerified?: boolean;
    followerCount?: number;
    eventCount?: number;
    bio?: string;
  };
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  compact?: boolean;
}

export function UserCard({ user, isFollowing = false, onFollow, onUnfollow, compact = false }: UserCardProps) {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await fetch(`/api/follow?userId=${user.id}`, { method: 'DELETE' });
        onUnfollow?.();
      } else {
        await fetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followingId: user.id }),
        });
        onFollow?.();
      }
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <Link
        href={`/profile/${user.id}`}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            {user.isVerified && (
              <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <Link href={`/profile/${user.id}`} className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              {user.isVerified && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </div>
            {user.bio && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{user.bio}</p>
            )}
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {user.followerCount || 0} seguidores
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {user.eventCount || 0} eventos
        </span>
      </div>

      {currentUser && currentUser.id !== user.id && (
        <button
          onClick={handleClick}
          disabled={loading}
          className={`w-full py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            isFollowing
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isFollowing ? (
            'Siguiendo'
          ) : (
            'Seguir'
          )}
        </button>
      )}
    </div>
  );
}

interface ActivityCardProps {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden flex-shrink-0">
          {activity.user.avatarUrl ? (
            <Image
              src={activity.user.avatarUrl}
              alt={activity.user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-semibold">
              {activity.user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-gray-900">
            <Link href={`/profile/${activity.user.id}`} className="font-semibold hover:text-indigo-600">
              {activity.user.name}
            </Link>
            {' '}
            <span className="text-gray-500">{getActivityText()}</span>
          </p>

          {activity.event && (
            <Link
              href={`/event/${activity.event.id}`}
              className="block mt-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                  <p className="font-medium text-gray-900 truncate">{activity.event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.event.dateStart).toLocaleDateString()} • {activity.event.venueName}
                  </p>
                </div>
              </div>
            </Link>
          )}

          <p className="text-xs text-gray-400 mt-2">
            {new Date(activity.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}

interface FollowerUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  isVerified?: boolean;
}

interface FollowersListProps {
  users: FollowerUser[];
  type: 'followers' | 'following';
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function FollowersList({ users, type, onLoadMore, hasMore }: FollowersListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          {type === 'followers' ? 'Seguidores' : 'Siguiendo'}
        </h3>
        <span className="text-sm text-gray-500">{users.length}</span>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} compact />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full py-3 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-colors"
        >
          Cargar más
        </button>
      )}
    </div>
  );
}
